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

class WebRTCService {
  socket: Socket;
  outputConnection: RTCPeerConnection;
  inputConnections: Map<string, RTCPeerConnection>;
  makingOfferInProgress: boolean;
  handleRemoteConnectionCallback: (stream: MediaStream) => void;

  constructor() {
    this.socket = io();
    this.makingOfferInProgress = false;
    this.handleRemoteConnectionCallback = null;
    this.inputConnections = new Map();
    this.socket.on("connect", this.createRoom);
    this.socket.on("create-room-ack", () => {
      this.startListeners();
    });
  }

  // startConnection = () => {
  //   if (this.socket.connected) this.startListeners();
  // };

  startListeners = () => {
    console.log("IO Socket connected");
    this.outputConnection = new RTCPeerConnection(rtcConfig);

    this.socket.on(
      "sdp-ack-input",
      async (description: RTCSessionDescription) => {
        if (
          description.type === "offer" &&
          this.makingOfferInProgress &&
          this.outputConnection.signalingState !== "stable"
        ) {
          console.error("Making offer conflict");
          return;
        }

        await this.outputConnection.setRemoteDescription(description);

        if (description.type === "offer") {
          await this.outputConnection.setLocalDescription();
        }
      }
    );

    //get ice-candidate from remote peers
    this.socket.on("ice-candidate-cilent", (candidate: RTCIceCandidate) => {
      this.outputConnection.addIceCandidate(candidate);
    });

    this.outputConnection.addEventListener("negotiationneeded", async () => {
      this.makingOfferInProgress = true;
      const offer = await this.outputConnection.createOffer();
      await this.outputConnection.setLocalDescription(offer);

      this.socket.emit("sdp-input", JSON.stringify({ description: offer }));

      this.makingOfferInProgress = false;
    });

    // send ice candidate to the server that will pass it to the remote peer
    this.outputConnection.addEventListener("icecandidate", ({ candidate }) => {
      this.socket.emit("ice-candidate", JSON.stringify(candidate));
    });

    // handle incoming connection
    this.outputConnection.ontrack = ({ track, streams }) => {
      track.onunmute = () => {
        this.handleRemoteConnectionCallback(streams[0]);
      };
    };

    this.socket.on("sdp-client", async ({ description, userSocketId }) => {
      const newConn = new RTCPeerConnection(rtcConfig);
      this.inputConnections.set(this.socket.id + userSocketId, newConn);

      // callback that will create new video element for us and will return reference to it
      // const newVideoRef = callbackCreatingVideoRef();

      newConn.onicecandidate = (ev) => {
        this.socket.emit("ice-candidate-client", {
          candidate: ev.candidate,
          userId: userSocketId,
        });
      };

      await newConn.setRemoteDescription(description);
      const localSdp = await newConn.createAnswer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
      });
      await newConn.setLocalDescription(localSdp);

      this.socket.emit("sdp-client-ack", JSON.stringify(localSdp));

      newConn.ontrack = (e) => {
        const stream = e.streams[0];
        stream.getTracks().forEach((track) => {
          // newVideoRef.addTrck(track); //TODO!!s
        });
      };
    });
  };

  createRoom = () => {
    if (this.socket.connected) {
      this.socket.emit("create-room");
    }
  };

  addTrack(track: MediaStreamTrack, stream: MediaStream) {
    this.outputConnection && this.outputConnection.addTrack(track, stream);
  }
}

export default WebRTCService;
