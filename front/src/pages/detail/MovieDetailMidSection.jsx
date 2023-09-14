import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, IconButton, Modal, Popover, Snackbar, TextareaAutosize, Typography } from '@mui/material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { addToArchiveDB, checkMovieArchiveDB, deleteToArchiveDB, getMovieCommentDB, getUserMovieCommentDB, insertMovieCommentDB, updateMovieCommentDB } from '../../axios/detail/contentsLogic';
import { getCookie } from '../../utils/getCookies';
import { useSnackbar } from 'notistack';
import { CheckBoxOutlined } from '@mui/icons-material';
import { useMovieContext } from '../../utils/movieDetailContext';

          const MovieDetailMidSection = ({ movieDetail, posterUrl , ottInfo }) => {
            const movieId = movieDetail.movieId;
            const movieSeq = movieDetail.movieSeq;
            const title = movieDetail.title;
            const titleOrg = movieDetail.titleOrg
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
             
            const userId = getCookie('userId');
            const userName = getCookie('userName');
            const userProfileImage = getCookie('userProfileImage')
         
            const [userMovieComment , setUserMovieComment] = useState([])
            const [userCheckArchive , setUserCheckArchive] = useState([])
            const [open, setOpen] = useState(false);
            const [alertOn, setAlertOn] = useState(false);
            const [textLength, setTextLength] = useState(0);
            const [textValue, setTextValue] = useState('');
            const [spoilerActive, setSpoilerActive] = useState(false);
            const [anchorEl, setAnchorEl] = useState(null);
            const { updatedComments, setUpdatedComments } = useMovieContext();
            const { enqueueSnackbar } = useSnackbar(); 


            useEffect(() => {
              const isExistUserCommentAndArchive = async () => {
                try {
                  const movieComment = await getUserMovieCommentDB(movieId , movieSeq , userId)
                 setUserMovieComment(movieComment[0])

                 const checkArchive = await checkMovieArchiveDB(movieId , movieSeq , userId)
                 setUserCheckArchive(checkArchive[0])
                } catch (error) {
                  console.log("유저 코멘트, 보관함 유무 로드 실패 : " , error);
                }
              }
              if (movieId !== undefined && movieSeq !== undefined && userId !== undefined) {
                isExistUserCommentAndArchive()
                }
              },[movieId , movieSeq , userId])

             


            const handlePopoverOpen = (event) => {setAnchorEl(event.currentTarget);};
            const handlePopoverClose = () => {setAnchorEl(null);};
            const popoverOpen = Boolean(anchorEl);
            const handleOpen = () => {
              if (userId) {
                setOpen(true);
              } else {
                setAlertOn(true);
                enqueueSnackbar('로그인 후 이용하실 수 있습니다.', { variant: 'error' });
              }
            };
            const handleClose = () => setOpen(false); 

            const handleAlertClose = () => {
              setAlertOn(false)
            }

            //코멘트 등록 함수
            const handleWriteComment = async() => {
              const commentData = {
               movieId : movieId,
               movieSeq : movieSeq,
               commentDetail : textValue,
               spolierStatus : spoilerActive,
               userId : userId,
               userName : userName,
               userProfileImage : userProfileImage 
              }
              console.log(commentData);
              try {
                const res = await insertMovieCommentDB(commentData)
                if(res === 1){
                  setOpen(false)
                  setUserMovieComment(commentData)
                  enqueueSnackbar('코멘트를 등록했습니다!', { variant: 'success' });
                  setAlertOn(true);
                  try{
                   const updatedComments = await getMovieCommentDB(movieId, movieSeq);
                   setUpdatedComments(updatedComments);
                  }catch(error){
                    console.log('업데이트 반영 실패 : ' ,error);
                  }
                }else{
                  enqueueSnackbar('코멘트를 등록하지 못했습니다!', { variant: 'error' });
                  setAlertOn(true);
                }
              } catch (error) {
                console.log('코멘트 등록 실패 :' , error);
                enqueueSnackbar('네트워크 오류!', { variant: 'error' });
                  setAlertOn(true);
              }
            }
         //코멘트 수정 모달창
            const handleEditComment = (commentDetail, spoilerStatus) => {
              setTextValue(commentDetail);
              setTextLength(commentDetail.length);
              setSpoilerActive(spoilerStatus)
              setOpen(true);
            };

            //코멘트 수정
  const handleUpdateComment = async() => {
    const commentData = {
      commentDetail : textValue,
      spoilerStatus : spoilerActive,
      movieId : movieId,
      movieSeq : movieSeq,
      userId : userId
     }
     console.log(commentData);
     try {
       const res = await updateMovieCommentDB(commentData)
       console.log(res.data);
       if(res === 1){
        setOpen(false)
         enqueueSnackbar('코멘트를 수정했습니다!', { variant: 'success' });
         setAlertOn(true);
         try{
          const updatedComments = await getMovieCommentDB(movieId, movieSeq);
          setUpdatedComments(updatedComments);
         }catch(error){
           console.log('업데이트 반영 실패 : ' ,error);
         }
       }else{
         enqueueSnackbar('코멘트를 수정하지 못했습니다!', { variant: 'error' });
         setAlertOn(true);
       }
     } catch (error) {
       console.log('코멘트 수정 실패 :' , error);
       enqueueSnackbar('네트워크 오류!', { variant: 'error' });
         setAlertOn(true);
     }
   }


       //보관함 추가(보고싶어요 함수)
       const handleAddtoArchive = async() => {
        if (userId) {
          const archiveData = {
            movieId : movieId,
            movieSeq : movieSeq,
            title : title,
            titleOrg : titleOrg,
            userId : userId,
            addDate : formattedDate
          }
          try{
            const res = await addToArchiveDB(archiveData)
            if(res === 1){
              setUserCheckArchive(archiveData)
              enqueueSnackbar('영화를 보관함에 추가하였습니다!', { variant: 'success' });
                setAlertOn(true);
            }
          }catch(error){
            console.log('보관함 추가 실패 : ', error);
            enqueueSnackbar('네트워크 오류!', { variant: 'error' });
            setAlertOn(true);
          }
        }else{
          enqueueSnackbar('로그인 후 이용하실 수 있습니다.', { variant: 'error' });
          setAlertOn(true);
        }
       }
       //보관함 제거 ( 보관된 영화)
       const handleDeleteToArchive = async() => {
          const archiveData = {
            movieId : movieId,
            movieSeq : movieSeq,
            userId : userId,
          }
          try{
            const res = await deleteToArchiveDB(archiveData)
            if(res === 1){
              setUserCheckArchive(null)
              enqueueSnackbar('영화를 보관함에서 삭제하였습니다!', { variant: 'success' });
              setTimeout(() => {
                setAlertOn(true);
              },1500)
            }
          }catch(error){
            console.log('보관함 삭제 실패 : ', error);
            enqueueSnackbar('네트워크 오류!', { variant: 'error' });
            setAlertOn(true);
          }
       }



            const formattedKeywords = movieDetail.keywords
            ? movieDetail.keywords.split(',').map(keyword => `#${keyword.trim()}`).join(' ')
            : '';
        

            const ottPlatforms = Object.keys(ottInfo).filter(
              (platform) => platform !== "movieSeq" && platform !== "title" && ottInfo[platform]
            );
            
          const ottLinks = {
          netflix: "https://www.netflix.com/",
          watcha: "https://www.watcha.com/",
          wavve: "https://www.wavve.com/",
          tving: "https://www.tving.com",
          disneyplus: "https://disneyplus.com",
          appletv: "https://www.apple.com/kr/apple-tv-plus/"
        };



    /*  Style  */
            const midSection1Style = {
              width: '1525px', height: '750px', backgroundColor: '#f5f5f5', display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            };


            const contentContainer = {
              marginTop:'550px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              width: '90%',
            };

            const contentStyle = {
              display: 'flex', maxHeight:'650px', marginBottom : '650px',
              flexDirection: 'column', alignItems: 'flex-start',
            };

            const posterStyle = {
              width: '300px', height: '450px', objectFit: 'cover',
              marginRight: '50px',
            };
          
            const ottInfoStyle = {
              display: 'flex', alignItems: 'center',width: '650px',
              marginTop : '40px',
            };

            const ottUnderline = {
              width: '1000px', borderBottom: '1px solid black', opacity:'10%',
              marginBottom: '40px',
            };

            const ottLogoStyle = {
              width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', 
              backgroundColor : '#000000', border: '3px solid white', marginBottom:'40px', marginRight: '20px',
              cursor: 'pointer',
            };

            const plotTextStyle = {
              maxWidth: '1000px', fontSize: '13px', opacity: '80%',
              marginTop : '5px'
            };


            const modalStyle = {
              position: 'absolute', top: '50%',left: '50%',
              transform: 'translate(-50%, -50%)', width: 500, height: 400,
              bgcolor: 'background.paper', borderRadius: '10px', boxShadow: 24, p: 4,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            };

            const commentField = {
              marginTop:'10px', width: 480, height: 320,border: 'none',
              textAlign: 'left', outline: 'none', fontSize: '15px' 
            }

            return (
              <div style={midSection1Style}>
                <div style={contentContainer}>
            
                {/* 포스터 div */}
                  <div style={contentStyle}>
                    <img src={posterUrl} alt={movieDetail.title} style={posterStyle} />
                    <div style={{marginTop:'20px' , maxWidth:'300px' , maxHeight:'300px' , textAlign:'center'}}>
                    <Typography variant="button" style={{ fontSize: '13px', marginTop: '30px', opacity: '60%' }}>{formattedKeywords}</Typography>
                    </div>
                  </div>
            
                {/* OTT 유무 & 보관함 추가 */}
                  <div style={{ flex: 1 }}>
                    <Typography variant='h6' style={{fontSize:'20px' , opacity:'85%'}}>감상 가능한 서비스</Typography>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                
                
                  <div style={ottInfoStyle}>
                  {ottPlatforms.length === 0 ? (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginLeft: '30px' , marginBottom:'30px'}}>
    <IconButton>
    <SentimentVeryDissatisfiedIcon style={{fontSize:'75px'}}/>
    </IconButton>
                
                    <Typography variant="h6" style={{ opacity: '60%' }}>... 감상 가능한 OTT 없음</Typography>
        </div>
                  ) : (
                    ottPlatforms.map((platform) => (
                      <a
                        key={platform}
                        href={ottLinks[platform]}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                      >
                        <img
                          key={platform}
                          src={`/images/logo/${platform}.png`}
                          alt={platform}
                          style={ottLogoStyle}
                        />
                      </a>
                    ))
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginLeft: '80px' }}>
                {userCheckArchive && userCheckArchive.userId === userId  ? (
    <>
      <IconButton onClick={handleDeleteToArchive}>
        <BookmarkAddedIcon style={{fontSize:'60px'}}/>
      </IconButton>
      <Typography variant='subtitle2' style={{opacity:'60%'}}>보관된 영화</Typography>
    </>
  ) : (
    <>
      <IconButton onClick={handleAddtoArchive}>
        <BookmarkAddIcon style={{fontSize:'60px'}}/>
      </IconButton>
      <Typography variant='subtitle2' style={{opacity:'60%'}}>보고싶어요</Typography>
    </>
  )}
