// src/components/ForgotPassword.js
import { forgotPassword } from '../services/AuthService';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import * as yup from "yup";
import '../styles/login.css';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

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
        <div className="login">
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit(onSubmitEmail)}>
                <input type="email" placeholder="Email" {...register("email")} />
                <p>{errors.email?.message}</p>
                <button type="submit">Submit</button>
            </form>
            <p><Link to="/login">Login</Link></p>

        </div>
    );
}

export default ForgotPassword;
