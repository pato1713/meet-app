import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import RoutingProvider from "./src/providers/RoutingProvider";
import ConnectionProvider from "./src/providers/ConnectionProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import "./styles.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#352F44",
    },
    secondary: {
      main: "#5C5470",
    },
  },

  typography: {
    fontFamily: "Roboto",
    fontSize: 16,
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ConnectionProvider>
    <StrictMode>
      <ThemeProvider theme={theme}>
        <RoutingProvider>
          <App />
        </RoutingProvider>
      </ThemeProvider>
    </StrictMode>
  </ConnectionProvider>
);
