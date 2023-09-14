import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '../../utils/typography';
import { Button } from '@mui/material';

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
};

const number = {
  fontSize: 35,
  fontFamily: 'default',
  color: 'science.main',
  fontWeight: 'medium',
};

function StartBottomSection() {
  return (
    <Box
      component="section"
      sx={{ display: 'flex', bgcolor: 'science.light', overflow: 'hidden' }}
    >
      <Container
        sx={{
          mt: 10,
          mb: 15,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src="/images/curvyLines.png"
          alt="curvy lines"
          sx={{
            pointerEvents: 'none',
            position: 'absolute',
            top: -180,
            opacity: 0.7,
          }}
        />
        <Typography variant="h4" marked="center" component="h2" sx={{ mb: 14 }}>
          How to use it
        </Typography>
        <div>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}>1.</Box>
                <div style={{marginTop:'30px'}}>
                  <Typography variant="h6" align="center">
                    원하는 작품들을 둘러보세요.
                  </Typography>
                  <Typography variant="h5" align="center" sx={{ my: 2 }}>
                    Look around for the movies you want.
                  </Typography>
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}>2.</Box>
                <div style={{marginTop:'30px'}}>
                  <Typography variant="h6" align="center">
                    관심 있는 컨텐츠를 저장하거나 평가하고 싶다면 가입해주세요.
                  </Typography>
                  <Typography variant="h5" align="center" sx={{ my: 2 }}>
                    If you want to save or evaluate the content you are interested in, please sign up.
                  </Typography>
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}>3.</Box>
            
                <div style={{marginTop:'30px'}}>
                  <Typography variant="h6" align="center">
                    회원이 된 후, 기대작의 소식을 받아볼 수 있습니다.
                  </Typography>
                  <Typography variant="h5" align="center" sx={{ my: 2 }}>
                    After becoming a member, you can receive news of the expected work.
                  </Typography>
                </div>
              </Box>
            </Grid>
          </Grid>
        </div>
        <Button
          color="science"
          size="large"
          variant="contained"
          component="a"
          href="/register"
          sx={{ mt: 8, color: 'white' }}
        >
          Get started
        </Button>
      </Container>
    </Box>
  );
}

export default StartBottomSection;
