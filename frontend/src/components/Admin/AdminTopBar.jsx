import { AppBar, Toolbar, IconButton, Typography, Button, Avatar, Menu, MenuItem, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon, Notifications, Message} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminTopBar = ({ user, handleLogout, open, setOpen }) => {
    const ServerURL = 'http://localhost:5000';
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        navigate('/admin/profile');
        handleMenuClose();
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#6A9C89' }}>
            <Toolbar>
                <IconButton onClick={() => setOpen(!open)} edge="start" color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Admin Dashboard
                </Typography>
                <IconButton color="inherit">
                    <Message />
                </IconButton>
                <IconButton color="inherit">
                    <Notifications />
                </IconButton>
                <Button color="inherit" onClick={handleMenuClick}>
                    <Avatar alt={user?.name} src={user?.image ? ServerURL + '/uploads/' + user?.image : '/avatar.svg'} />
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleProfile}>Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default AdminTopBar;
