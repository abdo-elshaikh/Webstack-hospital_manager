import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from '../services/AuthService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
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

    const onSubmit = async (data) => {
        const response = await register(data);
        if (response.error) {
            toast.error(response.error);
            return;
        } else {
            toast.success(response.message);
            navigate('/login');
        }
    }

    return (
        <Container className="main-container">
            <Row className="justify-content-center">
                <Col md={8}>
                    <div className="register-container">
                        <h1>Register</h1>
                        <Form onSubmit={handleSubmit(onSubmit)} className="register-form">
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={2}>Name</Form.Label>
                                <Col sm={9}>
                                    <Form.Control type="text" {...registerForm('name')} isInvalid={!!errors.name} />
                                    <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={2}>Email</Form.Label>
                                <Col sm={9}>
                                    <Form.Control type="email" {...registerForm('email')} isInvalid={!!errors.email} />
                                    <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={2}>Password</Form.Label>
                                <Col sm={9}>
                                    <Form.Control type="password" {...registerForm('password')} isInvalid={!!errors.password} />
                                    <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={2}>Confirm Password</Form.Label>
                                <Col sm={9}>
                                    <Form.Control type="password" {...registerForm('confirmPassword')} isInvalid={!!errors.confirmPassword} />
                                    <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={2}>Role</Form.Label>
                                <Col sm={9}>
                                    <Form.Control as="select" {...registerForm('role')} isInvalid={!!errors.role}>
                                        <option value="">Select Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="staff">Staff</option>
                                        <option value="user">User</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">{errors.role?.message}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Col sm={12}>
                                    <Button type="submit" className="btn btn-primary">Register</Button>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Col sm={12}>
                                    <p>Already have an account? <Link to="/login">Login</Link></p>
                                </Col>
                            </Form.Group>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Register;
