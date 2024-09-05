import React from 'react';
import { Box, Container, Typography, List, ListItem, ListItemAvatar, ListItemText, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Phone, Email, LocationOn, Facebook, Twitter, Instagram } from '@mui/icons-material';

const TopHeader = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.paper,
                py: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                width: '100%',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: isMobile ? 'center' : 'left',
                    px: 2,
                    width: '100%',
                }}
            >
                {/* Logo and Hospital Name */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: theme.palette.primary.main,
                        mb: isMobile ? 1 : 0,
                        flex:3,
                        justifyContent: isMobile ? 'center' : 'flex-start',
                    }}
                >
                    <img
                        // src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        src='/healthcare.png'
                        alt="Logo"
                        style={{ width: '40px', height: '40px', marginRight: '10px' }}
                    />
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '1.2rem', sm: '1.5rem' },
                            textAlign: isMobile ? 'center' : 'left',
                            color: theme.palette.text.primary,
                        }}
                    >
                        HMS | Health Management System
                    </Typography>
                </Box>

                {/* Contact Information */}
                <Box
                    sx={{
                        display:isMobile || isTablet ? 'none' : 'flex',
                        gap: 2,
                        alignItems: 'center',
                        flex: 2,
                        justifyContent: isMobile ? 'center' : 'flex-start',
                    }}
                >
                    <List sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: 2,
                        p: 0,
                        mb: isMobile ? 1 : 0,
                        alignItems: 'center',
                        '& .contact-item': {
                            position: 'relative',
                            '&:hover .contact-info': {
                                opacity: 1,
                                visibility: 'visible',
                            },
                            '&:hover .contact-icon': {
                                opacity: 0,
                            },
                        },
                    }}>
                        {[
                            { icon: <LocationOn />, primary: 'Cairo, Egypt', secondary: 'El Manial, Cairo, Egypt' },
                            { icon: <Phone />, primary: '(202) 25318585', secondary: '24/7 Support' },
                            { icon: <Email />, primary: 'info@elnadahospital.com', secondary: 'Email Us' },
                        ].map((item, index) => (
                            <ListItem key={index} sx={{ p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="contact-item">
                                <ListItemAvatar>
                                    <Box
                                        sx={{
                                            transition: 'opacity 0.3s',
                                            color: theme.palette.primary.main,
                                            fontSize: '2rem',
                                        }}
                                        className="contact-icon"
                                    >
                                        {item.icon}
                                    </Box>
                                </ListItemAvatar>
                                <Box
                                    className="contact-info"
                                    sx={{
                                        opacity: 0,
                                        visibility: 'hidden',
                                        transition: 'opacity 0.3s, visibility 0.3s',
                                        textAlign: 'center',
                                        position: 'absolute',
                                        top: '100%',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        backgroundColor: theme.palette.background.default,
                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                                        p: 1,
                                        borderRadius: '8px',
                                        width: '200px',
                                        zIndex: 1,
                                    }}
                                >
                                    <Typography variant="body2" fontWeight="bold">{item.primary}</Typography>
                                    <Typography variant="body2">{item.secondary}</Typography>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* Social Media Links */}
                <Box sx={{
                    display:isMobile ? 'none' : 'flex',
                    gap: 1,
                    mt: isMobile ? 1 : 0,
                    flex: 1,
                    justifyContent: isMobile ? 'center' : 'flex-end',
                }}>
                    {[
                        { href: 'https://www.facebook.com', icon: <Facebook />, color: '#3b5998' },
                        { href: 'https://www.twitter.com', icon: <Twitter />, color: '#00acee' },
                        { href: 'https://www.instagram.com', icon: <Instagram />, color: '#e1306c' },
                    ].map((social, index) => (
                        <IconButton
                            key={index}
                            component="a"
                            href={social.href}
                            target="_blank"
                            sx={{ color: social.color, '&:hover': { color: theme.palette.primary.dark } }}
                            aria-label={social.href}
                        >
                            {social.icon}
                        </IconButton>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default TopHeader;
