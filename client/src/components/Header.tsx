import React from "react";
import styled from "styled-components";

const StyledHeader = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  height: 80px;
  background-color: #681c86;
  width: 100%;
`;

const Header: React.FC<{ roomId: string }> = ({ roomId }) => {
  return (
    <StyledHeader>
      <div>{roomId}</div>
      <button
        onClick={() => {
          navigator.clipboard.writeText(roomId);
        }}
      >
        COPY
      </button>
    </StyledHeader>
  );
};

export default Header;
