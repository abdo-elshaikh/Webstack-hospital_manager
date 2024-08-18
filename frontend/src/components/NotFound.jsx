import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            textAlign="center"
            bgcolor="#f5f5f5"
            p={3}
        >
            <Typography variant="h1" component="h1" color="primary" gutterBottom>
                404
            </Typography>
            <Typography variant="h4" component="h2" gutterBottom>
                Page Not Found
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                The page you're looking for doesn't exist or has been moved.
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                Go to Home
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleGoBack} sx={{ mt: 2 }}>
                Go Back
            </Button>
        </Box>
    );
};

export default NotFound;