</div>


      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginLeft: '40px' }}>
      {userMovieComment && userMovieComment.userId === userId ? (
  <div>
    <IconButton onClick={() => handleEditComment(userMovieComment.commentDetail , userMovieComment.spoilerStatus)}>
      <EditNoteIcon style={{ fontSize: '60px' }} />
    </IconButton>
    <Typography variant='subtitle2' style={{ opacity: '60%' }}>코멘트 수정</Typography>
  </div>
) : (
  <div>
    <IconButton onClick={handleOpen}>
      <EditIcon style={{ fontSize: '60px' }} />
    </IconButton>
    <Typography variant='subtitle2' style={{ opacity: '60%' }}>코멘트</Typography>
  </div>
)}


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
                {movieDetail.title}
              </Typography>
              <TextareaAutosize
        style={{ ...commentField, resize: 'none' }}
        minRows={10} 
        maxRows={20} 
        value={textValue}
        placeholder={`${movieDetail.title}에 대한 의견을 남겨주세요.`}
        onChange={(e) => {setTextLength(e.target.value.length); setTextValue(e.target.value)}}
      />
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="button" style={{ opacity: '60%' }}>
        {textLength}/1000
      </Typography>
      <IconButton onClick={() => setSpoilerActive(prevSpoilerActive => !prevSpoilerActive)}    
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}>
        <CampaignOutlinedIcon style={{ color: spoilerActive ? '#1976d2' : 'inherit' }}/>
          </IconButton>
      <div style={{marginLeft:'-300px'}}>
      <Button
        variant="contained"
        disabled={textLength === 0 || textLength > 1000}
        sx={{ backgroundColor: '#1976d2' }}
        onClick={userMovieComment && userMovieComment.userId === userId ? handleUpdateComment : handleWriteComment}
        >
        저장하기
      </Button>
        </div>
    </div>


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
          <Box sx={{ p: 2 }}>
            <Typography variant='caption'>스포일러가 포함된 코멘트라면 클릭해주세요!</Typography>
          </Box>
        </Popover>

            </Box>
          </Modal>
      </div>

                    </div>



                      <div style={ottUnderline}/>
                    <Typography variant="h6" style={plotTextStyle}>
                      {movieDetail.plotText}
                    </Typography>
                  </div>
                </div>
                  {/* 알림 창 */}
                  <Snackbar open={alertOn} autoHideDuration={3000} onClose={handleAlertClose}>
         </Snackbar>
              </div>



            );
          };

          export default MovieDetailMidSection;
