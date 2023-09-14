import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
import { IconButton } from '@mui/material';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {' Copyright © '}
        SFDB
     {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Footer() {
  const handleGitHubClick = () => {
    window.open('https://github.com/hun0711/SF-DB/tree/main', '_blank');
  };
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconButton onClick={handleGitHubClick}>
            <GitHubIcon style={{fontSize:'45px'}}/>
          </IconButton>
        </Box>
        <Copyright />
      </Container>
    </Box>
  );
}
