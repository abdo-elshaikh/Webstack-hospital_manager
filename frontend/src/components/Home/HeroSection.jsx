import {useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import '../../styles/home.css';

const HeroSection = ({ user, isLogged, altStyle }) => {
    if (!user) {
        user = JSON.parse(localStorage.getItem('user'));
        if (user) isLogged = true;
    }


    return (
        <Container fluid className={`hero-section ${altStyle ? 'hero-section-alt' : ''}`}>
            <Row className="hero-content align-items-center justify-content-center">
                <Col xs={10} md={8} className="text-center">
                    <h1 className={`hero-title ${altStyle ? 'hero-title-alt' : ''}`}>Welcome to Hospital Manager</h1>
                    <p className={`hero-text ${altStyle ? 'hero-text-alt' : ''}`}>
                        Your one-stop solution for managing hospital operations efficiently.
                    </p>
                    {isLogged ? (
                        <Link to={`/profile`}>
                            <Button variant="primary" className="hero-button mt-2">Go to Profile</Button>
                        </Link>
                    ) : (
                        <>
                            <Link to='/login'>
                                <Button variant="primary" className="hero-button mt-2">Login</Button>
                            </Link>
                            <Link to='/register'>
                                <Button variant="outline-light" className="hero-button mt-2">Register</Button>
                            </Link>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default HeroSection;
