// src/components/Footer.jsx
import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Link, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';

const Footer = () => {
    return (
        <>
            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    color: '#000',
                    py: 4,
                    px: 2,
                    textAlign: 'center',
                    position: 'relative',
                    bottom: 0,
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={4}>
                            <Box sx={{ mb: 2 }}>
                                <img src="" alt="Logo" style={{ maxWidth: '150px' }} />
                            </Box>
                            <Typography variant="h5" sx={{ color: '#ccc' }}>
                                HMS | Health Management System
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={3} p={2}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#ccc', textAlign: 'left' }}>
                                Quick Links 
                            </Typography>
                            <Box component={Container} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                                <Link href="/home" color="inherit" sx={{ textDecoration: 'none', fontWeight: 'bold', ":hover": { textDecoration: 'underline', color: '#ff6f61' } }}>
                                    Home
                                </Link>
                                <Link href="/about-us" color="inherit" sx={{ textDecoration: 'none', fontWeight: 'bold', ":hover": { textDecoration: 'underline', color: '#ff6f61' } }}>
                                    About Us
                                </Link>
                                <Link href="/gallery" color="inherit" sx={{ textDecoration: 'none', fontWeight: 'bold', ":hover": { textDecoration: 'underline', color: '#ff6f61' } }}>
                                    Gallery
                                </Link>
                                <Link href="/book-appointments" color="inherit" sx={{ textDecoration: 'none', fontWeight: 'bold', ":hover": { textDecoration: 'underline', color: '#ff6f61' } }}>
                                    Book Appointments
                                </Link>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3} p={2}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#ccc', textAlign: 'left' }}>
                                Contact Us
                            </Typography>
                            <Box component={Container} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                                <Link href="tel:+1234567890" color="inherit" sx={{ textDecoration: 'none', fontWeight: 'bold', ":hover": { textDecoration: 'underline', color: '#ff6f61' } }}>
                                    +1234567890
                                </Link>
                                <Link href="mailto:6yUeh@example.com" color="inherit" sx={{ textDecoration: 'none', fontWeight: 'bold', ":hover": { textDecoration: 'underline', color: '#ff6f61' } }}>
                                    6yUeh@example.com
                                </Link>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#ccc' }}>
                                Follow Us
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <IconButton
                                    component="a"
                                    href="https://www.facebook.com"
                                    target="_blank"
                                    sx={{ color: '#3b5998' }}
                                    aria-label="Facebook"
                                >
                                    <Facebook />
                                </IconButton>
                                <IconButton
                                    component="a"
                                    href="https://www.twitter.com"
                                    target="_blank"
                                    sx={{ color: '#00acee' }}
                                    aria-label="Twitter"
                                >
                                    <Twitter />
                                </IconButton>
                                <IconButton
                                    component="a"
                                    href="https://www.instagram.com"
                                    target="_blank"
                                    sx={{ color: '#e1306c' }}
                                    aria-label="Instagram"
                                >
                                    <Instagram />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>

            </Box>
            <Divider sx={{ my: 0, borderColor: '#ccc' }} />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    bottom: 0,
                    backgroundColor: 'rgba(0, 51, 102, 0.9)',
                    color: '#ccc',
                    py: 2,
                }}
            >
                <Typography variant="body2">
                    &copy; {new Date().getFullYear()} Health Management System. All rights reserved.
                </Typography>
            </Box>
        </>
    );
};

export default Footer;
