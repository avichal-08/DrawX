import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";

import { WebSkt } from "./ws";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

WebSkt(server);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`WebSocket active at ws://localhost:${PORT}`);
});