import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Container, TextField, Button, Typography, Link, Box, Card } from '@mui/material';
import * as yup from "yup";
import '../../styles/login.css';
import { forgotPassword } from '../../services/AuthService';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    const navigate = useNavigate();

    const onSubmitEmail = async (data) => {
        const response = await forgotPassword(data.email);
        if (response.message) {
            setValue('email', '');
            toast.success(response.message);
        } else {
            toast.error(response.error);
        }
    }

    return (
        <Container 
            maxWidth="sm" 
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <Card 
                sx={{
                    padding: 4,
                    boxShadow: 3,
                    borderRadius: 2,
                    width: '100%',
                    maxWidth: 400,
                }}
            >
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    mb={4}
                >
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
                        alt="Logo"
                        style={{ width: '80px', marginBottom: '20px', borderRadius: '50%' }} 
                    />
                    <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 'bold', 
                            color: 'text.primary' 
                        }}
                    >
                        Forgot Password
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit(onSubmitEmail)} style={{ width: '100%' }}>
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <Typography 
                        variant="body2" 
                        align="center" 
                        sx={{ 
                            marginTop: 2, 
                            color: 'text.secondary' 
                        }}
                    >
                        We will send you a reset link to your email.
                    </Typography>

                    <Button 
                        type="submit" 
                        fullWidth 
                        variant="contained" 
                        color="primary" 
                        sx={{ 
                            marginTop: 3, 
                            padding: '10px 0', 
                            fontWeight: 'bold' 
                        }}
                    >
                        Submit
                    </Button>
                </form>
                <Typography 
                    variant="body2" 
                    align="center" 
                    sx={{ 
                        marginTop: 3, 
                        color: 'text.secondary' 
                    }}
                >
                    <Link 
                        component="button" 
                        onClick={() => navigate('/auth/login')} 
                        sx={{ 
                            textDecoration: 'none', 
                            fontWeight: 'bold', 
                            color: 'primary.main' 
                        }}
                    >
                        Back to Login
                    </Link>
                </Typography>
            </Card>
        </Container>
    );
}

export default ForgotPassword;
