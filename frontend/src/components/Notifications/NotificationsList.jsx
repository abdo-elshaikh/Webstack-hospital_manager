import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails, Typography, Button, Paper } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ArrowDropDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../contexts/useAuth';
import { toast } from 'react-toastify';

const NotificationsList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = () => {
        setNotifications([
            { id: 1, message: 'New user registered', content: 'New user registered with email: 6Jg9T@example.com', date: '10 min ago' },
            { id: 2, message: 'Appointment scheduled', content: 'Appointment with Dr. John Smith scheduled for today at 10:00 AM', date: '1 hour ago' },
            { id: 3, message: 'System update available', content: 'System update available. Please download the latest version.', date: '2 days ago' },
            { id: 4, message: 'New feedback received', content: 'New feedback received from user with email: 6Jg9T@example.com', date: '3 days ago' },
            // Add more notifications if needed...
        ]);
    };

    const handleViewAll = () => {
        toast.info('Viewing all notifications...');
        navigate('/notifications');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                Notifications
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: '10px', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)' }}>
                <Table sx={{ minWidth: 650 }} aria-label="notifications table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Message</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notifications.map((notification) => (
                            <TableRow
                                key={notification.id}
                                sx={{
                                    '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                                    '&:hover': { backgroundColor: '#f1f1f1' },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <Accordion sx={{ width: '100%', boxShadow: 'none', backgroundColor: 'transparent' }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls={`panel-${notification.id}-content`}
                                            id={`panel-${notification.id}-header`}
                                            sx={{ fontSize: '14px' }}
                                        >
                                            <Typography sx={{ fontWeight: 500 }}>{notification.message}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ paddingTop: 0 }}>
                                            <Typography sx={{ fontSize: '14px', color: '#666' }}>{notification.content}</Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </TableCell>
                                <TableCell align="right">{notification.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                variant="contained"
                color="primary"
                onClick={handleViewAll}
                sx={{
                    mt: 3,
                    display: 'block',
                    marginLeft: 'auto',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    backgroundColor: '#1976d2',
                    ':hover': {
                        backgroundColor: '#1565c0',
                    },
                }}
            >
                View All
            </Button>
        </Box>
    );
};

export default NotificationsList;
