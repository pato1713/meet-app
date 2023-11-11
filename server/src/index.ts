import express, { Express } from "express";
import dotenv from "dotenv";
import SocketIOServer from "./IOServer";

dotenv.config({
  path: "../.env",
});

const app: Express = express();
const server = app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `⚡️[server]: Server is running at http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}`
  );
});

const ioServer = new SocketIOServer(server);
