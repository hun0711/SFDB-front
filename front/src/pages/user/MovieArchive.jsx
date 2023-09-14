import React, { useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import Title from './Title';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import BrowserNotSupportedIcon from '@mui/icons-material/BrowserNotSupported';
import { deleteToArchiveDB, getUserArchiveDB } from '../../axios/detail/contentsLogic';
import { Alert, Button, Card, CardContent, Checkbox, FormControlLabel, Snackbar, Typography } from '@mui/material';
import { firebaseStorage } from '../../utils/firebase';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { useMovieArchiveContext } from '../../utils/movieArchiveContext';

export default function MovieArchive({ userInfo }) {
  const userId = userInfo.userId;
  const navigate = useNavigate();
  const { userArchive, setUserArchive } = useMovieArchiveContext();
  const [userMovieArchive, setUserMovieArchive] = useState([]); 
  const [posterUrls, setPosterUrls] = useState([]);
  const [checked, setChecked] = useState([]);
  const [alertOn, setAlertOn] = useState(false)
  const { enqueueSnackbar } = useSnackbar(); 
  
  const handleAlertClose = () => {
    setAlertOn(false)
  }

  useEffect(() => {
    const getUserArchive = async () => {
      try {
        const res = await getUserArchiveDB(userId);
        setUserMovieArchive(res);
        setUserArchive(res)
        console.log(userArchive);
      } catch (error) {
        console.log('유저 보관함 로드 실패 : ', error);
      }
    };
    if (userId !== undefined) {
      getUserArchive();
    }
  }, [userId]);

  useEffect(() => {
    const getPosterUrls = async () => {
      const urls = await Promise.all(userMovieArchive.map(async (movie) => {
        const storageRef = firebaseStorage.ref(`poster/${movie.movieId}${movie.movieSeq}.jpg`);
        try {
          const url = await storageRef.getDownloadURL();
          return url;
        } catch (error) {
          console.log("포스터 URL 페칭 에러 : " , error);
          return null;
        }
      }));
      setPosterUrls(urls);
    };

    getPosterUrls();
  }, [userMovieArchive]);

  // Checkbox 선택 상태 변경
  const handleToggle = (index) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
  };

  // 선택 삭제 
  const handleArchiveDeleteSelected = async () => {
    const selectedMovies = userMovieArchive.filter((movie, index) => checked[index]);
    console.log('선택한 영화' , selectedMovies);

  for (const selectedMovie of selectedMovies) {
    const archiveData = {
      movieId: selectedMovie.movieId,
      movieSeq: selectedMovie.movieSeq,
      userId: userId
    };
    try {
      const res = await deleteToArchiveDB(archiveData)
      if(res === 1){
        setUserMovieArchive(prevArchive => prevArchive.filter(movie => movie.movieId !== selectedMovie.movieId));
        enqueueSnackbar('선택한 영화를 보관함에서 제거하였습니다.', { variant: 'success' });
        setAlertOn(true);
      }else{
        console.log('보관함 삭제 실패');
        enqueueSnackbar('영화를 보관함에서 제거하지 못하였습니다.', { variant: 'error' });
        setAlertOn(true);
      }
    } catch (error) {
      console.log('보관함 삭제 로직 실패 : ' ,error);
      enqueueSnackbar('네트워크 오류 발생', { variant: 'error' });
      setAlertOn(true);
    }
  };
  }

  /* Style */
  const archiveSectiontyle = {
    minWidth: '1200px',
    maxWidth: '1200px',
    minHeight: '150px',
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'row', 
    flexWrap: 'wrap', 
  };

  return (
    <>
    <div style={{ display: 'flex' }}>
    <BookmarksIcon style={{marginLeft:'15px',marginRight:'5px',marginTop:'3px'}}/><Title>보관함</Title>
    <Typography variant="h4" style={{ fontSize: '23px' , marginLeft:'10px', color:'#1976d2' }}>
          {userMovieArchive.length}
        </Typography>
      <div style={{ marginLeft: '15px' }}>
        {userMovieArchive.length > 0 && (
          <Button variant='contained' color='error' style={{ fontSize: '12px' }} 
          disabled={checked.every((value) => !value)} onClick={handleArchiveDeleteSelected}>
            선택 삭제
          </Button>
        )}
      </div>
    </div>

    <div style={archiveSectiontyle}>
      {userMovieArchive.length > 0 ? (
        userMovieArchive.map((movie, index) => (
          <div key={index}>
            <Card
              sx={{
                maxWidth: 240,
                height: 430,
                mx: 2,
                border: 'none',
                marginRight: '10px',
                cursor: 'default', 
              }}
            >
              <img
                src={posterUrls[index]}
                alt={movie.title}
                style={{ width: '100%', height: '350px', borderRadius: '3px 3px 3px 3px' ,cursor:'pointer'}}
                onClick={() => 
                    navigate(`/movieDetail/${movie.movieId}${movie.movieSeq}`)
                  }
              />
              <CardContent style={{ border: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                <Typography variant="subtitle2" sx={{ fontSize: 15 }}>
                  {movie.title.length > 15 ? `${movie.title.slice(0, 15)}...` : movie.title}
                </Typography>
                <FormControlLabel
                  label={<Typography variant="overline" style={{ fontSize: '14px' }}>{movie.addDate} 추가됨</Typography>}
                  control={<Checkbox checked={checked[index] || false} onChange={() => handleToggle(index)} />}
                />
              </CardContent>
            </Card>
          </div>
        ))
      ) : (
        <div style={{marginLeft:'100px' , marginTop:'50px',opacity:'50%',display:'flex'}}>
          <BrowserNotSupportedIcon style={{fontSize:'30px' , marginRight:'5px'}}/><Typography variant='h4' style={{fontSize:'25px'}}>보관중인 영화가 없습니다.</Typography>
          </div>
      )}
    </div>
    <Link color="primary" href="/main" sx={{ mt: 3 , opacity: '50%' , marginLeft:'16px'}}>
      See more Movies
    </Link>
      {/* 알림 창 */}
      <Snackbar open={alertOn} autoHideDuration={3000} onClose={handleAlertClose}>
         </Snackbar>
  </>
  );
}
