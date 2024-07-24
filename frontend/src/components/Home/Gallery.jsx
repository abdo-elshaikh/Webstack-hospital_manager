import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import '../../styles/home.css';

const Gallery = () => {
    return (
        <Container className="gallery-section text-center">
            <h2>Gallery</h2>
            <Row>
                <Col md={4}><Image src="https://via.placeholder.com/300" thumbnail /></Col>
                <Col md={4}><Image src="https://via.placeholder.com/300" thumbnail /></Col>
                <Col md={4}><Image src="https://via.placeholder.com/300" thumbnail /></Col>
            </Row>
        </Container>
    );
};

export default Gallery;
