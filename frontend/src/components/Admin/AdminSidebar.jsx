import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, IconButton, Divider, useTheme, useMediaQuery } from '@mui/material';
import { LocationOn, Home, People, CalendarToday, LocalHospital, SevereColdSharp, Group, Person2, BookOnline, ExitToApp, GroupSharp, GroupWork } from '@mui/icons-material';
import { Link,  } from 'react-router-dom';

const AdminSidebar = ({ open, setOpen }) => {
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const drawerWidth = 260;

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <>
            {/* sidebar for admin */}
            <Drawer
                variant={isMobile || isTablet ? 'temporary' : 'persistent'}
                open={open}
                onClose={() => isMobile || isTablet && setOpen(false)}
                anchor="left"
                bgcolor="#154c79"
                color="white"
                sx={{
                    width: open ? drawerWidth : 0,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#EEEEEE', color: 'black', borderRight: '1px solid gray' },

                }}
            >
                <Toolbar />
                <Divider />
                <List sx={{ width: '100%', maxWidth: 360}}>
                    <ListItem button component={Link} to="/admin/dashboard">
                        <ListItemIcon><Home /></ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/users">
                        <ListItemIcon><People /></ListItemIcon>
                        <ListItemText primary="Manage Users" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/departments">
                        <ListItemIcon><LocalHospital /></ListItemIcon>
                        <ListItemText primary="Manage Departments" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/services">
                        <ListItemIcon><SevereColdSharp /></ListItemIcon>
                        <ListItemText primary="Manage Services" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/positions">
                        <ListItemIcon><LocationOn /></ListItemIcon>
                        <ListItemText primary="Manage Positions" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/staff">
                        <ListItemIcon><GroupWork /></ListItemIcon>
                        <ListItemText primary="Manage Staff" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/patients">
                        <ListItemIcon><Person2 /></ListItemIcon>
                        <ListItemText primary="Manage Patients" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/appointments">
                        <ListItemIcon><CalendarToday /></ListItemIcon>
                        <ListItemText primary="Manage Appointments" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/book-appointment">
                        <ListItemIcon><BookOnline /></ListItemIcon>
                        <ListItemText primary="Online Bookings" />
                    </ListItem>
                    <ListItem button component={Link} to="/">
                        <ListItemIcon><ExitToApp /></ListItemIcon>
                        <ListItemText primary="Exit" />
                    </ListItem>
                </List>
                
            </Drawer>
        </>
    );
};

export default AdminSidebar;
