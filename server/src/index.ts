import express, { Express } from "express";
import dotenv from "dotenv";
import SocketIOServer from "./IOServer";
import path = require("path");

dotenv.config({
  path: "../.env",
});

const app: Express = express();
app.use(express.static(path.resolve(__dirname, "../..", "client", "dist")));
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../..", "client", "dist", "index.html")
  );
});
const server = app.listen(process.env.SERVER_PORT || process.env.PORT, () => {
  console.log(
    `⚡️[server]: Server is running at http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}`
  );
});

const ioServer = new SocketIOServer(server);
