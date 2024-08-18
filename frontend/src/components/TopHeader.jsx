import React from 'react';
import { Box, Container, Typography, List, ListItem, ListItemAvatar, ListItemText, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Phone, Email, LocationOn, Facebook, Twitter, Instagram } from '@mui/icons-material';

const TopHeader = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                backgroundColor: '#f5f5f5',
                py: 1,
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: { xs: 'none', sm: 'flex' },
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: { xs: 'center', sm: 'left' },
                    px: 2
                }}
            >
                {/* Logo and Hospital Name */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'primary.main',
                        mb: { xs: 1, sm: 0 }
                    }}
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="Logo"
                        style={{ width: '40px', height: '40px' }}
                    />
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '1.2rem', sm: '1.5rem' },
                        }}
                    >
                        Elnada Hospital
                    </Typography>
                </Box>

                {/* Contact Information */}
                <List sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, p: 0, mb: { xs: 1, sm: 0 } }}>
                    <ListItem sx={{ p: 0 }}>
                        <ListItemAvatar>
                            <LocationOn sx={{ color: 'primary.main' }} />
                        </ListItemAvatar>
                        <ListItemText
                            primary=" Cairo, Egypt"
                            secondary="El Manial, Cairo, Egypt"
                        />
                    </ListItem>
                    <ListItem sx={{ p: 0 }}>
                        <ListItemAvatar>
                            <Phone sx={{ color: 'primary.main' }} />
                        </ListItemAvatar>
                        <ListItemText
                            primary="(202) 25318585"
                            secondary="24/7 Support"
                        />
                    </ListItem>
                    <ListItem sx={{ p: 0 }}>
                        <ListItemAvatar>
                            <Email sx={{ color: 'primary.main' }} />
                        </ListItemAvatar>
                        <ListItemText
                            primary="info@elnadahospital.com"
                            secondary="Email Us"
                        />
                    </ListItem>
                </List>

                {/* Social Media Links */}
                <Box sx={{ display: 'flex', gap: 1, mt: { xs: 1, sm: 0 } }}>
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
            </Container>
        </Box>
    );
};

export default TopHeader;
