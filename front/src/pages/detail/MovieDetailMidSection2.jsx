import { Typography } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { firebaseStorage } from '../../utils/firebase';


const MovieDetailMidSection2 = ({ movieDetail }) => {
  const directors = movieDetail && movieDetail.directorNms ? movieDetail.directorNms.split(',') : [];
  const actors = movieDetail && movieDetail.actorNms ? movieDetail.actorNms.split(',') : [];
  const [directorImage, setDirectorImage] = useState([])
  const [actorImage, setActorImage] = useState([])

  useEffect(() => {
    const getDirectorImage = async () => {
      const images = await Promise.all(directors.map(async (director) => {
        const storageRef = firebaseStorage.ref(`director/${director}.jpg`);
        try {
          const image = await storageRef.getDownloadURL();
          return image;
        } catch (error) {
          console.log("감독 이미지 다운로드 에러 : " , error);
          return null;
        }
      }));
      setDirectorImage(images);
    };

    getDirectorImage();
  }, [movieDetail]);

  useEffect(() => {
    const getActorImage = async () => {
      const images = await Promise.all(actors.map(async (actor) => {
        const storageRef = firebaseStorage.ref(`actor/${actor}.jpg`);
        try {
          const image = await storageRef.getDownloadURL();
          return image;
        } catch (error) {
          console.log("배우 이미지 다운로드 에러 : " , error);
          return null;
        }
      }));
      setActorImage(images);
    };

    getActorImage();
  }, [movieDetail]);




  {/* Style */}
  const midSection2Style = {
    marginLeft: '100px',
    marginTop: '50px',
    maxWidth: '1500px',
    minHeight: '300px',
    maxHeight: '900px',
    display: 'flex',
    flexDirection: 'column', // 세로로 정렬
  };

  const staffRoleStyle = {
    marginTop: '50px',
    display: 'flex',
    flexDirection: 'row', 
    alignItems: 'center', 
  };



  const directorStyle = {
    width : '250px',
    maxWidth: '400px',
    display: 'flex',
    alignItems: 'center',
    marginRight: '80px'

  };

  const underlineStyle = {
    width : '1280px',
    borderBottom: '1px solid black',
    opacity: '10%',
    marginTop:'30px'
  };

  const actorSectionStyle = {
    maxWidth: '1800px',
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    flexWrap: 'wrap'
  }

  const actorStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '250px',
    marginRight: '80px',
    marginBottom:'40px'
  }

  return (
    <>
      <div style={midSection2Style}>
        <Typography variant="h4" style={{ fontSize: '25px' }}>
          출연 / 제작
        </Typography>
      
        <div style={staffRoleStyle}>
          {directors.map((director, index) => (
            <div key={index} style={directorStyle}>
               <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', marginRight: '10px' }}>
        <img src={directorImage[index] ? directorImage[index] : '/images/astronaut.jpg'} alt="감독" style={{ width: '100%', height: '100%', objectFit: 'cover' , marginRight: '10px',}} />
      </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' , marginLeft:'5px' , marginTop:'5px'}}>
                <Typography variant="subtitle2" style={{ fontSize: '14px' }}>
                  {director.trim()}
                </Typography>
                <div style={{ marginTop: '5px' }}>
                  <Typography variant="button" style={{ opacity: '60%', fontSize: '14px' }}>
                    감독
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
          <div style={underlineStyle}/>
     
     {/* 배우 정보 */}
 <div style={actorSectionStyle}>
  {actors.map((actor,index) => (
    <div key={index} style={actorStyle}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', marginRight: '10px' }}>
        <img src={actorImage[index] ? actorImage[index] : '/images/astronaut.jpg'} alt="배우" style={{ width: '100%', height: '100%', objectFit: 'cover' ,marginRight: '50px'}} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' , marginLeft:'5px',marginTop:'30px' }}>
       <Typography variant="subtitle2" style={{ fontSize: '14px' }}>
 {actor.trim()}
</Typography>
      </div>
  </div>
  ))}
  </div>

      </div>
    </>
  );
};

export default MovieDetailMidSection2;
