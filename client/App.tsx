import React from "react";
import Header from "./src/components/Header";
import MeetingPage from "./src/components/MeetingPage";
import Route from "./src/components/Route";
import MainPage from "./src/components/MainPage";
import styled from "styled-components";
import { HEADER_SIZE } from "./GlobalStyle";

const MainContent = styled.div`
  margin-top: ${HEADER_SIZE};
  height: calc(100vh - ${HEADER_SIZE});
`;

const App = () => {
  return (
    <div>
      <Header />
      <MainContent>
        <Route path="/">
          <MainPage />
        </Route>
        <Route path="/meeting">
          <MeetingPage />
        </Route>
      </MainContent>
    </div>
  );
};

export default App;
