import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, Divider, IconButton, Tooltip, Badge, Popover, Button } from '@mui/material';
import { ClearAll, Notifications, NotificationsOff, MoreVert, MarkUnreadChatAlt,  } from '@mui/icons-material';

const NotificationsPop = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'New user registered', content: 'New user registered to your account with email: 6Jg9T@example.com', date: '10 min ago' },
        { id: 2, message: 'Appointment scheduled', content: 'Appointment with Dr. John Smith scheduled for today at 10:00 AM', date: '1 hour ago' },
        { id: 3, message: 'System update available', content: 'System update available. Please download the latest version.', date: '2 days ago' },
        { id: 4, message: 'New feedback received', content: 'New feedback received from user with email: 6Jg9T@example.com', date: '3 days ago' },
    ]);

    const [anchorEl, setAnchorEl] = useState(null);

    const clearNotifications = () => {
        setNotifications([]);
    };

    const toggleNotifications = () => {
        if (notifications.length > 0) {
            clearNotifications();
        } else {
            setNotifications([
                { id: 1, message: 'New user registered', content: 'New user registered to your account with email: 6Jg9T@example.com', date: '10 min ago' },
                { id: 2, message: 'Appointment scheduled', content: 'Appointment with Dr. John Smith scheduled for today at 10:00 AM', date: '1 hour ago' },
                { id: 3, message: 'System update available', content: 'System update available. Please download the latest version.', date: '2 days ago' },
                { id: 4, message: 'New feedback received', content: 'New feedback received from user with email: 6Jg9T@example.com', date: '3 days ago' },
            ]);
        }
    };

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'notification-popover' : undefined;

    return (
        <Box>
            <Tooltip title="Notifications">
                <IconButton onClick={handleNotificationClick}>
                    <Badge badgeContent={notifications.length} color="error">
                        <Notifications />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleNotificationClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box sx={{ p: 2, width: '300px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Notifications</Typography>
                        <IconButton onClick={clearNotifications} color="error" size="small">
                            <Tooltip title="Clear All Notifications">
                                <ClearAll />
                            </Tooltip>
                        </IconButton>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <List>
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <React.Fragment key={notification.id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={notification.message}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2" color="textSecondary">
                                                        {notification.date}
                                                    </Typography>
                                                    <br />
                                                    {notification.content}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))
                        ) : (
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="body2" color="textSecondary">
                                    No new notifications
                                </Typography>
                                <NotificationsOff sx={{ fontSize: 40, mt: 2 }} color="disabled" />
                            </Box>
                        )}
                    </List>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<MarkUnreadChatAlt />}
                            onClick={toggleNotifications}
                        >
                            {notifications.length > 0 ? 'Clear All' : 'Load Sample'}
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </Box>
    );
};

export default NotificationsPop;
