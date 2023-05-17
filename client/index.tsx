import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalStyle from "./src/components/GlobalStyle";
import RoutingProvider from "./src/providers/RoutingProvider";
import ConnectionProvider from "./src/providers/ConnectionProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StrictMode>
    <GlobalStyle />
    <RoutingProvider>
      <ConnectionProvider>
        <App />
      </ConnectionProvider>
    </RoutingProvider>
  </StrictMode>
);
