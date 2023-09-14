import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PasswordIcon from '@mui/icons-material/Password';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Modal, Snackbar, TextField } from '@mui/material';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { changePwDB, changeUserNameDB, updateProfileImageDB } from '../../axios/user/editLogic';
import { serialize } from 'cookie';
import { useEffect } from 'react';
import { userInfoDB } from '../../axios/user/loginLogic';
import { getCookie } from '../../utils/getCookies';
import { firebaseStorage } from '../../utils/firebase';
import { withdrawUserDB } from '../../axios/user/registerLogic';
import { useNavigate } from 'react-router';
import { useMovieArchiveContext } from '../../utils/movieArchiveContext';


export default function UserProfile({ userInfo }) {
  const userId = userInfo.userId
  const userName = getCookie('userName')
  const userProfileImage = getCookie('userProfileImage')
  const { userArchive } = useMovieArchiveContext()
  const [isExistArchive , setIsExistArchive] = useState(false)
  const [open, setOpen] = useState(false);
  const [userNameValue , setUserNameValue] = useState('')
  const [userProfileImageValue , setUserProfileImageValue] = useState('')
  const [pwValue , setPwValue] = useState('')
  const [changePwValue , setChangePwValue] = useState('')
  const [pwError , setPwError] = useState('')
  const [changePwError , setChangePwError] = useState('')
  const [isNameChanged, setIsNameChanged] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pwDialogOpen, setPwDialogOpen] = useState(false);
  const [alertOn, setAlertOn] = useState(false);  
  const { enqueueSnackbar } = useSnackbar(); 
  const navigate = new useNavigate()

  useEffect(() => {
   if(userArchive) {
     setIsExistArchive(userArchive.length > 0)
   }
  }, [userArchive])

  useEffect(() => {
    const getUserInfo = async() => {
    try {
      const res = await userInfoDB(userId)
      setUserNameValue(res[0].userName)
    } catch (error) {
     console.log('유저 정보 로드 실패 : ', error); 
    }
    }
    getUserInfo()
  },[userName,userProfileImage])

  const handleEditProfile = () => {
    setOpen(true)
  }
  const handleClose = () => setOpen(false); 
  const handleAlertClose = () => {setAlertOn(false)}
  const handleDialogClick = () => {setDialogOpen(true)};
  const handleDialogClose = () => {setDialogOpen(false);};
  const handlePwDialogClick = () => {setPwDialogOpen(true)};
  const handlePwDialogClose = () => {setPwDialogOpen(false); setPwError(''); setChangePwError('')};


 /* 프사 변경 */
const handleImageChange = async () => {
  try {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const fileRef = firebaseStorage.ref(`profileImage/${userId}`);
        await fileRef.put(file);

        const downloadURL = await fileRef.getDownloadURL();
        setUserProfileImageValue(downloadURL);
        try {
        // 데이터베이스에 이미지 URL 업데이트 로직 수행
         const requestData = {
            userId : userId,
            newUserProfileImage : downloadURL
        }
        const res = await updateProfileImageDB(requestData);
        document.cookie = serialize('userProfileImage', downloadURL , { path: '/' });
        enqueueSnackbar('프로필 이미지가 업데이트되었습니다!', { variant: 'success' });
        setAlertOn(true);
        } catch (error) {
        console.log('프로필 이미지 변경 실패 : ', error);        }
      }
    };
    input.click();
  } catch (error) {
    console.error('프로필 이미지 업로드 에러: ', error);
    enqueueSnackbar('프로필 이미지 업로드 중 오류가 발생했습니다.', { variant: 'error' });
    setAlertOn(true);
  }
};


  /* 이름 변경 */
  const handleNameChange = async() => {
    const requestData = {
      userId : userId,
      newUserName : userNameValue
    }
  try {
    const res = await changeUserNameDB(requestData)
    if(res === 1){
      setIsNameChanged(false)
      document.cookie = serialize('userName', userNameValue , { path: '/' });
      setUserNameValue(userNameValue)
      enqueueSnackbar('이름이 변경되었습니다!', { variant: 'success' });
      setAlertOn(true);
    }else{
      console.log('이름 변경 실패');
    }
  } catch (error) {
    console.log('이름 변경 실패 : ', error);
    enqueueSnackbar('네트워크 오류 발생', { variant: 'error' });
    setAlertOn(true);
  }
}

