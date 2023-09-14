import axios from "axios";
import config from "../config";

const apiKey = config.naverClientId;
const secret = config.naverClientSecret;

export async function getNaverImageApi(query) {
  console.log(query);
  try {
    const response = await axios.get(
      "https://openapi.naver.com/v1/search/image",
      {
        params: {
          query : query,
          display : 1,
          sort : 'sim'
      },
      headers: {
        'X-Naver-Client-Id': apiKey,
        'X-Naver-Client-Secret': secret
    }
  }
    );
    return response.data.items;
  } catch (error) {
    throw error;
  }
}
