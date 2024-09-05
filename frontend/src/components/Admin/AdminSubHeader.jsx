import React from 'react';
import { Breadcrumbs, Link, Typography, Box, TextField, IconButton, Avatar, Badge, Tooltip, Input, } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import useAuth from '../../contexts/useAuth';

const AdminSubHeader = ({ title }) => {
    const { user } = useAuth();

    const toggleSearchBar = () => {
        const searchBar = document.getElementById('search');

        console.log('searchBar', searchBar);
        searchBar.style.display = searchBar.style.display === 'none' ? 'inline-flex' : 'none';
        searchBar.focus();
    };

    const handleSearch = (e) => {
        console.log(e.target.value);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#fff',
                p: 2,
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                position: 'sticky',
                top: 63,
                zIndex: 10,
                height: '70px',
            }}
            component={'div'}
        >
            {/* Breadcrumbs Navigation */}
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
                sx={{ fontSize: '0.875rem' }}
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
                {/* Search Bar */}
                <Box
                    id="search"
                    position={'static'}
                    display={'inline-flex'}

                >
                    <Input
                        placeholder="Search"
                        onChange={handleSearch}
                        sx={{
                            '&:focus-within': {
                                display: 'inline-block',
                            },
                        }}
                    />
                </Box>
                {/* Search Icon */}
                <IconButton onClick={toggleSearchBar} sx={{ p: 2, transition: 'all 0.3s ease', '&:hover': { color: '#ff6f61' } }}>
                    <SearchIcon sx={{ fontSize: '30px', color: '#000', transition: 'all 0.3s ease' }} />
                </IconButton>
                {/* Notifications */}
                <Tooltip title="Notifications">
                    <IconButton sx={{ p: 2, ml: 1 }}>
                        <Badge badgeContent={4} color="secondary">
                            <NotificationsIcon sx={{ fontSize: '28px', color: '#000' }} />
                        </Badge>
                    </IconButton>
                </Tooltip>
                {/* User Avatar */}
                <Tooltip title={user?.name || 'User'}>
                    <IconButton sx={{ p: 2, ml: 1 }}>
                        <Avatar alt={user?.name || 'User'} src={user?.image} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default AdminSubHeader;
