// src/components/Footer.jsx
import React from 'react';
import { Container, Row, Col, Image, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';
import '../styles/footer.css';


const Footer = () => {
    return (
        <footer className="footer bg-light py-5" >
            <Container className="footer-container">
                <Row>
                    <Col sm={12} md={4}>
                        <div className="footer-logo">
                            <Image src="/logo.png" alt="Logo" />
                        </div>
                    </Col>
                    <Col sm={12} md={4}>
                        <div className="footer-links">
                            <ListGroup  >
                                <ListGroupItem>
                                    <a href="/home">Home</a>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <a href="/about-us">About Us</a>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <a href="/gallery">Gallery</a>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <a href="/book-appointments">Book Appointments</a>
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                    </Col>
                    <Col sm={12} md={4}>
                        <div className="footer-social">
                            <ListGroup >
                                <ListGroupItem>
                                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                                        <Facebook /> Facebook
                                    </a>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                                        <Twitter /> Twitter
                                    </a>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                                        <Instagram /> Instagram
                                    </a>
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
