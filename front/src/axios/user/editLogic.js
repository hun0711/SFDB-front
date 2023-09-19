import axios from "axios";

//이름 변경 로직
export const changeUserNameDB = async (requestData) => {
  console.log(requestData);
  try {
    const res = await axios.post(
      `https://101.101.219.216:8443/user/changeUserName`,
      requestData
    );
    return res.data;
  } catch (error) {
    console.error("Error during changeUserNameDB request:", error);
    throw error;
  }
};

//프사 변경
export const updateProfileImageDB = async (requestData) => {
  console.log(requestData);
  try {
    const res = await axios.post(
      `https://101.101.219.216:8443/user/updateProfileImage`,
      requestData
    );
    return res.data;
  } catch (error) {
    console.error("Error during updateProfileImageDB request:", error);
    throw error;
  }
};

//비밀번호 변경
export const changePwDB = async (requestData) => {
  console.log(requestData);
  try {
    const res = await axios.post(
      `https://101.101.219.216:8443/user/changePw`,
      requestData
    );
    return res.data;
  } catch (error) {
    console.error("Error during changePw request:", error);
  }
};
