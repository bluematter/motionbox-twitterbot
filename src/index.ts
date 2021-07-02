require("dotenv").config();

import express from "express";
import initializeTwitterStream from "./initializeTwitterStream";
import WebSocket from "websocket";
import wssConnect from "./wssConnect";

const WebSocketClient = WebSocket.client;
const SOCKET_URI =
  "wss://c6ifiee5t6.execute-api.us-west-2.amazonaws.com/development";

const app = express();
const port = 9000;
const socket = new WebSocketClient();
socket.connect(SOCKET_URI);

app.listen(port, async () => {
  initializeTwitterStream();

  console.log({
    socket,
  });

  // TODO: Figure out how to establish a socket connection with AWS
  wssConnect(socket);

  // TODO: Figure out how to track and manage render jobs
  // TODO: On successuful response use the Twitter API to respond with the new video

  console.log(
    `🚀 Twitter render bot server is alive and listening on port: ${port}`
  );
});
