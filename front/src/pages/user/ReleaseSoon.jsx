import * as React from 'react';
import Title from './Title';
import TheatersIcon from '@mui/icons-material/Theaters';
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect } from 'react';
import { releaseSoonMovieDB } from '../../axios/main/movieLogic';
import { useState } from 'react';
import { Box, Button, Card, IconButton, Modal, Popover, Snackbar, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { firebaseStorage } from '../../utils/firebase';
import { getYouTubeVideoByQuery } from '../../utils/youtubeApi';
import { existReleaseNoticeEmailUser, releaseNoticeEmail } from '../../axios/user/mailLogic';

export default function ReleaseSoon({ userInfo }) {
  const userId = userInfo.userId
  const userEmail = userInfo.userEmail
  const [releaseSoonMovies , setReleaseSoonMovies] = useState([])
  const [emailValue, setEmailValue] = useState(userEmail)
  const [posterUrls, setPosterUrls] = useState();
  const [trailerId, setTrailerId] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = useState(false);
  const [alertOn, setAlertOn] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [isNoticeTaken, setIsNoticeTaken] = useState(false)
  const { enqueueSnackbar } = useSnackbar(); 
  const [emailError, setEmailError] = useState('');
  const emailRegex = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  
  useEffect(() => {
  const isExistReleaseNoticeEmailUser = async() => {
    try {
      const res = await existReleaseNoticeEmailUser(userId)
      setIsChecked(res)
    } catch (error) {
      console.log('알림 설정 유무 로드 실패 : ',error);
    }
  }
  isExistReleaseNoticeEmailUser()
  },[userId])

  useEffect(() => {
  const getReleaseSoonMovie = async() => {
    try {
      const res = await releaseSoonMovieDB()
      setReleaseSoonMovies(res[0])
    } catch (error) {
      console.log('개봉 예정 영화 로드 실패 : ', error);
    }
  }
  getReleaseSoonMovie()
  },[])

  useEffect(() => {
    const getPosterUrls = async () => {
        const storageRef = firebaseStorage.ref(`poster/${releaseSoonMovies.movieId}${releaseSoonMovies.movieSeq}.jpg`);
        try {
          const url = await storageRef.getDownloadURL();
          setPosterUrls(url);
        } catch (error) {
          console.log("포스터 URL 페칭 에러 : " , error);
          return null;
        }
    };
    getPosterUrls();
  }, [releaseSoonMovies]);

  useEffect(() => {
    const searchMovieTrailer = async () => {
      try {
        const query = releaseSoonMovies.title + releaseSoonMovies.prodYear + '예고편';
        console.log(query);
        const searchResults = await getYouTubeVideoByQuery(query)
        if(searchResults && searchResults.items && searchResults.items.length > 0) {
          const topVideo = searchResults.items[0];
          setTrailerId(topVideo.id.videoId)
        }
      } catch (error) {
        console.log('영화 예고편 검색 실패 : ', error);
      } 
    }
    if (releaseSoonMovies.title !== undefined && releaseSoonMovies.prodYear !== undefined) {
      searchMovieTrailer()
    }
  },[releaseSoonMovies.title, releaseSoonMovies.prodYear]);

 
  const handleNoticeClick = () => {
    setOpen(true)
  }
  const handleClose = () => setOpen(false); 
  const handleAlertClose = () => {
    setAlertOn(false)
  }
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);

  {/* 알림 설정 */}
  const handleReleaseNotice = async() => {
    if (!emailRegex.test(emailValue)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      return;
    }
    const requestData = {
      title : releaseSoonMovies.title,
      titleOrg : releaseSoonMovies.titleOrg,
      userId : userId,
      userEmail : emailValue,
      repRlsDate : releaseSoonMovies.repRlsDate,
      posterUrls : posterUrls,
      plotText : releaseSoonMovies.plotText,
      actorNms : releaseSoonMovies.actorNms
    }
    try {
      const res = await releaseNoticeEmail(requestData)
      if(res === 1){
        enqueueSnackbar('개봉 알림이 설정되었습니다!', { variant: 'success' });
        setAlertOn(true);
        setIsNoticeTaken(true);
        setIsChecked(true)
      }else{
        enqueueSnackbar('알림 설정 실패', { variant: 'error' });
        setAlertOn(true);
      }
    } catch (error) {
      console.log('개봉 예정작 이메일 알림설정 실패 :' , error);
      enqueueSnackbar('네트워크 오류', { variant: 'error' });
      setAlertOn(true);
    }
  }



  /* Style */
  const releaseSoonSectiontyle = {
    minWidth: '600px',
    maxWidth: '650px',
    minHeight: '150px',
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row'
  };

  const videoStyle = {
    marginTop: '10px',
    marginBottom: '10px',
    marginLeft: '20px',
    width: '400px',
    minWidth: '300px',
    maxWidth: '400px',
    height: '250px',
    minHeight: '250px',
    maxHeight: '250px'
  } 

const modalStyle = {
  position: 'absolute', top: '50%',left: '50%',
  transform: 'translate(-50%, -50%)', width: 450, height: 400,
  bgcolor: 'background.paper', borderRadius: '10px', boxShadow: 24, p: 4,
  display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
};

  return (
    <>
    <div style={{display:'flex'}}>
      <TheatersIcon style={{marginLeft:'15px',marginRight:'5px' ,marginTop:'3px'}}/><Title>개봉 예정</Title>
    <div style={{ marginLeft: '15px' }}>
          <Button color='science' variant='contained' disabled={isChecked}
          onClick={handleNoticeClick} style={{ fontSize: '10px' ,color:'white'}} >
            알림 설정
          </Button>
      </div>
    </div>


    <div style={releaseSoonSectiontyle}>
    <Card sx={{ maxWidth: 250, height: 250, mx: 2, border: 'none', marginRight: '10px'}}>
        <img
                src={posterUrls}
                alt={releaseSoonMovies.title}
                style={{ width: '100%', height: '250px', borderRadius: '3px 3px 3px 3px'}}
              />
            </Card>

    
   <div style={videoStyle}>
   {/* 동영상 삽입 */}
   {trailerId && (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerId}`}
              allowFullScreen
              style={{ border: 'none', borderRadius: '5px' }} 
            ></iframe>
          )}
   </div>

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
        <div style={{display:'flex'}}>
    <Typography id="modal-modal-title" variant="h6" component="h2">
     {releaseSoonMovies.title}
    </Typography>
    <Typography id="modal-modal-title" variant="h6" component="h2" style={{fontSize:'12px' , marginTop:'6px',marginLeft:'5px'}}>
     {releaseSoonMovies.titleOrg}
    </Typography>
        </div>

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '250px', height: '300px', marginTop:'5px' , marginBottom: '30px'}}>
          <img src={posterUrls} style={{  width: '100%', height: '320px', borderRadius: '3px 3px 3px 3px' }}/>
        </div> 
{/* 이메일 설정 */}
<div style={{display:'flex', flexDirection:'column' }}>
  <div>
  <Typography variant='overline' style={{fontSize:'15px',marginRight:'5px'}}>· 이메일 : </Typography>
  <TextField
  hiddenLabel
  defaultValue={emailValue}
  id="userEmail"
  error={emailError !== ''}
  helperText={emailError}
  variant="standard"
  onChange={(event) => {
    setEmailValue(event.target.value)
  }}/>
  <Button 
  aria-owns={popoverOpen ? 'mouse-over-popover' : undefined}
  aria-haspopup="true"
  onMouseEnter={handlePopoverOpen}
  onMouseLeave={handlePopoverClose}
  color="science"
  disabled={isNoticeTaken}
   variant="contained" style={{color:'white',fontSize:'10px' , marginLeft:'15px' , marginBottom:'3px'}} onClick={handleReleaseNotice}>알림 받기</Button>
  </div>
</div>
</div>  
  </Box>
</Modal>

<Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={popoverOpen}
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
        <Typography variant='overline' style={{marginLeft:'3px' , marginRight:'3px'}}>개봉 시 이메일로 알림이 발송됩니다.</Typography>
      </Popover>
                    {/* 알림 창 */}
          <Snackbar open={alertOn} autoHideDuration={3000} onClose={handleAlertClose}>
          </Snackbar>
    </div>
    </>
  );
}
