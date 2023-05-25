import { Socket, io } from "socket.io-client";

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
    handleVideoCallback: (stream: MediaStream, connId: string) => void,
    socket?: Socket
  ) {
    this.targetSocketId = id;
    this.connection = new RTCPeerConnection(rtcConfig);
    this.socket = socket;
    this.connection.addEventListener("signalingstatechange", (ev) => {});
    this.connection.addEventListener("icecandidate", this.iceCandidateHandler);
    this.connection.addEventListener("icecandidateerror", (event) => {
      console.log(event);
    });

    // handle incoming connection
    this.connection.ontrack = ({ track, streams }) => {
      console.log("Incoming connection");
      track.onunmute = () => {
        handleVideoCallback(streams[0], this.targetSocketId);
      };
    };
  }

  sendSdpOffer = async () => {
    const offer = await this.connection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await this.connection.setLocalDescription(offer);

    this.socket && this.socket.emit("sdp-offer", offer);
  };

  iceCandidateHandler = ({ candidate }: any) => {
    this.socket && this.socket.emit("ice-candidate", candidate);
    // this.connection.addIceCandidate(candidate);
  };
}

class WebRTCService {
  socket: Socket;
  connections: Map<string, PeerConnection>;
  makingOfferInProgress: boolean;
  handleRemoteConnectionCallback: (stream: MediaStream, connId: string) => void;
  stream: MediaStream | null;

  constructor() {
    this.socket = io();
    this.makingOfferInProgress = false;
    this.connections = new Map();
    this.handleRemoteConnectionCallback = null;
    this.socket.on("connect", this.createListeners);
    this.stream = null;
  }

  setStream(stream: MediaStream) {
    this.stream = stream;
  }

  getPeerConnection(socketId: string) {
    let peer: PeerConnection;
    const connectionExist = this.connections.has(socketId);
    if (!connectionExist) {
      peer = new PeerConnection(socketId, this.handleRemoteConnectionCallback);

      this.connections.set(socketId, peer);
      return peer;
    } else {
      return this.connections.get(socketId);
    }
  }

  createListeners = async () => {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    this.socket.on("new-user", (socketId) => {
      this.startNewConnection(socketId);
    });

    //get ice-candidate from remote peers
    this.socket.on("ice-candidate", ({ candidate, socketId }) => {
      const peer = this.getPeerConnection(socketId);
      peer.connection.addIceCandidate(candidate);
    });

    // only for callee
    this.socket.on("sdp-offer", async ({ description, socketId }) => {
      const peer = this.getPeerConnection(socketId);

      if (this.stream) {
        for (const track of this.stream.getTracks()) {
          peer.connection.addTrack(track, this.stream);
        }
      }

      peer.connection.setRemoteDescription(description);
      const answer = await peer.connection.createAnswer();
      await peer.connection.setLocalDescription(answer);
      this.socket.emit("sdp-answer", { answer: answer, target: socketId });
    });

    this.socket.on("sdp-answer", ({ description, socketId }) => {
      const peer = this.getPeerConnection(socketId);
      peer.connection.setRemoteDescription(description);
    });
  };

  startNewConnection = (id: string) => {
    const newConnection = new PeerConnection(
      id,
      this.handleRemoteConnectionCallback,
      this.socket
    );
    this.connections.set(id, newConnection);
    if (this.stream) {
      for (const track of this.stream.getTracks()) {
        newConnection.connection.addTrack(track, this.stream);
      }
    }
    newConnection.sendSdpOffer();
  };

  createRoom = () => {
    const result = this.socket.emitWithAck("create-room");
    return result;
  };

  joinRoom = (roomId: string) => {
    const result = this.socket.emitWithAck("join-room", roomId);
    return result;
  };
}

export default WebRTCService;
