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

const dev = process.env.NODE_ENV === "development";

if (dev) {
  const server = app.listen(process.env.PORT || 3001);
  new SocketIOServer(server);
} else {
  const server = app.listen(
    Number(process.env.SERVER_PORT),
    process.env.SERVER_IP,
    () => {
      console.log(
        `⚡️[server]: Server is running at http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}`
      );
    }
  );
  new SocketIOServer(server);
}
