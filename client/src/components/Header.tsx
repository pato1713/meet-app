import React, { useContext } from "react";
import styled from "styled-components";
import { ConnectionContext } from "../providers/ConnectionProvider";
import {
  GLOBAL_BACKGROUND,
  GLOBAL_PRIMARY,
  HEADER_SIZE,
} from "../../GlobalStyle";

const StyledHeader = styled.div`
  display: flex;
  position: fixed;
  align-items: center;
  top: 0;
  height: ${HEADER_SIZE};
  background-color: ${GLOBAL_PRIMARY};
  width: 100%;
  color: ${GLOBAL_BACKGROUND};

  & > div {
    flex: 1 1 0px;
    display: flex;
    justify-content: center;
  }
`;

const Header: React.FC = () => {
  const { roomId } = useContext(ConnectionContext);

  return (
    <StyledHeader>
      <div>My Meeting App</div>

      <div>{roomId ? `RoomID: ${roomId}` : ""}</div>
    </StyledHeader>
  );
};

export default Header;
