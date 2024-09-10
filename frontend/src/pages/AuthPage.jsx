import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Button, Grid, Typography, Paper } from '@mui/material';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import ForgotPassword from '../components/Auth/ForgotPassword';
import ResetPassword from '../components/Auth/ResetPassword';
import Active from '../components/Auth/Active';
import NotFound from '../components/NotFound';
import { Home } from '@mui/icons-material';

const Auth = () => {
  document.title = 'HMS | Auth';
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Left Side - Authentication Routes */}
      <Paper
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(90deg, #005aa7, #fffde4, #005aa7)',
          position: 'relative',
          // borderRadius: '0 20px 20px 0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
        component="main"
      >
        <Button 
          variant="contained"
          sx={{ 
            position: 'absolute', 
            top: 20, 
            left: 20, 
            borderRadius: '50%', 
            p: 2, 
            backgroundColor: '#ffffff',
            color: '#FF6B6B',
            '&:hover': { 
              backgroundColor: '#fffde4',
              color: '#005aa7',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              transform: 'scale(1.1)', 
              transition: 'transform 0.3s ease',
            } 
          }}
          onClick={() => window.location.href = '/'}
        >
          <Home />
        </Button>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/activate/:token" element={<Active />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Paper>

      {/* Right Side - Modern Style */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          padding: 3,
          // borderRadius: '20px 0 0 20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
        component="aside"
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ height: '100%', width: '100%' }}
        >
          <Grid item textAlign={'center'} sx={{ maxWidth: '80%', padding: 3 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                color: '#FF6B6B', 
                fontWeight: 'bold',
                letterSpacing: '0.05em',
              }} 
              gutterBottom
            >
              Welcome to HMS 🎉🎉
            </Typography>
            <Typography variant="h6" color="#4a4a4a" paragraph>
              Manage your healthcare records and appointments with ease and confidence with our user-friendly platform that brings together all of your healthcare needs.
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#0072ff', 
                border: '1px solid #e0e0e0', 
                borderRadius: 2, 
                padding: 1, 
                backgroundColor: '#f0f0f0',
              }}
            >
              To get started, please login or register.
            </Typography>
          </Grid>
          <Typography variant="h6" component="li" sx={{ color: '#0072ff', mt: 2 }}>
            Powered by :{' '}
            <a
              href="https://www.linkedin.com/in/abdelrahman-mohamed-ahmed-56874a28a/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#e36414' }}
            >
              Abdo Mhmd
            </a>
          </Typography>
        </Grid>
      </Box>
    </Box>
  );
};

export default Auth;
