import s3 from "../aws/s3";
import twitterClient from "../twc";

const doUpload = async ({ videoId, videoUrl }: any) => {
  try {
    const filePath = videoUrl;
    const indexOfForwardSlash = filePath.lastIndexOf("/");
    const fileName =
      indexOfForwardSlash !== -1
        ? filePath.substr(indexOfForwardSlash + 1)
        : filePath;

    const s3params = {
      Bucket: "storycreator.v2.rendered",
      Key: fileName,
    };

    const file: any = await s3.getObject(s3params).promise();

    if (file && file.Body) {
      return await twitterClient.v1.uploadMedia(file.Body, {
        type: "mp4",
      });
    } else {
      throw new Error(
        `Error there is no file returned from S3, or it's corrupt...`
      );
    }
  } catch (e) {
    console.log({
      e,
    });
  }
};

export default doUpload;
