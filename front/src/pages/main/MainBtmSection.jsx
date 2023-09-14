import React, { useEffect, useState } from 'react'
import { todayBoxofficeDB } from '../../axios/main/movieLogic'
import { Card, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info';
import Slider from 'react-slick'
import { useNavigate } from 'react-router';

const MainBtmSection = () => {
  const [todayBoxofficeRank , setTodayBoxofficeRank] = useState([])
  const navigate = new useNavigate()

  useEffect(() => {
      const getTodayBoxofficeRank = async() => {
        try {
          const res = await todayBoxofficeDB()
          setTodayBoxofficeRank(res)  
        } catch (error) {
        console.log('박스오피스 정보 로드 실패 : ' , error);
      }
    }
    
    getTodayBoxofficeRank()
  },[])
  
  const settings = {
    dots: true,
    arrows : true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5
  };

  //박스오피스 기준 날짜 변환
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;
  const boxofficeInfo = formattedYesterday + ' 기준 박스오피스 순위입니다.';


  //관객수 표기
  const formatAudience = (audience) => {
    if (audience >= 10000) {
      const tenThousand = Math.floor(audience / 10000);
        return `${tenThousand}만 명`;
    } else {
      return audience.toLocaleString() + ' 명';
    }
  };
  

  return (
 <> 
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' , marginRight:'1220px' }}>
        <Typography variant="h6" sx={{ fontSize: 25 }}>박스오피스 순위</Typography>
        <Tooltip title={boxofficeInfo} placement="right">
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </div>
    <Slider {...settings}>
      {todayBoxofficeRank.map((movie, index) => (
        <div key={index} style={{ position: 'relative' }}>
          <Card sx={{ maxWidth: 250, height: 450 ,mx: 2 , border:'none' , margin: '0 auto'}}
          onClick={() => navigate(`/boxofficeDetail/${movie.movieId}${movie.movieSeq}`)}>
            <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: '350px' , borderRadius:'3px 3px 3px 3px' }} />
            <CardContent style={{ border:'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <Typography variant="subtitle2" sx={{fontSize:15}}>{movie.title.length > 15 ? `${movie.title.slice(0, 15)}...` : movie.title}</Typography>
              <Grid container justifyContent="flex-start" style={{marginTop:'5px'}}>
  <Typography variant="body2">{movie.prodYear} · {movie.nation}</Typography>
</Grid>
<Typography variant="caption" style={{marginTop:'5px'}}> 예매율 {movie.salesShare}% · 관객 {formatAudience(parseInt(movie.audiAcc))} </Typography>
            </CardContent>
          </Card>
        </div>
      ))}
    </Slider>
  </div>
    </>
  )
}

export default MainBtmSection