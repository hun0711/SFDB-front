import axios from "axios";
import config from "../config";

const apiKey = config.cseApiKey;
const engineID = config.cseEngineID;

export async function getGoogleImageApi(query) {
  console.log(query);
  try {
    const response = await axios.get(
      "https://www.googleapis.com/customsearch/v1",
      {
        params: {
          key: apiKey,
          cx: engineID,
          q: query,
          num: 3,
          start: 1,
          fileType: "jpg",
          searchType: "image",
          imgType: "photo",
          gl: "us",
        },
      }
    );
    return response.data.items;
  } catch (error) {
    throw error;
  }
}
