import twitterClient from "./twc";

interface IGetVideoUrl {
  tweetId: string;
}

export const getVideoUrl = async ({ tweetId }: IGetVideoUrl) => {
  const tweet: any = await twitterClient.v1.singleTweet(tweetId, {
    include_entities: true,
  });

  if (tweet?.extended_entities?.media?.length) {
    let bitrate = 0;
    let hq_video_url;
    const firstMedia = tweet.extended_entities.media[0];

    console.log({
      firstMedia: JSON.stringify(firstMedia),
    });

    for (let j = 0; j < firstMedia.video_info.variants.length; j++) {
      if (firstMedia.video_info.variants[j].bitrate) {
        if (firstMedia.video_info.variants[j].bitrate > bitrate) {
          bitrate = firstMedia.video_info.variants[j].bitrate;
          hq_video_url = firstMedia.video_info.variants[j].url;
        }
      }
    }

    return hq_video_url;
  }

  return false;
};
