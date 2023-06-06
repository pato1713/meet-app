import React, { useMemo, useState } from "react";
import WebRTCService from "../services/WebRTCService";

interface IConnectionContext {
  webRTCService: WebRTCService;
  roomId: string;
  setNewRoomId: (newRoomId: string) => void;
}

export const ConnectionContext = React.createContext<IConnectionContext>(null);

const ConnectionProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const webRTCService = useMemo(() => new WebRTCService(), []);

  const [roomId, setRoomId] = useState<string>();

  const setNewRoomId = (newRoomId: string) => {
    setRoomId(newRoomId);
  };

  return (
    <ConnectionContext.Provider
      value={{
        webRTCService: webRTCService,
        setNewRoomId: setNewRoomId,
        roomId: roomId,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
