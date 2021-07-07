import axios from "axios";
import { v1 as uuid } from "uuid";
import { URLSearchParams } from "url";
import twitterClient from "./twc";

const mbToken = process.env.MB_TOKEN;
const tweetURL = "https://api.twitter.com/2/tweets?";
const API_ENDPOINT = "http://localhost:3002/api/motionbox-render";

interface ISendRender {
  tweetId: string;
  tweetText: string;
  connectionId: string;
}

// TODO: Before sending render requests to prevent abuse
// we must be strict and need to verify the user
export const sendRenderRequest = async ({
  tweetId,
  tweetText,
  connectionId,
}: ISendRender) => {
  try {
    const paramsRes = new URLSearchParams({
      ids: tweetId,
      expansions: "author_id,referenced_tweets.id",
      "tweet.fields": "referenced_tweets,id,entities",
      "user.fields": "profile_image_url",
    });

    const tweets = await twitterClient.get(tweetURL + paramsRes);
    const twitterUser = tweets.includes.users[0];
    const opTweetId = tweets.data[0].referenced_tweets[0].id;
    const opTweet = await getOpTweet({ opTweetId });

    console.log({
      tweets: JSON.stringify(tweets),
      opTweet: JSON.stringify(opTweet),
    });

    doRenderReq({
      tweetId,
      tweetText: opTweet.data[0].text,
      twitterUser: opTweet.includes.users[0],
      connectionId,
    });
  } catch (e) {
    console.log(`Error getting Tweet ${e}`);
  }
};

const getOpTweet = async ({ opTweetId }: any) => {
  const params = new URLSearchParams({
    ids: opTweetId,
    expansions: "author_id",
    "user.fields": "profile_image_url",
  });

  return await twitterClient.get(tweetURL + params);
};

const doRenderReq = async ({
  tweetId,
  tweetText,
  twitterUser,
  connectionId,
}: any) => {
  try {
    const videoId = uuid() + "-TWITTER-" + tweetId;
    const templateId = "ckqmq9sjx00110vjlbveims79";
    const data = {
      ["df6c0210-ded5-11eb-a4ff-112a69c6a1a6"]: {
        animationData: {
          animationText: {
            "Text 01": "Follow",
            "Text 02": `@${twitterUser.username.toUpperCase()}`,
          },
        },
      },
      ["7eb6b9a0-db6b-11eb-867a-6d651b8f4eae"]: {
        text: tweetText,
      },
      ["32614b00-db6c-11eb-867a-6d651b8f4eae"]: {
        text: `@${twitterUser.username}`,
      },
      ["a65d2d40-db6b-11eb-867a-6d651b8f4eae"]: {
        link: twitterUser.profile_image_url,
      },
    };

    await axios({
      method: "post",
      url: API_ENDPOINT,
      data: {
        data,
        token: mbToken,
        videoId,
        templateId,
        connectionId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    console.log(`Error triggering render job ${e}`);
  }
};
