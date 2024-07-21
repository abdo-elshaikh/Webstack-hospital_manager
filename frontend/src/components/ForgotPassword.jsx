// src/components/ForgotPassword.js
import { useState } from 'react';
import { forgotPassword, resetPassword } from '../services/AuthService';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import * as yup from "yup";
import '../styles/login.css';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters')
});

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isFounded, setIsFounded] = useState(false);
    const [email, setEmail] = useState('');

    const onSubmitEmail = async (data) => {
        const response = await forgotPassword(data.email);
        if (response.message) {
            setMessage(response.message);
            setIsFounded(true);
            setEmail(data.email);
        } else {
            setError(response.error);
            setMessage('');
            setIsFounded(false);
        }
    }

    const handleResetPassword = async (data) => {
        const response = await resetPassword(email, data.password);
        if (response.message) {
            setMessage(response.message);
            setError('');
        } else {
            setError(response.error);
        }
    }

    return (
        <div className="container">
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit(isFounded ? handleResetPassword : onSubmitEmail)} className="login-form">
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" {...register('email')} className="form-control" disabled={isFounded} />
                    <p className="text-danger">{errors.email?.message}</p>
                </div>
                {isFounded &&
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" {...register('password')} className="form-control" />
                        <p className="text-danger">{errors.password?.message}</p>
                    </div>
                }
                <button type="submit" className="btn btn-primary">{isFounded ? 'Reset Password' : 'Check Email'}</button>
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <p>Remember your password? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
}

export default ForgotPassword;
