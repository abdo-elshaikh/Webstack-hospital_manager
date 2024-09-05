import React from 'react';
import useAuth from '../../contexts/useAuth';
import { Box, Container, Typography, Button, useTheme, useMediaQuery } from '@mui/material';

const HeroSection = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundImage: 'url("/images/slider2.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#fff',
                textAlign: 'center',
                marginTop: '0',
                p:0,
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    zIndex: 1,
                },
            }}
        >
            <Container
                maxWidth="xl"
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    color: '#fff',
                    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    py: 2,
                }}
            >
                <Typography
                    variant={isMobile ? 'h4' : 'h2'}
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        mb: 3,
                        lineHeight: 1.2,
                        letterSpacing: '0.05em',
                    }}
                >
                    Welcome to Health Management System
                </Typography>
                <Typography
                    variant="h6"
                    component="p"
                    sx={{ mb: 4, fontWeight: 300 }}
                >
                    Your health is our priority. Book appointments, view your medical history, and more with ease.
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        color="info"
                        size="large"
                        href="/auth/login"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 'bold',
                            px: 5,
                            borderColor: '#fff',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderColor: '#fff',
                            },
                        }}
                    >
                        Login
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default HeroSection;
