import React, { useEffect, useState } from 'react'
import { gapi } from 'gapi-script';
import { googleSocialLogin, googleUserInfo } from '../../axios/user/loginLogic';
import config from '../../config';
import { serialize } from 'cookie';
import { useNavigate } from 'react-router';
import { Alert, Snackbar } from '@mui/material';
import { useSnackbar } from 'notistack';
import { getCookie } from '../../utils/getCookies';


const GoogleLogin = () => {
  const navigate = useNavigate()
  const [alertOn, setAlertOn] = useState(false);
  const { enqueueSnackbar } = useSnackbar(); 
  
  const handleClose = () => {
    setAlertOn(false)
  }


{/* 구글 sdk */}
useEffect(() => {
  const loadGoogleApiScript = async () => {
    try {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';

        script.onload = resolve;
        script.onerror = reject;

        document.body.appendChild(script);
      });
    } catch (error) {
      console.error('Google API 스크립트 로드 실패:', error);
    }
  };

  loadGoogleApiScript();
}, []);



 {/*  구글 로그인 처리 함수 */}
 const handleGoogleLogin = async () => {
  try {
    if (!gapi.auth2) {
      // 구글 API 스크립트 로드를 기다리기 위해 promise를 사용
      await new Promise((resolve) => {
        gapi.load('auth2', resolve);
      });
    }

    // 'gapi.auth2'가 초기화되지 않았다면 초기화
    if (!gapi.auth2.getAuthInstance()) {
      gapi.auth2.init({
        client_id: config.googleClientId,
        cookie_policy: 'single_host_origin',
        scope : 'profile email'
      });
    }

    const auth2 = gapi.auth2.getAuthInstance();
    const googleUser = await auth2.signIn();
    const googleAccessToken = googleUser.getAuthResponse().access_token;
    console.log('Google Access Token:', googleAccessToken);
    const googleLoginData = await googleUserInfo(googleAccessToken)


    // 스프링 백엔드와 통신하여 처리
    const res = await googleSocialLogin(googleLoginData); // 스프링 백엔드의 구글 로그인 API 엔드포인트로 대체
    console.log('Google 로그인 결과:', res);

    if (res === 1) {
      document.cookie = serialize('userId', googleLoginData.id, { path: '/' }); 
      document.cookie = serialize('userEmail', googleLoginData.email, { path: '/' }); 
      document.cookie = serialize('userName', googleLoginData.name, { path: '/' }); 
      document.cookie = serialize('userProfileImage', googleLoginData.picture, { path: '/' });
      navigate('/main');
      const userName = getCookie('userName') 
      enqueueSnackbar(`${userName}님, 어서오세요.`, { variant: 'success' });
      setAlertOn(true)      
    } else {
      console.log('Google 로그인 실패');
      enqueueSnackbar('로그인에 실패했습니다.', { variant: 'warning' });
      setAlertOn(true);
    }
  } catch (error) {
    console.error('Google 로그인 에러:', error);
    enqueueSnackbar('네트워크 오류 발생!', { variant: 'error' });
    setAlertOn(true);
  }
};



  return (
    <>
        <div style={{ textAlign: 'center' }}>
          <img
          src="/images/logo/googlebtn2.png"
          alt="구글 로그인"
          style={{ width: '220px', height: '50px', cursor: 'pointer' }}
          onClick={handleGoogleLogin}
        />
            </div>
            <Snackbar open={alertOn} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            로그인에 성공했습니다!
          </Alert>
        </Snackbar>
    </>
  )
}

export default GoogleLogin