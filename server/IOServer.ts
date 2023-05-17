import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { v4 } from "uuid";
// import wrtc from "wrtc";

const rtcConfig = {
  iceServers: [{ urls: "stun:stunserver.org" }],
};

export class ChatRoom {
  id: string;
  inputConnections: Map<string, RTCPeerConnection>;
  outputConnections: Map<string, RTCPeerConnection>;

  constructor() {
    this.id = v4().replace(/-/g, "");
    this.inputConnections = new Map();
    this.outputConnections = new Map();
  }

  async addNewInputConnection(
    socket: Socket,
    description: RTCSessionDescription
  ): Promise<boolean> {
    if (this.inputConnections.has(socket.id)) return false;

    const newConn = new RTCPeerConnection(rtcConfig);

    newConn.onicecandidate = (ev) => {
      socket.emit("ice-candidate", ev.candidate);
    };

    await newConn.setRemoteDescription(description);
    const localSdp = await newConn.createAnswer({
      offerToReceiveAudio: false,
      offerToReceiveVideo: false,
    });
    await newConn.setLocalDescription(localSdp);

    socket.emit("sdp-ack", JSON.stringify(localSdp));

    this.inputConnections.set(socket.id, newConn);

    newConn.ontrack = (e) => {
      // transfer stream to all output connections
      const stream = e.streams[0];
      for (const peerConnection of this.outputConnections.values()) {
        if (peerConnection.connectionState == "connected") {
          stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
          });
        }
      }
    };

    return true;
  }
  async addIceCandidateInput(socketId, candidate: RTCIceCandidateInit) {
    const peerConnection = this.inputConnections.get(socketId);
    if (peerConnection) {
      peerConnection.addIceCandidate(candidate);
    }
  }

  async addIceCandidateOutput(socketId, candidate: RTCIceCandidateInit) {
    const peerConnection = this.outputConnections.get(socketId);
    if (peerConnection) {
      peerConnection.addIceCandidate(candidate);
    }
  }

  async setRemoteDescription(socketId, desciption: RTCSessionDescription) {
    const peerConnection = this.outputConnections.get(socketId);
    if (peerConnection) {
      peerConnection.setRemoteDescription(desciption);
    }
  }

  async addNewOutputConnection(socket: Socket, targetSocketId: string) {
    const newConn = new RTCPeerConnection(rtcConfig);

    newConn.onnegotiationneeded = async (ev) => {
      const offer = await newConn.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
      });
      await newConn.setLocalDescription(offer);

      socket
        .to(targetSocketId)
        .emit(
          "sdp-client",
          JSON.stringify({ description: offer, userSocketId: targetSocketId })
        );
    };

    newConn.onicecandidate = (ev) => {
      socket.emit("ice-candidate-client", ev.candidate);
    };

    this.outputConnections.set(socket.id + targetSocketId, newConn);
  }
}

class IOServer {
  server: Server;
  rooms: Map<string, ChatRoom>;
  roomMapping: Map<string, string>;

  constructor(httpServer: HttpServer) {
    this.server = new Server(httpServer);
    this.roomMapping = new Map<string, string>();
    this.rooms = new Map();

    // logging
    this.server.of("/").adapter.on("create-room", (room) => {
      console.log(`room ${room} was created`);
    });
    this.server.of("/").adapter.on("join-room", (room, id) => {
      console.log(`socket ${id} has joined room ${room}`);
    });
    this.server.of("/").adapter.on("leave-room", (room, id) => {
      console.log(`socket ${id} has left room ${room}`);
    });

    this.server.on("connection", (socket) => {
      this.onNewSocketConnection(socket);
    });
  }

  onNewSocketConnection(socket: Socket) {
    socket.on("create-room", () => {
      const newRoom = new ChatRoom();

      this.rooms.set(newRoom.id, newRoom);
      this.roomMapping.set(socket.id, newRoom.id);

      //join room
      socket.join(newRoom.id);

      socket.emit("create-room-ack", "success");
    });

    socket.on("join-room", (data: any) => {
      const roomId = this.roomMapping.get(socket.id);
      if (roomId) {
        const room = this.rooms.get(roomId);
        if (room) {
          for (const targetSocketId of room.inputConnections.keys()) {
            const tempSocket = this.server.sockets.sockets.get(targetSocketId);
            tempSocket && room.addNewOutputConnection(tempSocket, socket.id);
            room.addNewOutputConnection(socket, targetSocketId);
          }
        }
      }
    });

    socket.on("leave-room", () => {});

    socket.on("sdp", (data: string) => {
      const sdpData = JSON.parse(data) as {
        description: RTCSessionDescription;
      };

      const roomId = this.roomMapping.get(socket.id);
      if (roomId) {
        const room = this.rooms.get(roomId);
        if (room && sdpData.description.type === "offer") {
          room.addNewInputConnection(socket, sdpData.description);
        }
      }
      if (roomId) this.server.to(roomId).emit("session-desciption", data);
    });

    socket.on("sdp-client-ack", (data: string) => {
      const { description, userId } = JSON.parse(data);
      const roomId = this.roomMapping.get(socket.id);

      if (roomId) {
        const room = this.rooms.get(roomId);
        if (room) {
          room?.setRemoteDescription(socket.id + userId, description);
        }
      }
    });

    socket.on("ice-candidate", (data: string) => {
      const iceCandidate = JSON.parse(data);
      const roomId = this.roomMapping.get(socket.id);

      if (roomId) {
        const room = this.rooms.get(roomId);
        if (room) {
          room?.addIceCandidateInput(socket.id, iceCandidate);
        }
      }
    });
    socket.on("ice-candidate-client", (data: string) => {
      const { candidate, userId } = JSON.parse(data);
      const roomId = this.roomMapping.get(socket.id);

      if (roomId) {
        const room = this.rooms.get(roomId);
        if (room) {
          room?.addIceCandidateOutput(socket.id + userId, candidate);
        }
      }
    });
  }
}

export default IOServer;
