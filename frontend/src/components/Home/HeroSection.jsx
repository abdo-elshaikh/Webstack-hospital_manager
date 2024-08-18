import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { Carousel, Image } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const HeroSection = () => {
    const { user } = useAuth();
    const theme = useTheme();

    const heroImages = [
        {
            src: 'https://picsum.photos/2000/800',
            alt: 'First slide',
            title: 'First slide label',
            text: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
        },
        {
            src: 'https://picsum.photos/2000/800',
            alt: 'Second slide',
            title: 'Second slide label',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        {
            src: 'https://picsum.photos/2000/800',
            alt: 'Third slide',
            title: 'Third slide label',
            text: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.',
        },
        {
            src: 'https://picsum.photos/2000/800',
            alt: 'Fourth slide',
            title: 'Fourth slide label',
            text: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.',
        },
    ];

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Carousel indicators={false}>
                {heroImages.map((item, index) => (
                    <Carousel.Item key={index}>
                        <Image
                            src={item.src}
                            alt={item.alt}
                            className="d-block w-100 "
                            style={{ height: '80vh', objectFit: 'cover' }}
                        />
                        <Carousel.Caption
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                            }}
                        >
                            <Container>
                                <Typography
                                    variant="h1"
                                    style={{
                                        fontSize: '3rem',
                                        fontWeight: 'bold',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    {item.title}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    style={{
                                        fontSize: '1.5rem',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    {item.text}
                                </Typography>
                                {user ? (
                                    <Link
                                        to="/appointments"
                                        style={{
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{
                                                fontSize: '1.5rem',
                                                padding: '1rem 2rem',
                                            }}
                                        >
                                            Book Appointment
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link
                                        to="/login"
                                        style={{
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            style={{
                                                fontSize: '1.5rem',
                                                padding: '1rem 2rem',
                                            }}
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                )}
                            </Container>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </Box>
    );
};

export default HeroSection;
