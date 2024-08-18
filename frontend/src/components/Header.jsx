import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Drawer, AppBar, Box, Container, IconButton, MenuItem, Toolbar, Button, Avatar, Tooltip, useTheme, useMediaQuery, Divider, Menu, Typography } from '@mui/material';
import { Menu as MenuIcon, LocalHospital, Settings, Logout, Login, AccountCircle, AdminPanelSettings, PersonAdd } from '@mui/icons-material';

const Header = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [isHeaderFixed, setIsHeaderFixed] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);
    const toggleDrawer = () => setDrawerOpen(!drawerOpen);

    const handleClickMenu = (path) => {
        navigate(path);
        handleCloseUserMenu();
    };

    const handleLogOut = () => {
        handleLogout();
        handleCloseUserMenu();
        setDrawerOpen(false);
        navigate('/login');
    };

    const handleImageView = () => {
        if (user?.googleId || user?.facebookId) {
            if (user?.image.includes('https://')) {
                return user.image;
            } else {
                return `http://localhost:5000/uploads/${user.image}`;
            }
        } else if (user?.image) {
            return `http://localhost:5000/uploads/${user.image}`;
        } else {
            return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsHeaderFixed(true);
            } else {
                setIsHeaderFixed(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {/* Fixed Header */}
            <AppBar position={isHeaderFixed ? 'fixed' : 'static'} color="default" elevation={0} sx={{
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                top: 0,
                width: '100%',
                zIndex: (theme) => theme.zIndex.drawer + 3,
            }}>
                <Container maxWidth="lg">
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        {/* Mobile View */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="menu"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={toggleDrawer}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Drawer
                                anchor="left"
                                open={drawerOpen}
                                onClose={toggleDrawer}
                            >
                                <Toolbar sx={{ justifyContent: 'flex-end' }}>
                                    <IconButton onClick={toggleDrawer}>
                                        <MenuIcon />
                                    </IconButton>
                                </Toolbar>
                                <Box
                                    role="presentation"
                                    sx={{ p: 2 }}
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="flex-start"
                                    onClick={toggleDrawer}
                                    onKeyDown={toggleDrawer}
                                >
                                    <Button component={Link} to="/" color="inherit">Home</Button>
                                    <Button component={Link} to="/about" color="inherit">About Us</Button>
                                    <Button component={Link} to="/departments" color="inherit">Departments</Button>
                                    <Button component={Link} to="/facilities" color="inherit">Facilities</Button>
                                    <Button component={Link} to="/appointments" color="inherit">Appointments</Button>
                                    <Button component={Link} to="/contact" color="inherit">Contact</Button>
                                </Box>
                            </Drawer>
                        </Box>
                        {/* Desktop View */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Button component={Link} to="/" color="inherit">Home</Button>
                            <Button component={Link} to="/about" color="inherit">About Us</Button>
                            <Button component={Link} to="/departments" color="inherit">Departments</Button>
                            <Button component={Link} to="/facilities" color="inherit">Facilities</Button>
                            <Button component={Link} to="/appointments" color="inherit">Appointments</Button>
                            <Button component={Link} to="/contact" color="inherit">Contact</Button>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} />
                        {/* User Profile */}
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="User Avatar"
                                        src={handleImageView()}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                id="menu-appbar"
                                sx={{ mt: '45px' }}
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {user ?
                                    <div>
                                        <MenuItem key="profile" onClick={() => handleClickMenu('/profile')}>
                                            <AccountCircle />
                                            <Typography textAlign="center">
                                                Profile
                                            </Typography>
                                        </MenuItem>
                                        <Divider />
                                        {user.role === 'admin' &&
                                            <MenuItem key="admin" onClick={() => handleClickMenu('/admin')}>
                                                <AdminPanelSettings />
                                                <Typography textAlign="center">
                                                    Admin
                                                </Typography>
                                            </MenuItem>

                                        }
                                        {user.role === 'staff' || user.role === 'admin' &&
                                            <MenuItem key="staff" onClick={() => handleClickMenu('/staff')}>
                                                <AdminPanelSettings />
                                                <Typography textAlign="center">
                                                    Staff
                                                </Typography>
                                            </MenuItem>
                                        }
                                        <Divider />
                                        <MenuItem key="logout" onClick={handleLogOut}>
                                            <Logout />
                                            <Typography textAlign="center">
                                                Logout
                                            </Typography>
                                        </MenuItem>
                                    </div>
                                    :
                                    <div>
                                        <MenuItem key="login" onClick={() => handleClickMenu('/auth/login')}>
                                            <Login />
                                            <Typography textAlign="center">
                                                Login
                                            </Typography>
                                        </MenuItem>
                                        <MenuItem key="register" onClick={() => handleClickMenu('/auth/register')}>
                                            <PersonAdd />
                                            <Typography textAlign="center">
                                                Register
                                            </Typography>
                                        </MenuItem>
                                    </div>
                                }
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {/* Toolbar */}
            <Toolbar />
        </>
    );
};

export default Header;
