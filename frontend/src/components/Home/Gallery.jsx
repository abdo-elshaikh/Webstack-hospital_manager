import React from "react";
import Slider from "react-slick";
import { Box, Typography, Paper, Divider } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../styles/home.css';


const images = [
    '/images/slider1.jpg',
    '/images/slider2.jpg',
    '/images/slider3.jpg',
    '/images/slider1.jpg',
    '/images/slider2.jpg',
    '/images/slider3.jpg',
];

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                initialSlide: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};

const Gallery = () => {
    return (
        <Box id="gallery" sx={{ backgroundColor: '#f5f5f5' }}>
            <Box sx={{ maxWidth: '80%', margin: '0 auto', padding: '40px 0', textAlign: 'center' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Our Gallery
                </Typography>
                <Typography variant="body1" align="center" gutterBottom>
                    Show case our gallery of images here and enjoy
                </Typography>
                <Divider sx={{ margin: '20px 0' }} />
                <Slider {...settings}>
                    {images.map((img, index) => (
                        <Box key={index} sx={{ px: 2 }}>
                            <Paper elevation={3} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                                <img
                                    src={img}
                                    alt={`Gallery image ${index + 1}`}
                                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                                />
                            </Paper>
                        </Box>
                    ))}
                </Slider>
            </Box>
        </Box>
    );
};

export default Gallery;
