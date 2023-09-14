import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Container from '@mui/material/Container';
import Typography from '../../utils/typography';
import { useNavigate } from 'react-router';

const ImageBackdrop = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  background: '#000',
  opacity: 0.5,
  transition: theme.transitions.create('opacity'),
}));

const ImageIconButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  display: 'block',
  padding: 0,
  borderRadius: 0,
  height: '40vh',
  [theme.breakpoints.down('md')]: {
    width: '100% !important',
    height: 100,
  },
  '&:hover': {
    zIndex: 1,
  },
  '&:hover .imageBackdrop': {
    opacity: 0.15,
  },
  '&:hover .imageMarked': {
    opacity: 0,
  },
  '&:hover .imageTitle': {
    border: '4px solid currentColor',
  },
  '& .imageTitle': {
    position: 'relative',
    padding: `${theme.spacing(2)} ${theme.spacing(4)} 14px`,
  },
  '& .imageMarked': {
    height: 3,
    width: 18,
    background: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
}));

const images = [
  {
    url: '/images/category/gravity.jpg',
    title: 'Space',
    width: '40%',
  },
  {
    url: '/images/category/alien.jpg',
    title: 'Aliens',
    width: '20%',
  },
  {
    url: '/images/category/godzilla.jpg',
    title: 'Monsters',
    width: '40%',
  },
  {
    url: '/images/category/pacificrim.jpg',
    title: 'Robot',
    width: '35%',
  },
  {
    url: '/images/category/walle.jpg',
    title: 'Animation',
    width: '30%',
  },
  {
    url: '/images/category/madmax.jpg',
    title: 'Blockbuster',
    width: '35%',
  },
  {
    url: '/images/category/arrival.jpg',
    title: 'Novel Original',
    width: '34.5%',
  },
  {
    url: '/images/category/watchmen.jpg',
    title: 'Psychic Power',
    width: '31%',
  },
  {
    url: '/images/category/btf.jpg',
    title: 'Masterpiece',
    width: '34.5%',
  },
];


export default function StartCategorySection() {
const navigate = new useNavigate()
const handleImageLink = () => {
  navigate('./main')
}
  return (
    <Container component="section" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h4" marked="center" align="center" component="h2">
      Find it in the detail category
      </Typography>
      <Box sx={{ mt: 8, display: 'flex', flexWrap: 'wrap' }}>
        {images.map((image) => (
          <ImageIconButton
            key={image.title}
            style={{
              width: image.width,
            }}
            onClick={handleImageLink}
          >
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundSize: 'cover',
                backgroundPosition: 'center 40%',
                backgroundImage: `url(${image.url})`,
              }}
            />
            <ImageBackdrop className="imageBackdrop" />
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'common.white',
              }}
            >
              <Typography
                component="h3"
                variant="h6"
                color="inherit"
                className="imageTitle"
              >
                {image.title}
                <div className="imageMarked" />
              </Typography>
            </Box>
          </ImageIconButton>
        ))}
      </Box>
    </Container>
  );
}