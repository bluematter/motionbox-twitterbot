const needle = require("needle");
import { sendRenderRequest } from "./render";

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const token = process.env.BEARER_TOKEN;
const streamURL = "https://api.twitter.com/2/tweets/search/stream";

// this sets up two rules - the value is the search terms to match on, and the tag is an identifier that
// will be applied to the Tweets return to show which rule they matched
// with a standard project with Basic Access, you can add up to 25 concurrent rules to your stream, and
// each rule can be up to 512 characters long

export function streamConnect(retryAttempt: any) {
  const stream = needle.get(streamURL, {
    headers: {
      "User-Agent": "v2FilterStreamJS",
      Authorization: `Bearer ${token}`,
    },
    timeout: 20000,
  });

  stream
    .on("data", (data: any) => {
      try {
        const json = JSON.parse(data);

        // TODO: Use JSON and pull data.id to find tweet ID if needed
        // can also use data.text to turn into video
        // need to find user data to make tweet card UI

        sendRenderRequest({
          tweetId: json.data.id,
          tweetText: json.data.text,
        });

        // A successful connection resets retry count.
        retryAttempt = 0;
      } catch (e) {
        if (
          data.detail ===
          "This stream is currently at the maximum allowed connection limit."
        ) {
          console.log("Detail: ", data.detail);
          process.exit(1);
        } else {
          // Keep alive signal received. Do nothing.
        }
      }
    })
    .on("err", (error: any) => {
      console.log("Error: ", error);

      if (error.code !== "ECONNRESET") {
        console.log(error.code);
        process.exit(1);
      } else {
        // This reconnection logic will attempt to reconnect when a disconnection is detected.
        // To avoid rate limits, this logic implements exponential backoff, so the wait time
        // will increase if the client cannot reconnect to the stream.
        setTimeout(() => {
          console.warn("A connection error occurred. Reconnecting...");
          streamConnect(++retryAttempt);
        }, 2 ** retryAttempt);
      }
    });

  return stream;
}
