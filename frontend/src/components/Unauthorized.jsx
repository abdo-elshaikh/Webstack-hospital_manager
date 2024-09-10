import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h1" sx={{ fontSize: '10rem', fontWeight: 'bold', color: '#f44336' }}>403</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>Unauthorized Access</Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>You do not have permission to access this page.</Typography>
                <Button
                    component={Link}
                    to="/auth/login"
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: '8px', padding: '10px 20px' }}
                >
                    Go to Login
                </Button>
            </Box>
        </Container>
    );
};

export default UnauthorizedPage;
