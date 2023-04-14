import { Router } from "express";
import IOServer from "../IOServer";
import { v4 } from "uuid";

interface JoinRoomData {
  socketId: string;
  roomId: string;
}

class APIRoutes {
  router: Router;
  io: IOServer;

  constructor(io: IOServer) {
    this.router = Router();
    this.io = io;

    this.router.get("/room", (req, res) => {
      const radomRoomId = v4().replace(/-/g, "");
      res.send(radomRoomId).status(200);
    });

    this.router.post("/join-room", async (req, res) => {
      const data = req.body as JoinRoomData;

      try {
        this.io.server.in(data.socketId).socketsJoin(data.roomId);
        res.send("success").status(200);
      } catch {
        res.send("error").status(500);
      }
    });
  }
}

export default APIRoutes;
