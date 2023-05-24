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
    handleVideoCallback: (stream: MediaStream) => void,
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
        handleVideoCallback(streams[0]);
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
    this.socket && this.socket.emit("ice-candidate", JSON.stringify(candidate));
  };
}

class WebRTCService {
  socket: Socket;
  connections: Map<string, PeerConnection>;
  makingOfferInProgress: boolean;
  handleRemoteConnectionCallback: (stream: MediaStream) => void;
  tracks: any[];

  constructor() {
    this.socket = io();
    this.makingOfferInProgress = false;
    this.connections = new Map();
    this.handleRemoteConnectionCallback = null;
    this.socket.on("connect", this.createListeners);
    this.tracks = [];
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

  createListeners = () => {
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
      peer.connection.addTrack(
        this.tracks.at(-1).track,
        this.tracks.at(-1).stream
      );
      peer.connection.setRemoteDescription(description);
      const answer = await peer.connection.createAnswer();
      await peer.connection.setLocalDescription(answer);
      this.socket.emit("sdp-answer", { answer: answer, target: socketId });
      peer.connection.addTrack(this.tracks[0].track, this.tracks[0].stream);
    });

    this.socket.on("sdp-answer", ({ description, socketId }) => {
      const peer = this.getPeerConnection(socketId);
      peer.connection.setRemoteDescription(description);
    });
  };

  startNewConnection = (id: string) => {
    const newConnection = new PeerConnection(
      id,
      (stream) => {
        console.log("stream", stream);
      },
      this.socket
    );
    this.connections.set(id, newConnection);
    newConnection.connection.addTrack(
      this.tracks.at(-1).track,
      this.tracks.at(-1).stream
    );
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

  addTrack = (track: MediaStreamTrack, stream: MediaStream) => {
    this.tracks.push({ track: track, stream: stream });
    // for (const peer of Array.from(this.connections.values())) {
    //   peer.connection.addTrack(track, stream);
    // }
  };
}

export default WebRTCService;
