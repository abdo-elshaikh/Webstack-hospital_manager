import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import '../../styles/home.css';

const HeroSection = ({ user, isLogged }) => {
    console.log(user, isLogged);
    return (
        <Container fluid className="hero-section text-center">
            <Card className="bg-dark text-white">
                <Card.Img src="assets/medical.jpg" alt="Hero image" />
                <Card.ImgOverlay>
                    <Row className="justify-content-center align-items-center h-100">
                        <Col md={8}>
                            <Card.Title as="h1">Welcome to Hospital Manager</Card.Title>
                            <Card.Text>
                                Your one-stop solution for managing hospital operations efficiently.
                            </Card.Text>
                            {isLogged ? (
                                <Link to={`/profile/${user._id}`}>
                                    <Button variant="primary" className="mt-2">Go to Profile</Button>
                                </Link>
                            ) : (
                                <>
                                    <Link to='/login'>
                                        <Button variant="primary" className="mt-2">Login</Button>
                                    </Link>
                                    <Link to='/register'>
                                        <Button variant="outline-light" className="mt-2">Register</Button>
                                    </Link>
                                </>
                            )}
                        </Col>
                    </Row>
                </Card.ImgOverlay>
            </Card>
        </Container>
    );
};

export default HeroSection;
