import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Drawer, IconButton, List, ListItem, ListItemText, Toolbar, AppBar, Typography, Box, useTheme, useMediaQuery, ListItemIcon } from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon, GroupSharp, Home, BookOnline, Person, ExitToApp, CalendarMonth } from "@mui/icons-material";
import StaffHome from "../components/Staff/StaffHome";
import PatientAppointment from "../components/Appointments/PatientAppointment";
import Profile from "../components/Profile";
import AllPatients from "../components/Patients/AllPatients";
import BookAppointment from "../components/Appointments/BookAppointment";
import AppointmentListPage from "../components/Appointments/AppointmentList";
import NotFound from "../components/NotFound";
import { useAuth } from "../contexts/AuthContext";
import '../styles/staff.css';

const drawerWidth = 240;

const Staff = () => {
    const { user, handleLogout } = useAuth();
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [currentDate, setDate] = useState('');
    const [currentTime, setTime] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTimeAndDate = new Date();
            setDate(currentTimeAndDate.toLocaleDateString());
            setTime(currentTimeAndDate.toLocaleTimeString());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) setIsDrawerOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#DDDDDD', color: '#000' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer} sx={{ mr: 2 }}>
                        {isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Staff Dashboard
                    </Typography>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ mr: 2 }}>
                            Date: {currentDate}
                        </Typography>
                        <Typography variant="subtitle1">
                            Time: {currentTime}
                        </Typography>
                    </Box>
                    <Box style={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Typography variant="h6">
                            Welcome, {user?.name}
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant={isMobile || isTablet ? 'temporary' : 'persistent'}
                open={isDrawerOpen}
                onClose={() => isMobile || isTablet && setIsDrawerOpen(false)}
                anchor="left"
                sx={{
                    width: isDrawerOpen ? drawerWidth : 0,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#EEEEEE', color: 'black', marginTop: '64px', borderRight: '1px solid gray' }
                }}
            >
                <List sx={{ width: '100%', maxWidth: 360 }}>
                    <ListItem button onClick={() => handleNavigation('/staff/home')}>
                        <ListItemIcon><Home /></ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem button onClick={() => handleNavigation('/staff/patients')}>
                        <ListItemIcon><GroupSharp /></ListItemIcon>
                        <ListItemText primary="Patients" />
                    </ListItem>
                    <ListItem button onClick={() => handleNavigation('/staff/appointments')}>
                        <ListItemIcon><CalendarMonth /></ListItemIcon>
                        <ListItemText primary="Appointments" />
                    </ListItem>
                    <ListItem button onClick={() => handleNavigation('/staff/bookings')}>
                        <ListItemIcon><BookOnline /></ListItemIcon>
                        <ListItemText primary="Online Bookings" />
                    </ListItem>
                    <ListItem button onClick={() => handleNavigation('/staff/profile')}>
                        <ListItemIcon><Person /></ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItem>
                    <ListItem button onClick={() => handleNavigation('/')}>
                        <ListItemIcon><ExitToApp /></ListItemIcon>
                        <ListItemText primary="Exit" />
                    </ListItem>
                </List>
            </Drawer>
            <Box
                component="main" sx={{ flexGrow: 1, p: 1, backgroundColor: '#fdfdfd', minHeight: '100vh' }}
            >
                <Toolbar />
                <Routes>
                    <Route path="/" element={<StaffHome />} />
                    <Route path="/home" element={<StaffHome />} />
                    <Route path="/patient/appointments/:patientId" element={<PatientAppointment />} />
                    <Route path="/bookings" element={<BookAppointment />} />
                    <Route path="/patients" element={<AllPatients />} />
                    <Route path="/patients/:id" element={<PatientAppointment />} />
                    <Route path="/appointments" element={<AppointmentListPage />} />
                    <Route path="/profile" element={<Profile/>} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default Staff;
