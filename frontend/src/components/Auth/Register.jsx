import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { register } from '../../services/AuthService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, TextField, Button, Typography, Card, Divider, Stack } from '@mui/material';
import '../../styles/register.css';

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
});

const Register = () => {
    const { register: registerForm, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const response = await register(data);
        if (response.error) {
            toast.error(response.error);
            return;
        } else {
            const { token, user } = response;
            if (token && user) {
                localStorage.setItem('registerToken', token);
                localStorage.setItem('registerUser', JSON.stringify(user));
            }
            toast.success(response.message);
            navigate('/');
        }
    }

    return (
        <Box 
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                padding: '16px',
                width: '100%',
            }}
        >
            <Card 
                sx={{
                    maxWidth: 400,
                    width: '100%',
                    boxShadow: 3,
                    borderRadius: 2,
                    padding: 4,
                }}
            >
                <Typography 
                    variant="h4" 
                    align="center" 
                    sx={{ 
                        mb: 2, 
                        fontWeight: 'bold',
                        color: 'text.primary'
                    }}
                >
                    Register
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={3}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            {...registerForm('name')}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            {...registerForm('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            {...registerForm('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                        <TextField
                            label="Confirm Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            {...registerForm('confirmPassword')}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                        />
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            sx={{ 
                                padding: '10px 0',
                                fontWeight: 'bold',
                            }}
                        >
                            Register
                        </Button>
                    </Stack>
                </form>
                <Typography 
                    align="center" 
                    sx={{ 
                        mt: 3, 
                        color: 'text.secondary' 
                    }}
                >
                    Already have an account? <Link to="/auth/login">Login</Link>
                </Typography>
            </Card>
        </Box>
    );
}

export default Register;
