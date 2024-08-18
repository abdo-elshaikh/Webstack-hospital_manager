import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Typography, Container, Paper , Grid} from '@mui/material';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Active from './Active';
import NotFound from '../NotFound';
import AnimationLogo from '../../../public/autho.png';
import '../../styles/authPage.css';

const AuthPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Left Side - Authentication Routes */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        className="auth-container"
        component="main"
        maxWidth="xs"
        elevation={0}
        square
        
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/activate/:token" element={<Active />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>

      {/* Right Side - Image or Animation hide on small screens */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: '#f5f5f5',
          borderLeft: '1px solid #dee2e6',
        }}
        className="auth-container"
        component="main"
        maxWidth="xs"
        elevation={0}
        square
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ height: '100%', width: '100%' }}
        >
          <Grid item>
            <img
              src={AnimationLogo}
              alt="Logo"
              style={{ maxWidth: '100%', height: 'auto' }}
              transition="all 0.3s ease-in-out"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
      
  );
};

export default AuthPage;
