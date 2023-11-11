import React, { useContext, useEffect, useRef, useState } from "react";
import { ConnectionContext } from "../providers/ConnectionProvider";
import { HEADER_SIZE } from "../../GlobalStyle";
import { Box, Card, CardMedia, Typography, styled } from "@mui/material";
import VideoCard from "./VideoCard";

/* height: 100%;
  & > div {
    height: inherit;
    display: grid;
    grid-template: auto auto / auto auto;
    justify-items: center;
  }

  video {
    width: 100% !important;
    height: calc((100vh - ${HEADER_SIZE}) / 2) !important;
  } */

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  // flexDirection: "row",
  // height: "500px",
  // flexWrap: "wrap",
}));

const MeetingPage: React.FC = () => {
  const { webRTCService } = useContext(ConnectionContext);
  const [remoteVideos, setRemoteVideos] = useState<
    Record<string, MediaProvider>
  >({});

  useEffect(() => {
    webRTCService.handleRemoteConnectionCallback = (stream, connId) => {
      setRemoteVideos((prevVideos) => ({ ...prevVideos, [connId]: stream }));
    };
  }, []);

  return (
    <StyledBox>
      {webRTCService.stream && (
        <VideoCard muted mediaProvider={webRTCService.stream} />
      )}

      {Object.entries(remoteVideos).map(([id, stream]) => (
        <VideoCard key={id} mediaProvider={stream} />
      ))}
    </StyledBox>
  );
};

export default MeetingPage;
