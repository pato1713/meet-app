import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { v4 } from "uuid";

class IOServer {
  server: Server;
  rooms: string[];
  constructor(httpServer: HttpServer) {
    this.server = new Server(httpServer);
    this.rooms = [];

    // logging
    this.server.of("/").adapter.on("create-room", (room) => {
      console.log(`room ${room} was created`);
    });
    this.server.of("/").adapter.on("join-room", (room, id) => {
      console.log(`socket ${id} has joined room ${room}`);
    });
    this.server.of("/").adapter.on("leave-room", (room, id) => {
      console.log(`socket ${id} has left room ${room}`);
    });
  }
}

export default IOServer;
