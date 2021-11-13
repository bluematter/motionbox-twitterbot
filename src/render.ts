import axios from "axios";
import { v1 as uuid } from "uuid";
import { URLSearchParams } from "url";
import twitterClient from "./twc";
import { getMedia } from "./helpers";

const mbToken = process.env.MB_TOKEN;
const tweetURL = "https://api.twitter.com/2/tweets?";
const API_ENDPOINT =
  "http://microservice-staging.vercel.app/api/motionbox-render";

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
      opTweetId,
      tweetText: opTweet.data[0].text.replace(/https:\/\/t.co\/([^\s]+)+/g, ""),
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
    "media.fields": "url",
  });

  return await twitterClient.get(tweetURL + params);
};

const doRenderReq = async ({
  tweetId,
  opTweetId,
  tweetText,
  twitterUser,
  connectionId,
}: any) => {
  try {
    let data = {};
    let templateId = "";
    const videoId = uuid() + "-TWITTER-" + tweetId;

    // TODO: Check for images
    const media = await getMedia({
      tweetId: opTweetId,
    });

    if (media.type === "video") {
      templateId = "ckvrby1x14284yy9kghoqmd3o";
      data = {
        ["8d8d9e40-40f0-11ec-a818-f5665b315f24"]: {
          link: media.url,
          width: media.width,
          height: media.height,
        },
        ["0102cee0-40f1-11ec-8faf-7dcee8697d2c"]: {
          text: tweetText,
        },
        ["94c993d0-40f0-11ec-a818-f5665b315f24"]: {
          text: `@${twitterUser.username}`,
        },
        ["e1c97dd0-40f0-11ec-a137-250ba482ae35"]: {
          link: twitterUser.profile_image_url,
        },
      };
    }

    if (media.type === "photo") {
      templateId = "ckvsfzmqb0605est9rqwbgs1a";
      data = {
        ["e865e250-4190-11ec-a60b-9577772dba7b"]: {
          link: media.url,
          width: media.width,
          height: media.height,
        },
        ["82192ee0-418f-11ec-99ee-4f61d1f35be5"]: {
          text: tweetText,
        },
        ["06816750-4191-11ec-a60b-9577772dba7b"]: {
          text: `@${twitterUser.username}`,
        },
        ["3472cbb0-418f-11ec-99ee-4f61d1f35be5"]: {
          link: twitterUser.profile_image_url,
        },
      };
    }

    if (media.type === undefined) {
      templateId = "ckqmq9sjx00110vjlbveims79";
      data = {
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
    }

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
