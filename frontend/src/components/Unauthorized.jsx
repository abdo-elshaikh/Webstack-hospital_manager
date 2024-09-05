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
            <Typography variant="h1" component="h1" color="primary" sx={{ fontWeight: 'bold' }} gutterBottom>
                403
            </Typography>
            <Typography variant="h4" component="h2" color="error" gutterBottom>
                UNAUTHORIZED
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                You don't have permission to access this page.
            </Typography>
            <Button variant="outlined" color="primary" onClick={handleGoHome}>
                Go to Home
            </Button>
           
        </Box>
    );
};

export default Unauthorized;
