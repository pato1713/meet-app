import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const App = () => {
  const videoContainer = useRef<HTMLVideoElement>();
  const [roomId, setRoomId] = useState<string>();

  useEffect(() => {
    async function getStream() {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      videoContainer.current.srcObject = stream;
      videoContainer.current.addEventListener("loadedmetadata", () => {
        videoContainer.current.play();
      });
    }

    async function getRoomId() {
      const response = await axios.get<string>("/api/room");
      setRoomId(response.data);
    }

    getRoomId();
    getStream();
  }, []);

  return (
    <div className="main">
      <div className="title">
        {roomId == undefined
          ? "Fetching room id..."
          : `Your room ID is: ${roomId}`}
      </div>
      <div className="video">
        <video ref={videoContainer} />
      </div>
    </div>
  );
};

export default App;
