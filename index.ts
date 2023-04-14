import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import SocketIOServer from "./IOServer";
import APIRoutes from "./routes/api-routes";

dotenv.config();

const ip = process.env.IP;
const port = process.env.PORT;

const app: Express = express();
const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://${ip}:${port}`);
});

const ioServer = new SocketIOServer(server);
const apiRoutes = new APIRoutes(ioServer);

app.use(express.json());
app.use("/", express.static(path.join(__dirname, "../client")));
app.use("/api", apiRoutes.router);
