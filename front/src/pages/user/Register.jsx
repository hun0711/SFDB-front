    import React, { useState } from 'react';
   import {
      Avatar,
      Button,
      CssBaseline,
      TextField,
      FormControl,
      FormControlLabel,
      Checkbox,
      FormHelperText,
      Grid,
      Box,
      Container,
      Stack,
      IconButton,
      InputAdornment,
      Link,
      Typography,
      Snackbar,
      Alert,
      Popover,
    } from '@mui/material/';
    import SearchIcon from '@mui/icons-material/Search';
    import { createTheme, ThemeProvider } from '@mui/material/styles';
    import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
    import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
  import { useNavigate } from 'react-router';
  import { styled } from 'styled-components';
  import { idCheckDB, regInsertDB } from '../../axios/user/registerLogic';
import { useSnackbar } from 'notistack';

  // mui의 css 우선순위가 높기때문에 important를 설정 - 실무하다 보면 종종 발생 우선순위 문제
  const FormHelperTexts = styled(FormHelperText)`
  width: 100%;
  padding-left: 16px;
  font-weight: 700 !important;
  color: #d32f2f !important;
  `;


  const Boxs = styled(Box)`
  padding-bottom: 40px !important;
  `;

    const Register = () => {
      const theme = createTheme();
      const navigate = useNavigate();
      
      const [checked, setChecked] = useState(false);
      const [id, setId] = useState('');
      const [idError, setIdError] = useState('');
      const [isIdCheck , setIsIdCheck] = useState(false);
      const [pw, setPw] = useState('');
      const [rePw, setRePw] = useState('');
      const [pwError, setPwError] = useState('');
      const [showPw, setShowPw] = useState(false)
      const [name, setName] = useState('')
      const [nameError, setNameError] = useState('');
      const [selectedDate, setSelectedDate] = useState(null);
      const [birthError, setBirthError] = useState('');
      const [email , setEmail] = useState('')
      const [emailError, setEmailError] = useState('');
      const [registerError, setRegisterError] = useState('');
      const [alertOn, setAlertOn] = useState(false);
      const [anchorEl, setAnchorEl] = useState(null);

      const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handlePopoverClose = () => {
        setAnchorEl(null);
      };
    
      const open = Boolean(anchorEl);
    

      const { enqueueSnackbar } = useSnackbar(); 
      const handleClose = () => {
        setAlertOn(false)
      }
    

    /************************************************************************************************/
    /* 함수 정의 */
    
    //id 중복확인 기능
    const handleCheckDuplicateId = async(id) => {
      console.log(id);
      // 중복 확인 로직 처리
      try {
        const res = await idCheckDB(id);
        console.log(res);
        if(res){
          setIdError('이미 존재하는 아이디입니다.');
          setIsIdCheck(false);
        }else{
            console.log("사용 가능한 아이디입니다.");
            enqueueSnackbar('사용 가능한 아이디입니다.', { variant: 'success' });
        setAlertOn(true);
          setIdError('');
          setIsIdCheck(true);
        }
      } catch (error) {
        console.log(error);
        setIdError('다시 시도해주세요.')
        setIsIdCheck(false)
      }

    }
    

    //ID찾기 버튼 클릭 시 'id'입력값을 받아야함
    const handleSearchButtonClick = () => {
      const id = document.getElementById('id').value.trim(); // 앞뒤 공백 제거
      if (id === '') {
        setIdError('아이디를 입력해주세요.');
        setIsIdCheck(false);
        return;
      }
      handleCheckDuplicateId(id);
    }
    
    //비밀번호 오픈
    const handleShowPassword = () => {
      setShowPw((prevShowPassword) => !prevShowPassword);
    };


    // 생년월일 선택
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };
    // Date 객체를 'yyyy-mm-dd' 형식의 문자열로 변환하는 함수
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    
    // 동의 체크
      const handleAgree = (event) => {
        setChecked(event.target.checked);
      };
    
    

  /************************************************************************************************/
  /* 회원가입 데이터 요청 */
  const regDataSend = async (data) => {
    try {
      const res = await regInsertDB(data)
      console.log(res.data);

      if(res.data){
        console.log("가입 성공");
        navigate('/login')
        enqueueSnackbar('회원가입에 성공했습니다!', { variant: 'success' });
        setAlertOn(true);
      }else{
      console.log('가입 실패');
      enqueueSnackbar('회원 가입에 실패하였습니다', { variant: 'warning' });
      setAlertOn(true);
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar('네트워크 오류 발생!', { variant: 'error' });
      setAlertOn(true);
      
  }
  }
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("가입하기 호출");
    
    if (!selectedDate) {
      console.log('생년월일을 선택해주세요.');
      setBirthError('생년월일을 선택해주세요.');
      return;
    }
  
    if (!isIdCheck) {
      console.log("아이디 중복확인 해주세요.") 
      enqueueSnackbar('아이디 중복확인은 필수입니다.', { variant: 'warning' });
      setAlertOn(true);
      return;
    }
  
    if (!checked) {
      console.log("회원가입 약관에 동의해주세요.")
      enqueueSnackbar('약관에 동의해주세요.', { variant: 'warning' });
      setAlertOn(true);
      return;
    }
  
    const idRegex = /^[A-Za-z0-9][A-Za-z0-9]{5,}$/;
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const nameRegex = /^[a-zA-Z가-힣]+$/;
    const emailRegex = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  
    if (!idRegex.test(id)) {
      setIdError('영문자 혹은 숫자로 시작하고, 영문자와 숫자의 조합으로 6자리 이상이어야 합니다.');
      return;
    } else {
      setIdError('');
      console.log('올바른 id : ' , id);
    }
  
    if (!pwRegex.test(pw)) {
      console.log('잘못된 pw : ' , pw);
      setPwError('영문자, 숫자, 특수 문자의 조합으로 8자리 이상이어야 합니다.');
      return;
    } else {
      setPwError('');
      console.log('올바른 pw : ' , pw);
    }
  
    if (pw !== rePw) {
      setPwError('비밀번호가 일치하지 않습니다.');
      return;
    } else {
      setPwError('');
      console.log('pw - rePw 일치 : ' , pw , rePw );
    }
  
    if (!nameRegex.test(name)) {
      setNameError('이름은 한글 또는 영문으로 입력해주세요.');
      return;
    } else {
      setNameError('');
      console.log('올바른 이름 : ' , name);
    }
  
    if (!emailRegex.test(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      return;
    } else {
      setEmailError('');
      console.log('올바른 이메일 : ' , email);
    }
  
    console.log('유효성 검사 통과');
    const formattedDate = selectedDate ? formatDate(selectedDate) : '';
    const data = new FormData(e.currentTarget);
  
    const regData = {
      userId : data.get('id'),
      userPw: data.get('pw'),
      userName : data.get('name'),
      userBirth: formattedDate,
      userEmail : data.get('email'),
    };
    console.log(regData);
    regDataSend(regData);
  };
  
  /************************************************************************************************/

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
            회원가입
          </Typography>
          <Typography variant="body2" align="center">
            <Link href="/login" underline="always">
              이미 계정이 있으신가요?
            </Link>
          </Typography>
              <Boxs component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <FormControl component="fieldset" variant="standard">
                  
                  <Grid container spacing={2}>
  {/* 아이디 입력 및 중복 확인 */}
                    <Grid item xs={12} sm={10}>
                      <TextField required autoFocus fullWidth id="id" name="id" label="아이디" value={id} onChange={(e) => setId(e.target.value)}/>
                      {idError && <FormHelperTexts error>{idError}</FormHelperTexts>}
                    </Grid>
                  <Grid item xs={12} sm={2}>
      <IconButton 
      aria-owns={open ? 'mouse-over-popover' : undefined}
      aria-haspopup="true"
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
      onClick={handleSearchButtonClick}>
        <SearchIcon />
        <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>아이디 중복 확인을 해주세요.</Typography>
      </Popover>
      </IconButton>
    
    </Grid>
    

  {/* 비밀번호 입력 및 재확인 */}                  
  <Grid item xs={12}>
    <TextField
      required
      fullWidth
      type="password"
      id="pw"
      name="pw"
      label="비밀번호 (숫자+영문자+특수문자 8자리 이상)"
      value={pw}
      onChange={(e) => {
        const value = e.target.value;
        setPw(value);
        // 비밀번호 변경 시, 비밀번호 확인과 일치 여부 확인
        setPwError(value !== rePw ? '비밀번호가 일치하지 않습니다.' : '');
      }}
      error={pwError !== ''}
      helperText={pwError}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleShowPassword}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
            >
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  </Grid>
  <Grid item xs={12}>
    <TextField
      required
      fullWidth
      type={showPw ? 'text' : 'password'}
      id="rePw"
      name="rePw"
      label="비밀번호 확인"
      value={rePw}
      onChange={(e) => {
        const value = e.target.value;
        setRePw(value);
        // 비밀번호 확인 변경 시, 비밀번호와 일치 여부 확인
        setPwError(value !== pw ? '비밀번호가 일치하지 않습니다.' : '');
      }}
      error={pwError !== ''}
      helperText={pwError}
    />
  </Grid>
              

  {/* 이름 및 생년월일 입력 */}
    <Grid item xs={12} sm={6}>
                      <TextField required fullWidth id="name" name="name" value={name} 
                      onChange={(e) => {const value = e.target.value; setName(value);}} label="이름"
                      error={nameError !== ''}
    helperText={nameError} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="생년월일"
                          value={selectedDate}
                          onChange={handleDateChange}
                          renderInput={(params) => <TextField {...params} error={birthError !== ''} helperText={birthError}  />}
                        />
                      </LocalizationProvider>
                    </Grid>

  {/* 이메일 입력 */}
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => {const value = e.target.value; setEmail(value);}}
                        label="이메일 주소"
                        error={emailError !== ''}
                        helperText={emailError}
                      />
                    </Grid>

  {/* 약관 동의 */}
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Checkbox onChange={handleAgree} color="primary" />}
                        label="회원가입 약관에 동의합니다."
                      />
                    </Grid>
                  </Grid>
              {/* 가입 요청 */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, bgcolor: 'primary.main' }}
                    size="large"
                  >
                    가입하기
                  </Button>
                </FormControl>
                <FormHelperTexts>{registerError}</FormHelperTexts>
                </Boxs>
            </Box>
            <Snackbar open={alertOn} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            로그인에 성공했습니다!
          </Alert>
        </Snackbar>
          </Container>
        </ThemeProvider>
      );
    };

    export default Register;
