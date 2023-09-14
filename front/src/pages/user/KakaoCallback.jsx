  import axios from 'axios';
  import React, { useState } from 'react'
  import config from '../../config';
import { kakaoSocialLogin } from '../../axios/user/loginLogic';
import { serialize } from 'cookie';
import { useNavigate } from 'react-router';
import { Alert, Snackbar } from '@mui/material';
import { useSnackbar } from 'notistack';
import { getCookie } from '../../utils/getCookies';

  const KakaoCallback = () => {
    const navigate = useNavigate();
    const [alertOn, setAlertOn] = useState(false);
    const { enqueueSnackbar } = useSnackbar(); 
    const handleClose = () => {
      setAlertOn(false)
    }
  
  
    const kakaoRestAPIKey = config.kakaoClientId;
    const kakaoRedirectUri = config.kakaoRedirectUri;
  
    const urlSearchParams = new URLSearchParams(window.location.search);
    const code = urlSearchParams.get('code');
    
    if (code) {
      const grantType = 'authorization_code';
      const data = `grant_type=${grantType}&client_id=${kakaoRestAPIKey}&redirect_uri=${kakaoRedirectUri}&code=${code}`;
      axios
        .post('https://kauth.kakao.com/oauth/token', data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        })
        .then((res) => {
          console.log(res);
          const { data } = res;
  const { access_token } = data;
  if(access_token) {
  console.log(`Bearer ${access_token}`);
  axios
      .post(
          "https://kapi.kakao.com/v2/user/me",
          {},
          {
            headers: {
              Authorization : `Bearer ${access_token}` ,
              "Content-type" : "application/x-www-form-urlencoded",
              },
          }
        )
        .then(async (res) => {
        console.log(res.data)
        const kakaoLoginData = {
          id : res.data.id,
          name : res.data.kakao_account.profile.nickname,
          email : res.data.kakao_account.email,
          birth : res.data.kakao_account.birthday,
          image : res.data.kakao_account.profile.profile_image_url
        }

        //서버에 로그인정보 전달
        const response = await kakaoSocialLogin(kakaoLoginData)
        if(response === 1 ){
          console.log("카카오 로그인 성공");
          document.cookie = serialize('userId' , kakaoLoginData.id , {path : '/'})
          document.cookie = serialize('userName' , kakaoLoginData.name , {path : '/'})
          document.cookie = serialize('userBirth' , kakaoLoginData.birth , {path : '/'})
          document.cookie = serialize('userProfileImage' , kakaoLoginData.image , {path : '/'})
          navigate('/main')
          const userName = getCookie('userName')
          enqueueSnackbar(`${userName}님, 어서오세요.`, { variant: 'success' });
          setAlertOn(true);
        }
      });
      } else {
      console.log("access_token 없음");
      enqueueSnackbar('로그인에 실패했습니다.', { variant: 'warning' });
      setAlertOn(true);
  }
        })
        .catch((error) => {
          console.error('Error exchanging code for access token:', error);
          enqueueSnackbar('네트워크 오류 발생!', { variant: 'error' });
          setAlertOn(true);
        });
    }

    return (
      <>
              <Snackbar open={alertOn} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            로그인에 성공했습니다!
          </Alert>
        </Snackbar>
      </>
    )
  }

  export default KakaoCallback