import React, { useContext, useEffect, useRef } from "react";
import { ConnectionContext } from "../providers/ConnectionProvider";

const MeetingPage: React.FC = () => {
  const ownVideo = useRef<HTMLVideoElement>();
  const videoContainer = useRef<HTMLDivElement>();
  const remoteVideosContainer = useRef<HTMLDivElement>();
  const { roomId, webRTCService } = useContext(ConnectionContext);

  useEffect(() => {
    webRTCService.handleRemoteConnectionCallback = (stream, connId) => {
      if (!remoteVideosContainer.current) {
        return;
      }

      let nodeAlreadyExist = false;
      for (const node of Array.from(remoteVideosContainer.current.children)) {
        const videoElem = node as HTMLVideoElement;
        if (videoElem.id == connId) {
          nodeAlreadyExist = true;
          videoElem.srcObject = stream;
          break;
        }
      }

      if (!nodeAlreadyExist) {
        const newVideo = document.createElement("video");
        newVideo.id = connId;
        newVideo.autoplay = true;
        newVideo.srcObject = stream;
        remoteVideosContainer.current.append(newVideo);
      }
    };
  }, []);

  useEffect(() => {
    if (webRTCService.stream) {
      ownVideo.current.muted = true;
      ownVideo.current.srcObject = webRTCService.stream;
    }
  }, [webRTCService.stream]);

  return (
    <div>
      <div>{roomId}</div>
      <div ref={videoContainer}>
        <div className="your-video">
          <video ref={ownVideo} autoPlay />
        </div>
        <div className="remote-videos" ref={remoteVideosContainer}></div>
      </div>
    </div>
  );
};

export default MeetingPage;
