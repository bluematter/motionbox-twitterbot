import EventEmitter from "events";
import WebSocket from "websocket";
import { sendRenderRequest } from "./render";
import respondToTweet from "./respond";

type Socket = WebSocket.client;

const wssConnect = (socket: Socket, eventEmitter: EventEmitter) => {
  socket.on("connectFailed", (error) => {
    console.log("Connect Error: " + error.toString());
  });

  socket.on("connect", (connection) => {
    let connectionId = "";

    if (connection.connected) {
      connection.send("connectionId");
    }

    connection.on("error", (error) => {
      console.log("Connection Error: " + error.toString());
    });

    connection.on("close", () => {
      console.log("echo-protocol Connection Closed");
    });

    connection.on("message", (message) => {
      try {
        const payload = message.utf8Data ? JSON.parse(message.utf8Data) : {};

        if (payload.connectionId) {
          connectionId = payload.connectionId;
        }

        if (payload.Data?.finalVideo) {
          respondToTweet({
            videoId: payload.Data.videoId,
            videoUrl: payload.Data.finalVideo,
          });
        }

        console.log(
          "Monitor WSS messages for progress and finished video renders",
          {
            payload,
          }
        );
      } catch (e) {
        console.log("Error parsing message", { e });
      }
    });

    eventEmitter.on("trigger", (payload) => {
      const twitterData = payload.json.data;

      console.log("Trigger called...");
      sendRenderRequest({
        tweetId: twitterData.id,
        tweetText: twitterData.text,
        connectionId,
      });
    });
  });
};

export default wssConnect;
