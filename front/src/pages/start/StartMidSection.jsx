import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '../../utils/typography';
import MovieIcon from '@mui/icons-material/Movie';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
};

function StartMidSection() {
  return (
    <Box
      component="section"
      sx={{ display: 'flex', overflow: 'hidden', bgcolor: 'science.light' }}
    >
      <Container sx={{ mt: 15, mb: 30, display: 'flex', position: 'relative' }}>
        <Box
          component="img"
          src="/images/curvyLines.png"
          alt="curvy lines"
          sx={{ pointerEvents: 'none', position: 'absolute', top: -180 }}
        />
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                alt="film"
                sx={{ height: 55 }}
              />
              <MovieIcon sx={{fontSize: 50}}/>
              <Typography variant="h6"  sx={{ my: 5 }}>
                The Best SF Movies
              </Typography>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                최고의 평가를 받은 SF 영화들을 알고 싶나요?
              </Typography>
              <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                Want to know the best rated SF movies?
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                alt="search"
                sx={{ height: 55 }}
              />
                <TravelExploreIcon sx={{fontSize : 50}}/>
              <Typography variant="h6" sx={{ my: 5 }}>
                New experiences
              </Typography>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                숨겨진 명작 영화들을 찾아볼 수 있습니다.
              </Typography>
              <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                You can find hidden masterpieces.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                alt="clock"
                sx={{ height: 55 }}
              />
              <HourglassTopIcon sx={{fontSize : 50}}/>
              <Typography variant="h6" sx={{ my: 5 }}>
                An anticipated release
              </Typography>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                아직 공개되지 않은 기대작들도 기다리고 있습니다.
              </Typography>
              <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                There are also anticipated works that have not been released yet.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default StartMidSection;
