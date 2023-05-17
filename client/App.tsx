import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Header from "./src/components/Header";
import { io } from "socket.io-client";
import MeetingPage from "./src/components/MeetingPage";
import Route from "./src/components/Route";
import MainPage from "./src/components/MainPage";

const App = () => {
  return (
    <div className="main">
      <Route path="/">
        <MainPage />
      </Route>

      <Route path="/meeting">
        <MeetingPage />
      </Route>
    </div>
  );
};

export default App;
