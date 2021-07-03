require("dotenv").config();

import TwitterApi from "twitter-api-v2";

const consumerKey = process.env.CONSUMER_KEY ? process.env.CONSUMER_KEY : "";
const consumerSecret = process.env.CONSUMER_SECRET
  ? process.env.CONSUMER_SECRET
  : "";
const accessToken = process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN : "";
const tokenSecret = process.env.TOKEN_SECRET ? process.env.TOKEN_SECRET : "";

const twitterClient = new TwitterApi({
  appKey: consumerKey,
  appSecret: consumerSecret,
  accessToken,
  accessSecret: tokenSecret,
});

export default twitterClient;
