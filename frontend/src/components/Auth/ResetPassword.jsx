import React from 'react';
import { resetPassword } from '../../services/AuthService';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Card, Avatar } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import * as yup from "yup";
import '../../styles/login.css';

const schema = yup.object().shape({
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
});

const ResetPassword = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });
    const { token } = useParams();

    const onSubmitPassword = async (data) => {
        const response = await resetPassword(token, data.password);
        if (response.message) {
            setValue('password', '');
            setValue('confirmPassword', '');
            toast.success(response.message);
        } else {
            toast.error(response.error);
        }
    };

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
                    <Avatar 
                        sx={{ 
                            m: 1, 
                            bgcolor: 'primary.main',
                        }}
                    >
                        <LockOutlined />
                    </Avatar>
                    <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 'bold', 
                            color: 'text.primary' 
                        }}
                    >
                        Reset Password
                    </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                    Enter your new password below.
                </Typography>
                <form onSubmit={handleSubmit(onSubmitPassword)} style={{ width: '100%' }}>
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        {...register("confirmPassword")}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                    />
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
                            to={'/auth/login'}
                            sx={{ 
                                textDecoration: 'none', 
                                fontWeight: 'bold', 
                                color: 'primary.main' 
                            }}
                        >
                            Back to Login
                        </Link>
                    </Typography>
                </form>
            </Card>
        </Container>
    );
}

export default ResetPassword;
