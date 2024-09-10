import React from 'react';
import { Box, Container, Typography, List, ListItem, ListItemAvatar, ListItemText, IconButton, useTheme, useMediaQuery, Tooltip, MenuItem, Avatar } from '@mui/material';
import { Phone, Email, LocationOn, Facebook, Twitter, Instagram } from '@mui/icons-material';

const TopHeader = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    return (

        <Container
            maxWidth="xl"
            sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: isMobile ? 'center' : 'left',
                px: 2,
                py: 1,

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
                    flex: 3,
                    justifyContent: isMobile ? 'center' : 'flex-start',
                }}
            >
                <img
                    src='/healthcare.png'
                    alt="Logo"
                    style={{ width: '40px', height: '40px', marginRight: '10px' }}
                />
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        fontWeight: 'semibold',
                        fontSize: { xs: '1.2rem', sm: '1.5rem' },
                        textAlign: isMobile ? 'center' : 'left',
                        color: '#FFBFAB',
                    }}
                >
                    <span style={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '2rem' }}>HMS</span>
                    <span style={{ color: '#E6455A', fontFamily: 'cursive', fontWeight: 'bold', fontSize: '2rem' }}>|</span>
                    Health Management System
                </Typography>
            </Box>

            {/* Contact Information */}
            <Box
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    gap: 1,
                    flex: 2,
                    justifyContent: 'flex-end',
                }}
            >
                <List sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-start' }}>
                    <ListItem >
                        <ListItemAvatar>
                            <Avatar>
                                <LocationOn color="primary" />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary="Address"
                            secondary="123 Main Street, Anytown, USA"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <Phone color="primary" />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary="Phone"
                            secondary="123-456-7890"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <Email color="primary" />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary="Email"
                            secondary="X5wUy@example.com"
                        />
                    </ListItem>
                </List>
            </Box>

            {/* Social Media Links */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
                <Tooltip style={{ color: theme.palette.primary.main }} title="facebook link">
                    <IconButton sx={{ color: theme.palette.primary.main, '&:hover': { scale: 1.2 } }} onClick={() => window.open('https://www.facebook.com/', '_blank')}>
                        <Facebook color="primary" />
                    </IconButton>
                </Tooltip>
                <Tooltip style={{ color: theme.palette.primary.main }} title="twitter link">
                    <IconButton sx={{ color: theme.palette.primary.main, '&:hover': { scale: 1.2 } }} onClick={() => window.open('https://www.twitter.com/', '_blank')}>
                        <Twitter color="primary" />
                    </IconButton>
                </Tooltip>
                <Tooltip style={{ color: theme.palette.primary.main }} title="instagram link">
                    <IconButton sx={{ color: theme.palette.primary.main, '&:hover': { scale: 1.2 } }} onClick={() => window.open('https://www.instagram.com/', '_blank')}>
                        <Instagram color="error" />
                    </IconButton>
                </Tooltip>
                <Tooltip style={{ color: theme.palette.primary.main }} title="location link">
                    <IconButton sx={{ color: theme.palette.primary.main, '&:hover': { scale: 1.2 } }} onClick={() => window.open('https://www.google.com/maps/', '_blank')}>
                        <LocationOn color="success" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Container>
    );
};

export default TopHeader;
