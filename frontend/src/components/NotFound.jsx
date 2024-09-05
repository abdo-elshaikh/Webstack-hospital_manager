// components/NotFound.js
import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

const NotFound = () => {
    return (
        <Container maxWidth="xl">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    textAlign: 'center',
                    bgcolor: '#f5f5f5',
                    p: 3
                }}
            >
                <Typography variant="h1" color="primary" sx={{ fontWeight: 'bold' }} gutterBottom>
                    404
                </Typography>
                <Typography variant="h2" color="red" gutterBottom>
                    PAGE NOT FOUND
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph gutterBottom>
                    Sorry, we couldn't find the page you're looking for.
                </Typography>
                <Button
                    variant="outlined"
                    color="info"
                    component="a"
                    href="/"
                    sx={{ mt: 4 }}
                >
                    Go back to home
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;
