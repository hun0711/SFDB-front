import React, { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { Button, CssBaseline, TextField, FormControl, FormHelperText, Grid, Box, Typography, Container, Link, Snackbar, Alert, Modal, IconButton} from '@mui/material/';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router';
import { styled } from 'styled-components';
import { userInfoDB, userLoginDB } from '../../axios/user/loginLogic';
import { serialize } from 'cookie';
import GoogleLogin from './GoogleLogin';
import KakaoLogin from './KakaoLogin';
import NaverLogin from './NaverLogin';
import { useSnackbar } from 'notistack';
import { getCookie } from '../../utils/getCookies';
import { checkTempPw, findId, findPw } from '../../axios/user/mailLogic';


const FormHelperTexts = styled(FormHelperText)`
  width: 100%;
  padding-left: 16px;
  font-weight: 700 !important;
  color: #d32f2f !important;
`;

const Boxs = styled(Box)`
  padding-bottom: 40px !important;
`;


const Login = () => {
  const theme = createTheme();
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [emailValue, setEmailValue] = useState('')
  const [tempPwValue, setTempPwValue] = useState('')
  const [idValue, setIdValue] = useState('')
  const [nameValue, setNameValue] = useState('')
  const [alertOn, setAlertOn] = useState(false);
  const [findIdModalopen, setFindIdModalOpen] = useState(false);
  const [findPwModalopen, setFindPwModalOpen] = useState(false);
  const [tempPwError, setTempPwError] = useState('');
  const [isCheckedTempPw, setIsCheckedTempPw] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isEmailSend, setIsEmailSend] = useState(false);
  const emailRegex = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;


  const { enqueueSnackbar } = useSnackbar(); 
  const handleClose = () => {
    setAlertOn(false)
  }
  const handleFindIdClick = () => {
    setFindIdModalOpen(true)
  }
  const handleFindIdModalClose = () => setFindIdModalOpen(false); 

  const handleFindPwClick = () => {
    setFindPwModalOpen(true)
  }
  const handleFindPwModalClose = () => setFindPwModalOpen(false); 



  {/* 사이트 자체 로그인 */}
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const loginData = {
        userId: id,
        userPw: pw,
      };
      const res = await userLoginDB(loginData);
      console.log('로그인 결과:', res);
      if (res === 1) {
        const userInfoRes = await userInfoDB(loginData.userId)
        console.log(userInfoRes);
        const userProfileImageValue = userInfoRes[0].userProfileImage || '';
        document.cookie = serialize('userId', userInfoRes[0].userId, { path: '/' });
        document.cookie = serialize('userName', userInfoRes[0].userName , { path: '/' });
        document.cookie = serialize('userBirth', userInfoRes[0].userBirth , { path: '/' });
        document.cookie = serialize('userEmail', userInfoRes[0].userEmail , { path: '/' });
        document.cookie = serialize('userProfileImage', userProfileImageValue , { path: '/' });
        navigate('/main');
        const userName = getCookie('userName')
        enqueueSnackbar(`${userName}님, 어서오세요.`, { variant: 'success' });
        setAlertOn(true);
      } else {
        console.log('로그인 정보 재확인 필요');
        enqueueSnackbar('로그인에 실패했습니다.', { variant: 'warning' });
        setAlertOn(true);
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar('네트워크 오류 발생!', { variant: 'error' });
      setAlertOn(true);
    }
  };

/* 아이디 찾기 (이메일 발송) */
   const handleFindId = async() => {
    if(!emailRegex.test(emailValue)){
      setEmailError('올바른 이메일 형식이 아닙니다.');
      return;
    }
    const userData = {
      userName : nameValue,
      userEmail : emailValue
    }
    setIsEmailSend(true);
    try {
      const res = await findId(userData)
      if(res === 1){
        enqueueSnackbar('이메일이 발송되었습니다, 확인해주세요.', { variant: 'success' });
        setAlertOn(true);
      }else{
        enqueueSnackbar(`${nameValue}님의 아이디가 존재하지 않습니다.`, { variant: 'error' });
        setAlertOn(true);
        setIsEmailSend(false)
        console.log('아이디 찾기 실패');
      }
    } catch (error) {
      enqueueSnackbar('네트워크 오류', { variant: 'error' });
        setAlertOn(true);
        setIsEmailSend(false)
      console.log('아이디 찾기 실패 : ', error);
    }
   }

