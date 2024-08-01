import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/AuthService';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import '../styles/login.css';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});

const Login = ({ handleLogIn }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const navigate = useNavigate();

    useEffect(() => {
        const handleLoginRedirect = () => {
            const { searchParams } = new URL(window.location.href);
            const token = searchParams.get('token');
            const user = searchParams.get('user');
            
            if (!token && !user) {
                return;
            } 
            const parsedUser = JSON.parse(decodeURIComponent(user));
            handleLogIn(parsedUser);
            toast.success(`Welcome back: ${parsedUser.name}`);
            navigate('/');
        };

        handleLoginRedirect();
    }, [navigate]);

    const onSubmit = async (data) => {
        const response = await login(data.email, data.password);
        console.log(response.user);
        if (response.error) {
            toast.error(response.error);
            return;
        }
        handleLogIn(response)
        toast.success(`Welcome back: ${response.user.name}`);
        navigate('/');
    };

    const handleGoogleLogin = () => {
        window.location = 'http://localhost:5000/auth/google';
    };

    const handleFacebookLogin = () => {
        window.location = 'http://localhost:5000/auth/facebook';
    };

    return (
        <Container className="justify-content-md-center">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Form onSubmit={handleSubmit(onSubmit)} className="login-form">
                        <h2 className="text-center">Login</h2>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                {...register('email')}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formPassword" className="mt-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                {...register('password')}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Login
                        </Button>

                        <div className="mt-3">
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>

                        <div className="mt-3">
                            Don &apost have an account? <Link to="/register">Register</Link>
                        </div>
                    </Form>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <div className="text-center mt-3">
                        <Button variant="primary" onClick={handleGoogleLogin}>Login with Google</Button>
                        <Button variant="primary" onClick={handleFacebookLogin} className="ms-3">Login with Facebook</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;

