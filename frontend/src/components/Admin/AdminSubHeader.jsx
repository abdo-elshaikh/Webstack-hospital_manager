import React, { useState } from 'react';
import { Breadcrumbs, Link, Typography, Box, IconButton, Avatar, Badge, Tooltip, Input, Popover, List, ListItem, ListItemText, Button } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchIcon from '@mui/icons-material/Search';
import useAuth from '../../contexts/useAuth';
import { toast } from 'react-toastify';
import NotificationsPop from '../Notifications/NotificationsPop';

const AdminSubHeader = ({ title }) => {
    const { user } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications] = useState([
        { id: 1, message: 'New user registered', date: '10 min ago' },
        { id: 2, message: 'Appointment scheduled', date: '1 hour ago' },
        { id: 3, message: 'System update available', date: '2 days ago' },
        { id: 4, message: 'New user registered', date: '1 week ago' },
        { id: 5, message: 'Appointment scheduled', date: '2 weeks ago' },
        { id: 6, message: 'System update available', date: '3 weeks ago' },
        { id: 7, message: 'New user registered', date: '1 month ago' },
    ]);

    const toggleSearchBar = () => {
        const searchBar = document.getElementById('search');
        searchBar.style.display = searchBar.style.display === 'none' ? 'inline-flex' : 'none';
        searchBar.focus();
    };

    const handleSearch = (e) => {
        console.log(e.target.value);
    };

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const handleViewAll = () => {
        toast.info('Viewing all notifications...');
    }

    const open = Boolean(anchorEl);
    const id = open ? 'notification-popover' : undefined;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#f0f4f8',
                p: 2,
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                position: 'sticky',
                top: 63,
                zIndex: 10,
                height: '80px',
            }}
            component={'div'}
        >
            {/* Breadcrumbs Navigation */}
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
                sx={{ fontSize: '0.875rem', color: '#6c757d', fontWeight: 500 }}
            >
                <Link underline="hover" color="inherit" href="/">
                    Home
                </Link>
                <Link underline="hover" color="inherit" href="/admin">
                    Admin
                </Link>
                <Typography color="text.primary">{title}</Typography>
            </Breadcrumbs>

            <Box flexGrow={1} />

            {/* Search Bar & Additional Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Search Icon */}
                <Box sx={{ display: 'flex', position: 'relative' }}>
                    <IconButton onClick={toggleSearchBar} sx={{ p: 1, transition: 'all 0.3s ease', '&:hover': { color: '#e91e63' } }}>
                        <Tooltip title="Search" sx={{ transition: 'all 0.3s ease' }}>
                            <SearchIcon sx={{ fontSize: '30px', color: '#343a40', transition: 'all 0.3s ease' }} />
                        </Tooltip>
                    </IconButton>
                    {/* Search Bar */}
                    <Box
                        id="search"
                        sx={{
                            display: 'none',
                            alignItems: 'center',
                            position: 'absolute',
                            top: 50,
                            right: 0,
                            zIndex: 3,
                            width: '320px',
                            bgcolor: '#fff',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease',
                            padding: '10px 20px',
                            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <Input
                            placeholder="Search"
                            variant="standard"
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: '#495057',
                                    fontSize: '15px',
                                    fontWeight: '400',
                                },
                            }}
                            fullWidth
                            onChange={handleSearch}
                        />
                    </Box>
                </Box>

                {/* Notification Popover */}               
                {/* <NotificationsPop  /> */}
               

                {/* User Avatar */}
                <Tooltip title={user?.name || 'User'}>
                    <IconButton sx={{ p: 2, ml: 2 }}>
                        <Avatar alt={user?.name || 'User'} src={user?.image} sx={{ border: '2px solid #ff6f61', transition: 'border 0.3s ease' }} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default AdminSubHeader;
