import React, { useContext, useEffect, useRef } from "react";
import { ConnectionContext } from "../providers/ConnectionProvider";

const MeetingPage: React.FC = () => {
  const ownVideo = useRef<HTMLVideoElement>();
  const remoteVideo = useRef<HTMLVideoElement>();
  const videoContainer = useRef<HTMLDivElement>();

  const { roomId, webRTCService } = useContext(ConnectionContext);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    ownVideo.current.muted = true;
    ownVideo.current.srcObject = stream;

    // add stream tracks to the webRTCService
    for (const track of stream.getTracks()) {
      webRTCService.addTrack(track, stream);
    }

    ownVideo.current.addEventListener("loadedmetadata", () => {
      ownVideo.current.play();
    });

    return stream;
  }

  useEffect(() => {
    // create callback
    webRTCService.handleRemoteConnectionCallback = (stream) => {
      if (!remoteVideo.current.srcObject) {
        remoteVideo.current.srcObject = stream;
      }
    };

    start();
  }, []);

  return (
    <div>
      <div>{roomId}</div>
      <div className="video" ref={videoContainer}>
        <video ref={ownVideo} />
        <video ref={remoteVideo} />
      </div>
    </div>
  );
};

export default MeetingPage;
