import React from 'react';
import axios from 'axios';
import config from '../../config';

const KakaoLogin = () => {
  const kakaoRestAPIKey = config.kakaoClientId;
  const kakaoRedirectUri = config.kakaoRedirectUri;
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoRestAPIKey}&redirect_uri=${kakaoRedirectUri}&response_type=code`;

  const handleKakaoLogin = () => {
    window.location.href = kakaoURL;
   
  };

  return (
    <>
      <div onClick={handleKakaoLogin}>
        <img
          src='/images/logo/kakao완성형3.png'
          alt='카카오 로그인'
          style={{ width: '215px', height: '50px', cursor: 'pointer' }}
        />
      </div>
    </>
  );
};

export default KakaoLogin;