const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
/* 비밀번호 변경 */
const handleChangePw = async() => {
  if (!pwRegex.test(changePwValue)) {
    setChangePwError('조건에 부합하지 않은 비밀번호 입니다.');
    return;
  }
  const requestData = {
    userId : userId,
    userPw : pwValue,
    userChangePw : changePwValue
  } 
  try{
   const res = await changePwDB(requestData)
   if(res === 1){
    setPwDialogOpen(false)
    enqueueSnackbar('비밀번호 변경이 완료되었습니다.', { variant: 'success' });
    setAlertOn(true);
   }else{
    setPwError('비밀번호가 일치하지 않습니다.')
    enqueueSnackbar('비밀번호 변경에 실패하였습니다.', { variant: 'warning' });
    setAlertOn(true);
   }
  }catch(error){
    console.log('네트워크 오류 : ' , error);
  }
}


/* 회원 탈퇴 */
const handleWithdrawUser = async() => {
  try {
    const res = await withdrawUserDB(userId)
    if(res === 1){
    // 쿠키 삭제
     document.cookie = serialize('userId', '', { path: '/', maxAge: -1 });
     document.cookie = serialize('userName', '', { path: '/', maxAge: -1 });
     document.cookie = serialize('userEmail', '', { path: '/', maxAge: -1 });
     document.cookie = serialize('userBirth', '', { path: '/', maxAge: -1 });
     document.cookie = serialize('userProfileImage', '', { path: '/', maxAge: -1 });
      navigate('/main')
      enqueueSnackbar('회원 탈퇴가 완료되었습니다.', { variant: 'success' });
      setAlertOn(true);
    }else{
      enqueueSnackbar('회원 탈퇴 실패.', { variant: 'error' });
        setAlertOn(true);
    }
  } catch (error) {
    console.log('네트워크 오류 : ', error);
  }
}


