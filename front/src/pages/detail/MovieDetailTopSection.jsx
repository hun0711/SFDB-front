import React from 'react';

const MovieDetailTopSection = ({ imageUrl, movieDetail }) => {
  
  const formatRuntime = (runtime) => {
    const hours = Math.floor(runtime / 60); // 시간
    const minutes = runtime % 60; // 분
    return `${hours}시간 ${minutes}분`;
  };
  

  /*  Style  */
  const topSectionStyle = {
    width: '1525px',
    height: '500px', // 고정된 높이
    overflow: 'hidden',
    position: 'relative',
  };

  const imageStyle = {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center 35%'
  };

  const overlayStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%', // 높이 조정
    padding: '20px',
    background: 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9))',
    color: 'white',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column', // 수직으로 정렬
    justifyContent: 'space-between', // 상하 공간 분배
  };

  const infoStyle = {
    display: 'flex',
    flexDirection: 'column', // 수직으로 정렬
    marginLeft: '40px', 
  };

  const titleStyle = {
    marginTop:'90px',
    marginBottom: '5px', // 간격 조절
    marginLeft: '75px', 
    fontSize: '40px',
  };

  const titleOrgStyle = {
    fontSize: '12px',
    marginLeft: '80px', 
  };
  
  const yearNationStyle = {
    fontSize: '15px',
    marginTop: '12px',
    marginLeft: '40px'
  };

  const etcInfoStyle = {
    fontSize: '15px',
    marginTop: '10px',
    marginLeft: '40px'
  }

  return (
    <div style={topSectionStyle}>
      <img src={imageUrl} alt="Movie Stills" style={imageStyle} />
      <div style={overlayStyle}>
        <div>
          <h1 style={titleStyle}>{movieDetail.title}</h1>
          <span style={titleOrgStyle}>{movieDetail.titleOrg}</span>
          <div style={infoStyle}>
            <span style={yearNationStyle}>{movieDetail.prodYear}  ·  {movieDetail.nation}</span>
            <span style={etcInfoStyle}> {formatRuntime(parseInt(movieDetail.runtime))} · {movieDetail.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailTopSection;
