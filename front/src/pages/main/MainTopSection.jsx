import React, { useState, useEffect } from 'react';
import { top20sfmoviesDB } from '../../axios/main/movieLogic';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, CardContent, Grid, IconButton, Tooltip, Typography} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router';
import { firebaseStorage } from '../../utils/firebase';

const MainTopSection = () => {
  const navigate = useNavigate()
  const [top20Movies, setTop20Movies] = useState([]);
  const [posterUrls, setPosterUrls] = useState([]);

  useEffect(() => {
    const getTop20SfMovies = async () => {
      try {
        const res = await top20sfmoviesDB();
        setTop20Movies(res);
      } catch (error) {
        console.error('top20영화 로드 실패:', error);
      }
    };

    getTop20SfMovies();
  }, []);

  useEffect(() => {
    const getPosterUrls = async () => {
      const urls = await Promise.all(top20Movies.map(async (movie) => {
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
  }, [top20Movies]);




  
  const settings = {
    dots: true,
    arrows : true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 5000,
  };





  return (
  <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' , marginRight:'1200px' }}>
        <Typography variant="h6" sx={{ fontSize: 25 }}>Top 20 SF 영화</Typography>
        <Tooltip title="왓챠피디아 기준 평균별점이 가장 높은 20개의 SF 영화들입니다." placement="right">
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </div>
    <Slider {...settings}>
      {top20Movies.map((movie, index) => (
        <div key={index} style={{ position: 'relative'  }}>
          <Card sx={{ maxWidth: 250, height: 450 ,mx: 2 , border:'none',margin: '0 auto' ,cursor: 'pointer' 
          }}
            onClick={() => navigate(`/movieDetail/${movie.movieId}${movie.movieSeq}`)}>

            <img src={posterUrls[index]} alt={movie.title} style={{ width: '100%', height: '350px' , borderRadius:'3px 3px 3px 3px' }} />
            
            <CardContent style={{ border:'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          
              <Typography variant="subtitle2" sx={{fontSize:15}}>{movie.title.length > 18 ? `${movie.title.slice(0, 18)}...` : movie.title}</Typography>
              <Grid container justifyContent="flex-start" style={{marginTop:'5px'}}>
                <Typography variant="body2">{movie.prodYear} · {movie.nation}</Typography>
              </Grid>
          
              <Typography variant="caption" style={{marginTop:'5px'}}> {movie.directorNms}
              </Typography>
            </CardContent>
          
          </Card>
        </div>
      ))}
    </Slider>
  </div>
  );
};

export default MainTopSection;
