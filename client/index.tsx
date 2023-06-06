import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalStyle from "./GlobalStyle";
import RoutingProvider from "./src/providers/RoutingProvider";
import ConnectionProvider from "./src/providers/ConnectionProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ConnectionProvider>
    <StrictMode>
      <GlobalStyle />
      <RoutingProvider>
        <App />
      </RoutingProvider>
    </StrictMode>
  </ConnectionProvider>
);
