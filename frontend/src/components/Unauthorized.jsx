import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Navigate to the home page
    };

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
            <Typography variant="h1" component="h1" color="error" gutterBottom>
                403
            </Typography>
            <Typography variant="h4" component="h2" gutterBottom>
                Unauthorized
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                You don't have permission to access this page.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleGoHome}>
                Go to Home
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleGoBack} sx={{ mt: 2 }}>
                Go Back
            </Button>
        </Box>
    );
};

export default Unauthorized;
