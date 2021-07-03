import doUpload from "./doUpload";
import doRespond from "./doRespond";

interface IRespond {
  videoId: string;
  videoUrl: string;
}

const respond = async ({ videoId, videoUrl }: IRespond) => {
  // upload media
  const mediaId = await doUpload({
    videoId,
    videoUrl,
  });

  // final response
  await doRespond({
    videoId,
    mediaId,
  });
};

export default respond;
