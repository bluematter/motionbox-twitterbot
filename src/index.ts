import express from "express";
import WebSocket from "websocket";
import EventEmitter from "events";
import wssConnect from "./wssConnect";
import { twitterStream } from "./stream";

const eventEmitter = new EventEmitter();
const WebSocketClient = WebSocket.client;
const SOCKET_URI =
  "wss://c6ifiee5t6.execute-api.us-west-2.amazonaws.com/development";

const app = express();
const port = 9000;
const socket = new WebSocketClient();
socket.connect(SOCKET_URI);

app.listen(port, async () => {
  // Listens to TS @_motionbox render and triggers render job
  twitterStream(eventEmitter);

  // Establishes connection to render socket gateway
  wssConnect(socket, eventEmitter);

  console.log(
    `🚀 Twitter render bot server is alive and listening on port: ${port}`
  );
});
