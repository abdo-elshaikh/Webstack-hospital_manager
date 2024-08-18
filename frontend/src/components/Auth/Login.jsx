import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/AuthService';
import {
  Box,
  Link,
  Card,
  Stack,
  Button,
  Typography,
  TextField,
  Divider,
  IconButton,
  Checkbox,
  FormControlLabel,
  CardContent,
} from '@mui/material';
import { Visibility, VisibilityOff, Home, Google, Facebook } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import * as yup from 'yup';
import '../../styles/login.css';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const { handleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    toast.info('Logging in...', data);
    try {
      const response = await login(data);
      if (response.error) {
        toast.error(response.error);
      } else {
        const { token, user } = response;
        if (handleLogin(token, user, keepLoggedIn)) {
          toast.success(response.message);
          navigate('/');
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogInRedirect = () => {
    try {
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams(url.search);
      const token = searchParams.get('token');
      const user = JSON.parse(decodeURIComponent(searchParams.get('user')));
      if (token && user) {
        setKeepLoggedIn(true);
        if (handleLogin(token, user, keepLoggedIn)) {
          toast.success(`Welcome back, ${user.name}`);
          navigate('/');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const googleLogin = () => {
    window.open('http://localhost:5000/auth/google', '_self');
  };

  const facebookLogin = () => {
    window.open('http://localhost:5000/auth/facebook', '_self');
  };

  useEffect(() => {
    handleLogInRedirect();
  }, []);

  return (
    <Box
    maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '2rem',
        width: '100%',
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
            Log In
          </Typography>
          <Typography align="center" sx={{ mb: 3, color: 'text.secondary' }}>
            Don't have an account?{' '}
            <Link
              onClick={() => navigate('/auth/register')}
              sx={{ cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none' }}
            >
              Register
            </Link>
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
              <FormControlLabel
                control={<Checkbox checked={keepLoggedIn} onChange={(e) => setKeepLoggedIn(e.target.checked)} />}
                label="Keep me logged in"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ padding: '0.75rem' }}>
                Log In
              </Button>
            </Stack>
          </form>
          <Typography align="center" sx={{ mt: 3, color: 'text.secondary' }}>
            or
          </Typography>
          <Box mt={2} display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              color="error"
              startIcon={<Google />}
              onClick={googleLogin}
              sx={{ flexGrow: 1 }}
            >
              Google
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Facebook />}
              onClick={facebookLogin}
              sx={{ flexGrow: 1 }}
            >
              Facebook
            </Button>
          </Box>
          <Box mt={2} display="flex" flexDirection="column" alignItems="center">
            <Link onClick={() => navigate('/auth/forgot-password')} sx={{ cursor: 'pointer', mt: 1 }}>
              Forgot password?
            </Link>
            <Link
              onClick={() => navigate('/')}
              sx={{
                cursor: 'pointer',
                mt: 2,
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'text.primary',
              }}
            >
              <Home sx={{ mr: 1 }} />
              Back to home
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
