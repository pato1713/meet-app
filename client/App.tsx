import React, { useContext } from "react";
import Header from "./src/components/Header/Header";
import MeetingPage from "./src/components/MeetingPage";
import Route from "./src/components/Route";
import Main from "./src/pages/Main";
import { styled } from "@mui/material";
import { HEADER_SIZE } from "./GlobalStyle";
import { ConnectionContext } from "./src/providers/ConnectionProvider";
import { RoutingContext } from "./src/providers/RoutingProvider";

const RoutingContextWrappper = styled("div")(({ theme }) => ({
  padding: "10px",
  background: theme.palette.secondary.light,
  height: `calc(100vh - ${HEADER_SIZE} - 24px)`,
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
}));

const App = () => {
  const { roomId } = useContext(ConnectionContext);
  const { navigate } = useContext(RoutingContext);

  if (roomId) navigate("/meeting");

  return (
    <div>
      <Header />

      <RoutingContextWrappper>
        <Route path="/">
          <Main />
        </Route>
        <Route path="/meeting">
          <MeetingPage />
        </Route>
      </RoutingContextWrappper>
    </div>
  );
};

export default App;
