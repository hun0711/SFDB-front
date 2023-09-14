import axios from "axios";

//ID 중복체크 axios 로직
export const idCheckDB = async (id) => {
  try {
    const res = await axios.get(`http://localhost:8000/register/idCheck`, {
      params: {
        userId: id,
      },
    });
    // 서버로부터 받은 응답 데이터를 반환합니다.
    return res.data;
  } catch (error) {
    // 요청이 실패했을 때 오류를 콘솔에 출력하고 오류 객체를 반환합니다.
    console.error("Error during idCheckDB request:", error);
    throw error; // 이 오류를 호출자에게 전달하여 처리하도록 합니다.
  }
};

//회원가입 axios 로직
export const regInsertDB = (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    try {
      const response = axios({
        method: "post", //@RequestBody
        url: "http://localhost:8000/register/userJoin",
        data: data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const withdrawUserDB = async (userId) => {
  console.log(userId);
  try {
    const res = await axios.post(
      `http://localhost:8000/register/withdraw`,
      { userId }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
