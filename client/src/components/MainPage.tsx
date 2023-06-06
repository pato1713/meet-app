import React, { ChangeEvent, useContext, useState } from "react";
import { RoutingContext } from "../providers/RoutingProvider";
import axios from "axios";
import { ConnectionContext } from "../providers/ConnectionProvider";
import Button from "./Button";
import styled from "styled-components";
import { GLOBAL_PRIMARY } from "../../GlobalStyle";

const StyledMainPageContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-evenly;

  & > div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    :first-child {
      border-right: 3px ${GLOBAL_PRIMARY} solid;
    }
    :last-child {
      border-left: 3px ${GLOBAL_PRIMARY} solid;
    }
  }
`;

const MainPage = () => {
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
    <StyledMainPageContainer>
      <div className="left">
        <Button
          text="Create room"
          onClick={() => {
            createRoomHandler();
          }}
        />
      </div>
      <div className="right">
        <div>
          <input
            value={inputValue}
            onChange={onInputChange}
            placeholder="room-id"
          />
          <Button
            text="Join room"
            onClick={joinRoomHandler}
            disabled={!inputValue}
          />
        </div>
      </div>
    </StyledMainPageContainer>
  );
};

export default MainPage;
