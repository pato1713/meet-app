import React, { MouseEvent } from "react";
import styled from "styled-components";
import {
  GLOBAL_PRIMARY,
  GLOBAL_SECONDARY,
  GLOBAL_TERTIARY,
} from "../../GlobalStyle";

const DISABLED_COLOR = "#202020";
const DISABLED_BACKGROUND_COLOR = "#d1d1d1";

const StyledButton = styled.button<{}>`
  appearance: none;
  background-color: ${GLOBAL_PRIMARY};
  border-width: 0;
  box-sizing: border-box;
  color: #000000;
  cursor: pointer;
  display: inline-block;
  font-family: Clarkson, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1em;
  margin: 0;
  opacity: 1;
  outline: 0;
  padding: 1.5em 2.2em;
  position: relative;
  text-align: center;
  text-decoration: none;
  text-rendering: geometricprecision;
  text-transform: uppercase;
  transition: opacity 300ms cubic-bezier(0.694, 0, 0.335, 1),
    background-color 100ms cubic-bezier(0.694, 0, 0.335, 1),
    color 100ms cubic-bezier(0.694, 0, 0.335, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  white-space: nowrap;

  &:before {
    animation: opacityFallbackOut 0.5s step-end forwards;
    backface-visibility: hidden;
    background-color: ${GLOBAL_TERTIARY};
    clip-path: polygon(-1% 0, 0 0, -25% 100%, -1% 100%);
    content: "";
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transform: translateZ(0);
    transition: clip-path 0.5s cubic-bezier(0.165, 0.84, 0.44, 1),
      -webkit-clip-path 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
    width: 100%;
  }

  &:hover:before {
    animation: opacityFallbackIn 0s step-start forwards;
    clip-path: polygon(0 0, 101% 0, 101% 101%, 0 101%);
  }

  &:after {
    background-color: ${GLOBAL_TERTIARY};
  }

  > span {
    z-index: 1;
    position: relative;
  }

  &:disabled {
    background-color: ${DISABLED_BACKGROUND_COLOR};
    color: ${DISABLED_COLOR};

    &:before {
      transition: none;
    }
    &:after {
      background-color: ${DISABLED_BACKGROUND_COLOR};
    }
    &:hover:before {
      transition: none;
      color: ${DISABLED_COLOR};
      background-color: ${DISABLED_BACKGROUND_COLOR};
    }
  }
`;

const Button: React.FC<{
  text: string;
  onClick: (event: MouseEvent) => void;
  disabled?: boolean;
}> = ({ text, onClick, disabled }) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      <span>{text}</span>
    </StyledButton>
  );
};

export default Button;
