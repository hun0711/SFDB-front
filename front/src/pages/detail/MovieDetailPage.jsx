  import React, { useEffect, useState } from 'react'
  import { useLocation } from 'react-router';
  import { movieDetailDB, ottExistanceDB } from '../../axios/main/movieLogic';
  import { firebaseStorage } from '../../utils/firebase';
  import MovieDetailTopSection from './MovieDetailTopSection';
  import MovieDetailMidSection from './MovieDetailMidSection';
  import MovieDetailBtmSection from './MovieDetailBtmSection';
  import HeaderBar from '../../components/HeaderBar';
  import Footer from '../../components/Footer';
  import MovieDetailMidSection2 from './MovieDetailMidSection2';
import MovieDetailBtmSection2 from './MovieDetailBtmSection2';
import { MovieProvider } from '../../utils/movieDetailContext';




  const MovieDetailPage = () => {
    const location = useLocation();
    const movieInfo = location.pathname.split('/movieDetail/')[1];
    const [movieId, movieSeq] = movieInfo.match(/([A-Z])(\d+)/).slice(1);
    
    const [movieDetail , setMovieDetail] = useState([])
    const [imageUrl, setImageUrl] = useState(null);
    const [posterUrl, setPosterUrl] = useState(null)

    const [ottInfo , setOttInfo] = useState({}) 


    useEffect(() => {
    const getMovieDetail = async () => {
      try {
        const res = await movieDetailDB(movieId , movieSeq)
        setMovieDetail(res[0])
      } catch (error) {
        console.log("영화 상세정보 로드 실패 : " , error);
      }
    }
      getMovieDetail()
    },[])

            
          /* OTT */
          useEffect(()=> {
            const getOttExistance = async () => {
            try {
              const res = await ottExistanceDB(movieSeq)
              setOttInfo(res[0])
              console.log(ottInfo);
            } catch (error) {
              console.log("OTT 정보 로드 실패 : ", error);
            }
            }
          getOttExistance()
            },[])



            
    const getImageUrl = async () => {
      const storageRef = firebaseStorage.ref(`${movieId}${movieSeq}.jpg`);
      try {
        const url = await storageRef.getDownloadURL();
        return url;
      } catch (error) {
        console.log("이미지 URL 페칭 에러 : " , error);
        return null;
      }
    
    };

    const getPosterUrl = async () => {
      const storageRef = firebaseStorage.ref(`poster/${movieId}${movieSeq}.jpg`)
      try {
        const url = await storageRef.getDownloadURL();
        return url;
      } catch (error) {
        console.log("포스터 URL 페칭 에러 : " , error);
        return null;
      }
    }

    useEffect(() => {
      getImageUrl()
        .then((url) => {
          if (url) {
            setImageUrl(url);
            console.log('Image URL:', url);
          }
        });
        getPosterUrl()
        .then((url) => {
          if (url) {
            setPosterUrl(url);
            console.log('Poster URL:', url);
          }
        });

    }, []);





    return (
      <>
<MovieProvider>
  <HeaderBar/>

    {/* Top Section */}
      <div style={{marginTop:'70px' , marginLeft:'-10px'}}>
      <MovieDetailTopSection movieDetail={movieDetail} imageUrl={imageUrl} />
      </div>
    
    {/* Mid Section */}
    <div>
      <MovieDetailMidSection movieDetail={movieDetail} posterUrl={posterUrl} ottInfo={ottInfo}/>
    </div>
    <div>
      <MovieDetailMidSection2 movieDetail={movieDetail} />
    </div>
  
  {/* Btm Section */}
  <div style={{marginTop:'100px'}}>
      <MovieDetailBtmSection movieDetail={movieDetail}/>
    </div>
<div style={{marginTop:'100px'}}>
  <MovieDetailBtmSection2 movieDetail={movieDetail}/>
</div >

  <Footer/>
  </MovieProvider>
      </>
    )
  }

  export default MovieDetailPage