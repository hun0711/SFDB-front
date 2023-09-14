import axios from "axios";

const API_KEY = "AIzaSyC2pRmeDsy_q0pjRI7LOneIXjSQHE_UMbA";

export async function getYouTubeVideoByQuery(query) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: API_KEY,
          q: query,
          part: "snippet",
          maxResults: 1, // 최상위 동영상 하나만 가져오기
          type: "video",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}
