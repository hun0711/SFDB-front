import axios from "axios";

export const existReleaseNoticeEmailUser = async (userId) => {
  console.log(userId);
  try {
    const res = await axios.get(
      "https://101.101.219.216:8443/user/existReleaseNoticeEmailUser",{
        params : {
          userId : userId
        }})
      console.log(res.data);
      return res.data
  } catch (error) {
    
  }
}

export const releaseNoticeEmail = async (requestData) => {
  console.log(requestData);
  try {
    const res = await axios.post(
      "https://101.101.219.216:8443/user/releaseNoticeEmail",
      requestData
    );
    return res.data;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
};

export const findId = async (userData) => {
  console.log(userData);
  try {
    const res = await axios.post(
      "https://101.101.219.216:8443/user/findId",
      userData
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
};

export const findPw = async (userData) => {
  console.log(userData);
  try {
    const res = await axios.post(
      "https://101.101.219.216:8443/user/findPw",
      userData
    );
    return res.data;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
};

export const checkTempPw = async (userId , tempPw) => {
  try {
    const res = await axios.get(
      "https://101.101.219.216:8443/user/checkTempPw",{
        params:{
          userId : userId,
          tempPw : tempPw
        }});
    return res.data;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
};

