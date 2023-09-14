import React, { useEffect, useState } from 'react'
import { recommendMoviesDB } from '../../axios/main/movieLogic';
import { Card, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Slider from 'react-slick';
import { useNavigate } from 'react-router';
import { firebaseStorage } from '../../utils/firebase';

const MainMidSection = () => {
   const navigate = useNavigate()
   const [recommendMovies, setRecommendMovies] = useState([]);
   const [posterUrls , setPosterUrls] = useState([])

  useEffect(() => {
    const getRecommendMovies = async () => {
      try {
        const res = await recommendMoviesDB();
        setRecommendMovies(res);
      } catch (error) {
        console.error('추천영화 로드 실패:', error);
      }
    };
    getRecommendMovies();
  }, []);



  useEffect(() => {
    const getPosterUrls = async () => {
      const urls = await Promise.all(recommendMovies.map(async (movie) => {
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
  }, [recommendMovies]);



  const settings = {
    dots: true,
    arrows : true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5
  };

  


  return (
    <> 
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' , marginRight:'1250px' }}>
        <Typography variant="h6" sx={{ fontSize: 25 }}>추천 SF 영화</Typography>
        <Tooltip title="왓챠피디아 기준 평가 수 10만 이하의 작품 중 가장 높은 평균 별점을 받은 영화들입니다." placement="right">
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </div>
    <Slider {...settings}>
      {recommendMovies.map((movie, index) => (
        <div key={index} style={{ position: 'relative' }}>
          <Card sx={{ maxWidth: 250, height: 450 ,mx: 2 , border:'none' , margin: '0 auto', cursor:'pointer'}}
          onClick={() => navigate(`/movieDetail/${movie.movieId}${movie.movieSeq}`)}>
          
            <img src={posterUrls[index]} alt={movie.title} style={{ width: '100%', height: '350px' , borderRadius:'3px 3px 3px 3px' }} />
          
            <CardContent style={{ border:'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <Typography variant="subtitle2" sx={{fontSize:15}}>{movie.title.length > 18 ? `${movie.title.slice(0, 18)}...` : movie.title}</Typography>
          
              <Grid container justifyContent="flex-start" style={{marginTop:'5px'}}>
                <Typography variant="body2">{movie.prodYear} · {movie.nation}</Typography>
              </Grid>
          
              <Typography variant="caption" style={{marginTop:'5px'}}> {movie.directorNms} </Typography>
            </CardContent>
          
          </Card>
        </div>
      ))}
    </Slider>
  </div>
    </>
  )
}

export default MainMidSection