import React, { ChangeEvent, useContext, useState } from "react";
import { RoutingContext } from "../providers/RoutingProvider";
import { ConnectionContext } from "../providers/ConnectionProvider";
import {
  StyledButton,
  StyledInput,
  StyledPaper,
} from "../components/CustomMui";
import { GLOBAL_PRIMARY } from "../../GlobalStyle";
import { Box, Container, Typography, styled } from "@mui/material";

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
  backgroundColor: theme.palette.secondary.light,
  width: "100%",
}));

const Main = () => {
  const [inputValue, setInputValue] = useState<string>();
  const { setNewRoomId, webRTCService } = useContext(ConnectionContext);
  const { navigate } = useContext(RoutingContext);

  const createRoomHandler = async () => {
    const result = await webRTCService.createRoom();
    if (typeof result === "string") {
      setNewRoomId(result);
      navigate("/meeting");
    }
  };

  const joinRoomHandler = async () => {
    const result = await webRTCService.joinRoom(inputValue);
    if (result === "join-room-ack") {
      setNewRoomId(inputValue);
      navigate("/meeting");
    }
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setInputValue(value);
  };

  return (
    <StyledContainer>
      <StyledPaper>
        <Typography
          sx={{
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
            fontSize: "24px",
            height: "150px",
          }}
        >
          Create new room using button below
        </Typography>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "80px" }}
        >
          <StyledButton
            onClick={() => {
              createRoomHandler();
            }}
          >
            Create room
          </StyledButton>
        </Box>
      </StyledPaper>
      <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
        <Typography>OR</Typography>
      </Box>
      <StyledPaper>
        <Typography
          sx={{
            display: "flex",
            height: "150px",
            textAlign: "center",
            fontSize: "24px",
          }}
        >
          Join already existing room by typing in its id and pressing button
          below
        </Typography>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "80px" }}
        >
          <StyledInput
            value={inputValue}
            onChange={onInputChange}
            placeholder="room-id"
          />
          <StyledButton onClick={joinRoomHandler} disabled={!inputValue}>
            Join room
          </StyledButton>
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Main;
