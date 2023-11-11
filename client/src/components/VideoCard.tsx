import { Card, CardMedia, styled, useTheme } from "@mui/material";
import React, { useCallback } from "react";

const StyledCard = styled(Card)(({ theme }) => ({
  boxSizing: "border-box",
  border: `3px solid ${theme.palette.primary.main}`,
  width: "100%",
  height: "100%",
  background: "transparent",
  zIndex: 4,
}));

type VideoCardProps = {
  mediaProvider: MediaProvider;
  muted?: boolean;
};

const VideoCard = ({ mediaProvider, muted }: VideoCardProps) => {
  const theme = useTheme();
  const videoRef = useCallback((node: HTMLVideoElement | null) => {
    if (node === null) return;

    node.muted = muted;
    node.srcObject = mediaProvider;
  }, []);

  return (
    <StyledCard>
      <CardMedia ref={videoRef} component={"video"} autoPlay />
    </StyledCard>
  );
};

export default VideoCard;
