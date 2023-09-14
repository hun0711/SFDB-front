import * as React from "react";
import {  Box, Button } from "@mui/material";
import Typography from "../../utils/typography";
import StartTopSectionLayout from "./StartTopSectionLayout";
import SouthIcon from '@mui/icons-material/South';

const backgroundVideo = '/videos/sfdb.mp4'

  
export default function StartTopSection() {
  return (
    <StartTopSectionLayout
      sxBackground={{
        backgroundImage: `none`,
        backgroundColor: "#7fc7d9", 
        backgroundPosition: "center",
      }}
    >
   <video autoPlay loop muted style={{ width: "1500px", height: "650px", marginBottom:'145px' ,objectFit: "cover" , opacity:'60%' }}>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Typography
          color="white"
          align="center"
          variant="h2"
          marked="center"
          marginTop="50px"
          marginBottom="-50px"
        >
          온 우주의 SF 영화를 담다
        </Typography>
        <Typography
          color="science"
          align="center"
          variant="h5"
          sx={{ mb: 4, mt: { xs: 4, sm: 10 } }}
        >
          상상력을 자극하는 작품들이 기다리고 있습니다
        </Typography>
        <Button
          color="science"
          variant="contained"
          size="large"
          component="a"
          href="/main"
          sx={{ minWidth: 200 }}
        >
          둘러보기
        </Button>
      </div>
      <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
        Discover the experience
      </Typography>
      <Box sx={{marginTop:'30px'}}>
        <SouthIcon/>
        </Box>
    </StartTopSectionLayout>
  );
}