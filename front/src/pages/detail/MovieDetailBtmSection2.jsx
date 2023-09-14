import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getYouTubeVideoByQuery } from '../../utils/youtubeApi'; 
import config from '../../config';
import { getGoogleImageApi } from '../../utils/googleImageApi';

const MovieDetailBtmSection2 = ({ movieDetail }) => {
  const title = movieDetail.title
  const titleOrg = movieDetail.titleOrg
  const prodYear = movieDetail.prodYear
  const [trailerId, setTrailerId] = useState(null);
  const [imageUrls, setImageUrls] = useState([])

  
  
  useEffect(() => {
    const searchMovieStills = async () => {
      try{
        const query = titleOrg + prodYear + ' stills'
        const imageResults = await getGoogleImageApi(query)
        console.log(imageResults);
        setImageUrls(imageResults.map((result) => result.link))
      }catch(error){
        console.log("영화 스틸컷 검색 실패 : ", error);
      }
    }
    if (title !== undefined && prodYear !== undefined) {
      searchMovieStills()
    }
  },[title, prodYear]);


  useEffect(() => {
    const searchMovieTrailer = async () => {
      try {
        const query = '영화 ' + titleOrg + prodYear + ' 예고편';
        const searchResults = await getYouTubeVideoByQuery(query)
        if(searchResults && searchResults.items && searchResults.items.length > 0) {
          const topVideo = searchResults.items[0];
          setTrailerId(topVideo.id.videoId)
        }
      } catch (error) {
        console.log('영화 예고편 검색 실패 : ', error);
      } 
    }
    if (title !== undefined && prodYear !== undefined) {
      searchMovieTrailer()
    }
  },[title, prodYear]);

  //Youtube 동영상 뷰어
    const openYoutubePlayer = () => {
      if (trailerId) {
        window.open(`https://www.youtube.com/embed/${trailerId}`, '_blank');
      }
    };
    
  {/* Style */}
  const btmSection2Style = {
    marginLeft: '100px',
    marginTop: '30px',
    marginBottom : '100px',
    maxWidth: '1500px',
    minHeight: '800px',
    maxHeight: '1000px',
  } 
  
  const stillSectionStyle = {
    marginTop: '30px',
    marginLeft: '20px',
    maxWidth: '1500px',
    maxHeight: '500px'
  }

  const stillStyle = {
    width: '100%', 
    objectFit: 'cover',
    minWidth: '400px',
    maxWidth: '400px',
    height:'250px',
    minHeight: '250px',
    maxHeight: '250px',
    marginRight: '40px',
    borderRadius : '5px'
  }

  const videoStyle = {
    marginTop: '30px',
    marginLeft: '20px',
    width: '500px',
    minWidth: '300px',
    maxWidth: '400px',
    height: '350px',
    minHeight: '350px',
    maxHeight: '500px'
  } 
  return (
    <> 
    <div style={btmSection2Style}>
      {/* 갤러리 div */}
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" style={{ fontSize: '25px' }}>
          갤러리
        </Typography>
        </div>  
        <div style={stillSectionStyle}>
        <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
        {imageUrls.map((imageUrl, index) => (
          <img
          key={index}
          src={imageUrl}
          alt={`Image ${index + 1}`}
          style={stillStyle}
          />
          ))}
          </div>
          </div>

{/* 동영상 div */}
    <div style={{ display: 'flex', alignItems: 'center' , marginTop:'120px'}}>
        <Typography variant="h4" style={{ fontSize: '25px' }}>
          동영상 
        </Typography>
        </div>
    
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

    </div>
    </>
  )
}

export default MovieDetailBtmSection2