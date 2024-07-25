import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/AuthService';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import * as yup from "yup";
import '../styles/login.css';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required')
});

const Login = ({ handleLogIn }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const response = await login(data.email, data.password);

        if (response.error) {
            toast.error(response.error);
            return;
        }
        
        toast.success(`Welcome back: ${response.user.name}`);
        handleLogIn(response.user);
        navigate('/');
    }

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
                            <Link to="/forgotPassword">Forgot password?</Link>
                        </div>

                        <div className="mt-3">
                            Don't have an account? <Link to="/register">Register</Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
