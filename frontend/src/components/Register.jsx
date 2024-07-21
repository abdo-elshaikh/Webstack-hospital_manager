// Register.jsx
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from '../services/AuthService';
import { Link } from 'react-router-dom';
import '../styles/register.css';

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
    role: yup.string().required('Role is required')
});

const Register = () => {
    const { register: registerForm, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async (data) => {
        const response = await register(data);
        if (response.error) {
            setError(response.error);
            setMessage(response.message);
            return;
        } else {
            setMessage(response.message);
            setError('');
            navigate('/login');
        }
    }

    return (
        <div className="main-container">
            <div className="container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="register-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" {...registerForm('name')} className="form-control" />
                        <p className="text-danger">{errors.name?.message}</p>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" {...registerForm('email')} className="form-control" />
                        <p className="text-danger">{errors.email?.message}</p>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" {...registerForm('password')} className="form-control" />
                        <p className="text-danger">{errors.password?.message}</p>
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" {...registerForm('confirmPassword')} className="form-control" />
                        <p className="text-danger">{errors.confirmPassword?.message}</p>
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select {...registerForm('role')} className="form-control">
                            <option value="">--Select Role--</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                        <p className="text-danger">{errors.role?.message}</p>
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
                {message && <p className="text-success">{message}</p>}
                {error && <p className="text-danger">{error}</p>}
            </div>
        </div>
    );
}

export default Register;
