import { Box, Card, CardMedia, styled } from "@mui/material";
import React, { useCallback, useEffect, useRef } from "react";

const StyledCard = styled(Card)(({ theme }) => ({
  border: `3px solid ${theme.palette.primary.main}`,
  width: "30vw",
}));

type VideoCardProps = {
  mediaProvider: MediaProvider;
  muted?: boolean;
};

const VideoCard = ({ mediaProvider, muted }: VideoCardProps) => {
  const videoRef = useCallback((node: HTMLVideoElement | null) => {
    if (node === null) return;

    node.muted = muted;
    node.srcObject = mediaProvider;
  }, []);

  return (
    <Box>
      <StyledCard>
        <CardMedia ref={videoRef} component={"video"} autoPlay />
      </StyledCard>
    </Box>
  );
};

export default VideoCard;
