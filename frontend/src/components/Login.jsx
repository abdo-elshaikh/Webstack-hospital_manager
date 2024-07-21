// Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/AuthService'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import Home from '../components/Home';
import * as yup from "yup";
import '../styles/login.css';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required')
});
const Login = ({ handleLogIn }) => {
    const { register: registerForm, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async (data) => {
        const response = await login(data.email, data.password);

        if (response.error) {
            setError(response.error);
            setMessage(response.message); return;
        }
        setMessage('Login successful');
        handleLogIn(response.user);
        setError('');
        navigate('/');
    }
    return (
        <div className="container">
            <section id="content">
                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    <h1 className="login-title">Login</h1>
                    <div className="">
                        <input type="email" {...registerForm('email')} className="" id='email' />
                        <p className="text-danger">{errors.email?.message}</p>
                    </div>
                    <div className="">
                        <input type="password" {...registerForm('password')} className="" id='password' />
                        <p className="text-danger">{errors.password?.message}</p>
                    </div>
                    <div className="">
                        <button type="submit" className="btn btn-primary">Login</button>
                        <Link to="/register" className="">Register</Link>
                        <Link to="/forgotPassword" className="">Lost your password?</Link>

                    </div>
                </form>
            </section>
        </div>
    );
}

export default Login;
