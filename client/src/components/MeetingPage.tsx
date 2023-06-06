import React, { useContext, useEffect, useRef } from "react";
import { ConnectionContext } from "../providers/ConnectionProvider";
import styled from "styled-components";
import { HEADER_SIZE } from "../../GlobalStyle";

const MeetinPageContainerStyled = styled.div`
  height: 100%;
  & > div {
    height: inherit;
    display: grid;
    grid-template: auto auto / auto auto;
    justify-items: center;
  }

  video {
    width: 100% !important;
    height: calc((100vh - ${HEADER_SIZE}) / 2) !important;
  }
`;

const MeetingPage: React.FC = () => {
  const ownVideo = useRef<HTMLVideoElement>();
  const videoContainer = useRef<HTMLDivElement>();
  const { webRTCService } = useContext(ConnectionContext);

  useEffect(() => {
    webRTCService.handleRemoteConnectionCallback = (stream, connId) => {
      if (!videoContainer.current) {
        return;
      }

      let nodeAlreadyExist = false;
      for (const node of Array.from(videoContainer.current.children)) {
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
        videoContainer.current.append(newVideo);
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
    <MeetinPageContainerStyled>
      <div ref={videoContainer}>
        <video ref={ownVideo} autoPlay />
      </div>
    </MeetinPageContainerStyled>
  );
};

export default MeetingPage;
