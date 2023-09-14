import axios from "axios";

export const userLoginDB = async (data) => {
  try {
    const res = await axios.post(`http://localhost:8000/user/login`, data);
    // 서버로부터 받은 응답 데이터를 반환합니다.
    return res.data;
  } catch (error) {
    // 요청이 실패했을 때 오류를 콘솔에 출력하고 오류 객체를 반환합니다.
    console.error("Error during idCheckDB request:", error);
    throw error; // 이 오류를 호출자에게 전달하여 처리하도록 합니다.
  }
};

export const userInfoDB = async (userId) => {
  try {
    const res = await axios.get(`http://localhost:8000/user/userInfo`, {
      params: {
        userId: userId,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const googleSocialLogin = async (data) => {
  try {
    const res = await axios.post(
      "http://localhost:8000/user/login/google",
      data
    );
    return res.data;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
};

export const googleUserInfo = async (token) => {
  try {
    const res = await axios.get("https://www.googleapis.com/userinfo/v2/me", {
      headers: {
        Authorization: `Bearer ${token}`, // 액세스 토큰을 베어러 토큰으로 설정합니다.
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
};

export const naverSocialLogin = async (data) => {
  try {
    const res = await axios.post(
      "http://localhost:8000/user/login/naver",
      data
    );
    return res.data;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
};

export const kakaoSocialLogin = async (data) => {
  try {
    const res = await axios.post("http://localhost:8000/user/login/kakao", {
      ...data,
    });
    return res.data;
  } catch (error) {
    console.log("Error : ", error);
    throw error;
  }
};
