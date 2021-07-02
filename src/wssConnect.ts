import WebSocket from "websocket";

type Socket = WebSocket.client;

const wssConnect = (socket: Socket) => {
  socket.on("connectFailed", (error) => {
    console.log("Connect Error: " + error.toString());
  });

  socket.on("connect", (connection) => {
    connection.on("error", (error) => {
      console.log("Connection Error: " + error.toString());
    });

    connection.on("close", () => {
      console.log("echo-protocol Connection Closed");
    });

    connection.on("message", (message) => {
      console.log("Received: '" + message.utf8Data + "'");
    });
  });
};

export default wssConnect;
