import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h1" sx={{ fontSize: '10rem', fontWeight: 'bold', color: '#f44336' }}>404</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>Page Not Found</Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>The page you're looking for doesn't exist or has been moved.</Typography>
                <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: '8px', padding: '10px 20px' }}
                >
                    Go to Homepage
                </Button>
            </Box>
        </Container>
    );
};

export default NotFoundPage;
