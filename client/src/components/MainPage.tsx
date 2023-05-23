import React, { ChangeEvent, useContext, useState } from "react";
import { RoutingContext } from "../providers/RoutingProvider";
import axios from "axios";
import { ConnectionContext } from "../providers/ConnectionProvider";

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
    <div>
      <div className="left">
        <div>
          <button
            onClick={() => {
              createRoomHandler();
            }}
          >
            Create room
          </button>
        </div>
      </div>
      <div className="right">
        <div>
          <input
            value={inputValue}
            onChange={onInputChange}
            placeholder="room-id"
          />
          <button onClick={joinRoomHandler}>Join room</button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
