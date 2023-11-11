import React, { useContext, useEffect, useState } from "react";
import { ConnectionContext } from "../providers/ConnectionProvider";
import { Box, styled } from "@mui/material";
import VideoCard from "./VideoCard";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "auto auto",
  placeContent: "center center",

  "&.applyGap": {
    gap: "0.15rem 0.5rem",
  },
}));

const OwnVideoBox = styled(Box)(({ theme }) => ({
  maxHeight: "85vh",
  maxWidth: "1200px",
  "&.inCorner": {
    display: "flex",
    width: "30vw",
    position: "absolute",
    bottom: 5,
    right: 5,
    zIndex: 2,
  },
}));

const RemoteVideoBox = styled(Box)(({ theme }) => ({
  maxHeight: "85vh",
  maxWidth: "1200px",
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

  const calculateWidthFromVideosNo = () => {
    switch (Object.keys(remoteVideos).length) {
      case 0:
      case 1:
        return "90vw";
      case 2:
      case 3:
        return "45vw";
    }
  };

  const applyGap = Object.keys(remoteVideos).length > 1;
  const isOwnVideoInCorner =
    Object.keys(remoteVideos).length && Object.keys(remoteVideos).length !== 3;

  return (
    <StyledBox className={applyGap ? "applyGap" : ""}>
      {Object.entries(remoteVideos).map(([id, stream]) => (
        <RemoteVideoBox sx={{ width: calculateWidthFromVideosNo() }}>
          <VideoCard key={id} mediaProvider={stream} />
        </RemoteVideoBox>
      ))}

      <OwnVideoBox
        className={isOwnVideoInCorner && "inCorner"}
        style={
          !isOwnVideoInCorner
            ? {
                width: calculateWidthFromVideosNo(),
              }
            : {}
        }
      >
        {webRTCService.stream && (
          <VideoCard muted mediaProvider={webRTCService.stream} />
        )}
      </OwnVideoBox>
    </StyledBox>
  );
};

export default MeetingPage;