/* Style */
  const modalStyle = {
    position: 'absolute', top: '50%',left: '50%',
    transform: 'translate(-50%, -50%)', width: 400, height: 300,
    bgcolor: 'background.paper', borderRadius: '10px', boxShadow: 24, p: 4,
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
  };

  return (
    <>
      <div style={{display:'flex'}}>
      <AccountCircleIcon style={{marginLeft:'15px',marginRight:'5px',marginTop:'2px'}}/><Title>프로필</Title>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',marginTop:'3px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', marginBottom: '10px' }}>
          <img src={userProfileImage ? userProfileImage : '/images/astronaut.jpg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        </div>
        <div>
        <Typography variant="h6">{userName}</Typography>
        </div>
        <div style={{ marginTop: '10px',display: 'flex', alignItems: 'center'}}>
        <IconButton onClick={handleEditProfile}>
          <EditIcon style={{ fontSize: 15, marginRight: '5px' , marginBottom:'5px' }} />
          <Typography variant='button'>프로필 편집</Typography>
          </IconButton>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' , marginTop:'-5px' }}>
          <IconButton onClick={handlePwDialogClick}>
          <PasswordIcon style={{ fontSize: 15, marginRight: '5px' , marginBottom:'5px' }}/>
            <Typography variant='button'>비밀번호 변경</Typography>
          </IconButton>
        </div>
        <div style={{ display: 'flex' , alignItems: 'center', marginTop:'-5px'}}>
          <IconButton onClick={handleDialogClick}>
          <ExitToAppIcon style={{ fontSize: 15, marginRight: '5px' , marginBottom:'5px' }}/>
            <Typography variant='button'>회원 탈퇴</Typography>
          </IconButton>
        </div>

        {/* 프로필 편집 모달창 */}
        <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={modalStyle}>
  <IconButton
          style={{ position: 'absolute', top: '25px', right: '20px' }}
          onClick={handleClose}
        >
          <CancelIcon />
        </IconButton>
    <Typography id="modal-modal-title" variant="h6" component="h2">
     프로필 편집
    </Typography>

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {/* 이미지 변경 */}
    <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', marginBottom: '10px'}}>
          <img src={userProfileImage ? userProfileImage : '/images/astronaut.jpg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        </div>
        <Button color="science" variant="contained" onClick={handleImageChange} style={{ color: 'white',fontSize:'12px',marginBottom:'20px'}}>사진 편집</Button>

{/* 이름 변경 */}
<div style={{display:'flex', flexDirection:'column'}}>
  <div>
  <Typography variant='overline' style={{fontSize:'15px',marginRight:'5px'}}>· 이름 : </Typography>
  <TextField
  hiddenLabel
  id="changeUserName"
  defaultValue={userNameValue}
  variant="standard"
  onChange={(event) => {
  setUserNameValue(event.target.value)
  setIsNameChanged(event.target.value !== userNameValue);
  }}
/>
  <Button color="science" variant="text" disabled={!isNameChanged} style={{fontSize:'12px' , marginLeft:'15px' , marginBottom:'0px'}} onClick={handleNameChange}>변경하기</Button>
  </div>
</div>
</div>  
  </Box>
</Modal>


            {/* 비밀번호 변경 */}
            <Dialog
          open={pwDialogOpen}
          onClose={handlePwDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"비밀번호 변경"}
          </DialogTitle>
          <DialogContent>
         <Typography variant='h5' style={{fontSize:'15px'}}>
          숫자,영문자,특수문자를 조합하여 8자리 이상 입력해주세요.
         </Typography>
          </DialogContent>
          <DialogContent style={{display:'flex', flexDirection:'column' , marginTop:'12px' , alignItems:'center'}}>
            <div style={{display:'flex' , flexDirection:'row'}}>
            <Typography variant='caption' style={{fontSize:'16px'}}>
            비밀번호
            </Typography>
            <TextField hiddenLabel id="userPw" color="secondary" type='password' variant="standard" size='small' style={{marginLeft:'35px',marginBottom:'10px'}}
  error={pwError !== ''}
  helperText={pwError}
  onChange={(event) => {
    setPwValue(event.target.value)
  }}/>
  </div>
  <div style={{display:'flex' , flexDirection:'row' , marginTop:'30px' , marginBottom:'10px'}}>
            <Typography variant='caption' style={{fontSize:'16px'}}>
             새 비밀번호
            </Typography>
            <TextField hiddenLabel id="changePw" color="secondary" type="password" variant="standard" style={{marginLeft:'15px'}}
 error={changePwError !== ''}
 helperText={changePwError}
 onChange={(event) => {
    setChangePwValue(event.target.value);
  }}/>
  </div>
        </DialogContent>
          <DialogActions>
            <Button onClick={handlePwDialogClose}>취소</Button>
            <Button onClick={handleChangePw} disabled={changePwValue === '' || pwValue === ''}>
              변경하기
            </Button>
          </DialogActions>
        </Dialog>

            {/* 탈퇴 확인 */}
            <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"SFDB 탈퇴"}
          </DialogTitle>
          <DialogContent style={{display:'flex',flexDirection:'column'}}>
            <Typography variant='caption' style={{fontSize:'16px'}}>
            회원님이 보지 못한 좋은 영화들이 기다리고 있습니다. 
            </Typography>
           {isExistArchive ? (
            <Typography variant='caption' style={{fontSize:'16px'}}>
             보관함에 담아둔 영화들이 사라져요. 그래도 탈퇴하시겠어요?
            </Typography>
             ) : (
             <Typography variant='caption' style={{fontSize:'16px'}}>
             그래도 탈퇴하시겠어요?
            </Typography>
             )}
        </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>취소</Button>
            <Button onClick={handleWithdrawUser} autoFocus>
              탈퇴하기
            </Button>
          </DialogActions>
        </Dialog>
      
                      {/* 알림 창 */}
                      <Snackbar open={alertOn} autoHideDuration={3000} onClose={handleAlertClose}>
          </Snackbar>
      </div>
    </>
  );
}
