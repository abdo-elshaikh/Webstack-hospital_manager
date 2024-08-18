import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateUserActivation } from '../../services/AdminService';
import { resetActivation } from '../../services/AuthService';
import { Box, Button, Typography } from '@mui/material';

const Active = () => {
    const registerUser = localStorage.getItem('registerUser');
    const registerToken = localStorage.getItem('registerToken');
    const user = JSON.parse(registerUser);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token } = useParams();
    const [timer, setTimer] = useState(15);

    useEffect(() => {
        console.log('registerToken', registerToken, 'token', token, 'user', user);
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer === 0) {
                    clearInterval(interval);
                    handleTimeExpired();
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

   
    const handleTimeExpired = () => {
        setError('Time expired. Please try again.');
        localStorage.removeItem('registerToken');
    };

    const activateUser = async () => {
        console.log('registerToken', registerToken, 'token', token);
        if (token !== registerToken) {
            // toast.error('Token verification failed. Please try again or register again.');
            setError('Token verification failed. Please try again or register again.');
            localStorage.removeItem('registerToken');
            return;
        }

        try {
            const response = await updateUserActivation(user._id);
            if (response.error) {
                toast.error(response.error || 'Failed to activate user. Please try again.');
                setError(response.error || 'Failed to activate user. Please try again.');
                localStorage.removeItem('registerToken');
            } else {
                toast.success(response.message);
                localStorage.removeItem('registerUser');
                localStorage.removeItem('registerToken');
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const ResendNewActivationLink = async () => {
        console.log('registerToken', registerToken, 'token', token);
        try {
            const response = await resetActivation(user._id);
            if (response.error) {
                toast.error(response.error);
                setError(response.error);
            } else {
                toast.success(response.message);
                setTimer(15);
                const { token } = response;
                localStorage.setItem('registerToken', token);
                navigate('/');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%', backgroundColor: '#f5f5f5' }}>
            <Box sx={{ width: '400px', padding: '40px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4">Account Activation</Typography>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="subtitle1" color="textSecondary">
                        {`Activation link will expire in ${timer} seconds`}
                    </Typography>
                </Box>

                {error && (
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="subtitle1" color="error">
                            {error}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="body1">Please click the button below to activate your account.</Typography>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={timer === 0 ? ResendNewActivationLink : activateUser}
                    >
                        {timer === 0 ? 'Resend Activation Link' : 'Activate Account'}
                    </Button>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="subtitle1" color="textSecondary">
                        If you did not request an activation link, please ignore this email.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Active;
