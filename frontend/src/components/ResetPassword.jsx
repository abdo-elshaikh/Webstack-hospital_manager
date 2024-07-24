import { resetPassword } from '../services/AuthService';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import * as yup from "yup";
import '../styles/login.css';

const schema = yup.object().shape({
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});
const ResetPassword = () => {
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
    }
    return (
        <div className="login">
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit(onSubmitPassword)}>
                <input type="password" placeholder="Password" {...register("password")} />
                <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} />
                <button type="submit">Submit</button>
            </form>
            <p><Link to="/login">Login</Link></p>
        </div>
    );
}
export default ResetPassword;