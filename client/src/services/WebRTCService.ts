import { Socket, io } from "socket.io-client";

const stunServers = [
  "stun1.l.google.com:19302",
  "stun2.l.google.com:19302",
  "stun3.l.google.com:19302",
  "stun4.l.google.com:19302",
];

const rtcConfig = {
  iceServers: [{ urls: "stun:stunserver.org" }],
};

class PeerConnection {
  targetSocketId: string;
  connection: RTCPeerConnection;
  offerInProgress: boolean;
  socket: Socket;

  constructor(
    id: string,
    socket: Socket,
    handleVideoCallback: (stream: MediaStream) => void
  ) {
    this.targetSocketId = id;
    this.connection = new RTCPeerConnection(rtcConfig);
    this.socket = socket;
    this.connection.addEventListener(
      "negotiationneeded",
      this.negotiationEndHandler
    );
    this.connection.addEventListener("icecandidate", this.iceCandidateHandler);

    // handle incoming connection
    this.connection.ontrack = ({ track, streams }) => {
      track.onunmute = () => {
        handleVideoCallback(streams[0]);
      };
    };
  }

  negotiationEndHandler = async () => {
    this.offerInProgress = true;
    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);

    this.socket.emit("sdp-offer", JSON.stringify({ description: offer }));

    this.offerInProgress = false;
  };

  iceCandidateHandler = ({ candidate }: any) => {
    this.socket.emit("ice-candidate", JSON.stringify(candidate));
  };
}

class WebRTCService {
  socket: Socket;
  connections: Map<string, PeerConnection>;
  makingOfferInProgress: boolean;
  handleRemoteConnectionCallback: (stream: MediaStream) => void;

  constructor() {
    this.socket = io();
    this.makingOfferInProgress = false;
    this.connections = new Map();
    this.handleRemoteConnectionCallback = null;
    this.socket.on("connect", this.createListeners);
  }

  createListeners = () => {
    this.socket.on("new-user", (socket) => {
      this.startNewConnection(socket.id);
    });

    //get ice-candidate from remote peers
    this.socket.on("ice-candidate", ({ candidate, socketId }) => {
      const peer = this.connections.get(socketId);
      peer && peer.connection.addIceCandidate(candidate);
    });

    this.socket.on("sdp-offer", ({ description, socketId }) => {
      const peer = this.connections.get(socketId);
      if (peer) {
        peer.connection.setRemoteDescription(description);
        peer.connection.ontrack = (track) => {
          console.log("track", track);
        };
      }
    });
  };

  startNewConnection = (id: string) => {
    const newConnection = new PeerConnection(id, this.socket, (stream) => {
      console.log("stream", stream);
    });
    this.connections.set(id, newConnection);
  };

  createRoom = () => {
    const result = this.socket.emitWithAck("create-room");
    return result;
  };

  joinRoom = (roomId: string) => {
    const result = this.socket.emitWithAck("join-room", roomId);
    return result;
  };

  addTrack = (track: MediaStreamTrack, stream: MediaStream) => {
    for (const peer of Array.from(this.connections.values())) {
      peer.connection.addTrack(track, stream);
    }
  };
}

export default WebRTCService;
