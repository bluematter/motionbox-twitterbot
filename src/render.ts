import fetch from "node-fetch";
import { URLSearchParams } from "url";

const token = process.env.BEARER_TOKEN;
const tweetURL = "https://api.twitter.com/2/tweets?";

interface ISendRender {
  tweetId: string;
  tweetText: string;
}

// TODO: Before sending render requests to prevent abuse
// we must be strict and need to verify the user
export const sendRenderRequest = async ({
  tweetId,
  tweetText,
}: ISendRender) => {
  try {
    const params = new URLSearchParams({
      ids: tweetId,
      expansions: "author_id",
      "user.fields": "profile_image_url",
    });

    console.log({
      url: tweetURL + params,
    });

    const res = await fetch(tweetURL + params, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const tweetData = await res.json();
    const twitterUser = tweetData.includes.users[0];

    console.log({
      tweetText,
      twitterUser,
    });
  } catch (e) {
    console.log(`Error getting Tweet ${e}`);
  }
};
