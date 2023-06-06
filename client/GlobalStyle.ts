import { createGlobalStyle } from "styled-components";

export const HEADER_SIZE = "60px";
export const GLOBAL_BACKGROUND = "#e8eef1";
export const GLOBAL_PRIMARY = "#1e3d58";
export const GLOBAL_SECONDARY = "#057dcd";
export const GLOBAL_TERTIARY = "#43b0f1";

const GlobalStyle = createGlobalStyle`
    body{
        margin: 0;
        padding: 0;
        background: ${GLOBAL_BACKGROUND};
    }
`;

export default GlobalStyle;