/* 비밀번호 찾기 (이메일 발송) */
   const handleFindPw = async() => {
    if(!emailRegex.test(emailValue)){
      setEmailError('올바른 이메일 형식이 아닙니다.');
      return;
    }
    const userData = {
      userName : nameValue,
      userId : idValue,
      userEmail : emailValue
    }
    setIsEmailSend(true);
    try {
      const res = await findPw(userData)
      if(res === 1){
        enqueueSnackbar('이메일이 발송되었습니다, 확인해주세요.', { variant: 'success' });
        setAlertOn(true);
      }else{
        enqueueSnackbar('일치하는 정보가 없습니다. 정보를 다시 확인해주세요.', { variant: 'error' });
        setAlertOn(true);
        setIsEmailSend(false)
        console.log('비밀번호 찾기 실패');
      }
    } catch (error) {
      enqueueSnackbar('네트워크 오류', { variant: 'error' });
        setAlertOn(true);
        setIsEmailSend(false)
      console.log('비밀번호 찾기 실패 : ', error);
    }
   }

/* 임시 비번 확인 (이메일 발송) */
   const handleCheckTempPw = async() => {
    const userId = idValue;
    const tempPw = tempPwValue;

    setIsCheckedTempPw(true);
    try {
      const res = await checkTempPw(userId , tempPw)
      if(res){
        enqueueSnackbar('임시 비밀번호가 확인되었습니다, 로그인해주세요.', { variant: 'success' });
        setAlertOn(true);
        setTempPwError('')
      }else{
        enqueueSnackbar('입력 값이 임시 비밀번호와 일치하지 않습니다.', { variant: 'error' });
        setAlertOn(true);
        setTempPwError('임시 비밀번호를 정확히 입력해주세요.')
        setIsCheckedTempPw(false)
        console.log('임시 비밀번호 확인 실패');
      }
    } catch (error) {
      enqueueSnackbar('네트워크 오류', { variant: 'error' });
        setAlertOn(true);
        setIsCheckedTempPw(false)
      console.log(' 임시 비밀번호 확인 실패 : ', error);
    }
   }




  /* Style */
  const modalStyle = {
    position: 'absolute', top: '50%',left: '50%',
    transform: 'translate(-50%, -50%)', width: 500, height: 350,
    bgcolor: 'background.paper', borderRadius: '10px', boxShadow: 24, p: 4,
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
  };

  

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <img
              src="/images/SF-DB.png"
              alt="SF-DB 로고"
              style={{ width: '180px', height: '180px' }}
            />
          </Box>
          <Typography variant="h5" gutterBottom marked="center" align="center" sx={{ fontWeight: 'bold' }}>
            회원 로그인
          </Typography>
          <Typography variant="body2" align="center">
            <Link href="/register" underline="always">
              아직 계정이 없으신가요?
            </Link>
          </Typography>
          <Boxs component="form" noValidate sx={{ mt: 3 }} onSubmit={handleLogin}>
            <FormControl component="fieldset" variant="standard">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="id"
                    name="id"
                    label="아이디"
                    value={id}
                    onChange={(e) => {
                      const value = e.target.value;
                      setId(value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type="password"
                    id="pw"
                    name="pw"
                    label="비밀번호"
                    value={pw}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPw(value);
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: 'primary.main' }}
                size="large"
              >
                로그인
              </Button>
   {/* 아이디 찾기와 비밀번호 찾기를 가로로 정렬 */}
   <Grid container justifyContent="center" spacing={2} sx={{ mt: 1 , marginTop:'-20px', marginBottom:'10px'}}>
                <Grid item>
                  <Typography variant="body2">
                    <Button variant='text' onClick={handleFindIdClick}>
                      아이디 찾기
                    </Button>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">
                  <Button variant='text' onClick={handleFindPwClick}>
                      비밀번호 찾기
                    </Button>
                  </Typography>
                </Grid>
              </Grid>

      {/* 소셜로그인 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '280px', margin: 'auto' }}>
            {/*구글*/}
            <GoogleLogin />
            {/*네이버*/}
              <NaverLogin/>
            {/*카카오*/}
            <KakaoLogin/>
          </div>

           
            </FormControl>
            <FormHelperTexts></FormHelperTexts>
          </Boxs>
        </Box>

        <Modal
  open={findIdModalopen}
  onClose={handleFindIdModalClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={modalStyle}>
  <IconButton
          style={{ position: 'absolute', top: '25px', right: '20px' }}
          onClick={handleFindIdModalClose}
        >
          <CancelIcon />
        </IconButton>
    <Typography id="modal-modal-title" variant="h6" component="h2">
     아이디 찾기
    </Typography>
    <Typography id="modal-modal-title" variant="h6" component="h2" style={{fontSize:'12px'}}>
     가입 시 등록한 이메일로 아이디를 찾으실 수 있습니다.
    </Typography>
<div style={{marginTop:'30px'}}>
<Typography variant='overline' style={{fontSize:'15px',marginRight:'5px'}}>· 이름 : </Typography>
<TextField
  hiddenLabel
  id="userName"
  variant="standard"
  style={{marginLeft:'15px'}}
  onChange={(event) => {
    setNameValue(event.target.value)
  }}/>
</div>

{/* 이메일 설정 */}
<div style={{display:'flex', flexDirection:'column' ,marginTop:'20px', marginBottom:'50px'}}>
  <div>
  <Typography variant='overline' style={{fontSize:'15px',marginRight:'5px'}}>· 이메일 : </Typography>
  <TextField
  hiddenLabel
  id="userEmail"
  error={emailError !== ''}
  helperText={emailError}
  variant="standard"
  onChange={(event) => {
    setEmailValue(event.target.value)
  }}/>
  <Button 
  disabled={isEmailSend}
   variant="contained" style={{color:'white',fontSize:'10px' , marginLeft:'15px' , marginBottom:'3px'}} onClick={handleFindId}>메일 확인</Button>
  </div>
</div>  
  </Box>
</Modal>


{/* 비밀번호  */}
<Modal
  open={findPwModalopen}
  onClose={handleFindPwModalClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={modalStyle}>
  <IconButton
          style={{ position: 'absolute', top: '25px', right: '20px' }}
          onClick={handleFindPwModalClose}
          >
          <CancelIcon />
        </IconButton>
    <Typography id="modal-modal-title" variant="h6" component="h2">
     비밀번호 찾기
    </Typography>
    <Typography id="modal-modal-title" variant="h6" component="h2" style={{fontSize:'12px'}}>
     가입 시 등록했던 이름,아이디,이메일을 입력해주세요.
    </Typography>
    <Typography id="modal-modal-title" variant="h6" component="h2" style={{fontSize:'12px'}}>
     이메일로 발송된 임시 비밀번호를 입력해주세요.
    </Typography>
<div style={{marginTop:'10px', marginBottom:'40px' ,display:'flex', flexDirection:'column'}}>
  <div>
<Typography variant='overline' style={{fontSize:'15px',marginRight:'5px'}}>· 이름 : </Typography>
<TextField
  hiddenLabel
  id="userName"
  variant="standard"
  style={{marginLeft:'15px'}}
  onChange={(event) => {
    setNameValue(event.target.value)
  }}/>
  </div>


<div>
<Typography variant='overline' style={{fontSize:'15px',marginRight:'5px'}}>· 아이디 : </Typography>
  <TextField
  hiddenLabel
  id="userId"
  variant="standard"
  onChange={(event) => {
    setIdValue(event.target.value)
  }}/>
  </div>

<div>
  <Typography variant='overline' style={{fontSize:'15px',marginRight:'5px'}}>· 이메일 : </Typography>
  <TextField
  hiddenLabel
  id="userEmail"
  error={emailError !== ''}
  helperText={emailError}
  variant="standard"
  onChange={(event) => {
    setEmailValue(event.target.value)
  }}/>
  <Button 
  disabled={isEmailSend}
  variant="contained" style={{color:'white',fontSize:'10px' , marginLeft:'15px' , marginBottom:'3px'}} onClick={handleFindPw}>메일 확인</Button>
  </div>

<div style={{marginTop:'5px' , marginBottom:'5px'}}>
  <Typography variant='overline' style={{fontSize:'15px',  marginRight:'5px'}}>· 임시 비밀번호 : </Typography>
  <TextField
  hiddenLabel
  id="tempPw"
  error={tempPwError !== ''}
  helperText={tempPwError}
  variant="standard"
  onChange={(event) => {
    setTempPwValue(event.target.value)
  }}/>
  <Button 
  disabled={isCheckedTempPw}
  variant="contained" style={{color:'white',fontSize:'10px' , marginLeft:'15px' , marginBottom:'3px'}} onClick={handleCheckTempPw}>확인</Button>
  </div>


</div>  
  </Box>
</Modal>



        <Snackbar open={alertOn} autoHideDuration={3000} onClose={handleClose}>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
