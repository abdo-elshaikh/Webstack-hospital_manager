import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import '../../styles/home.css';

const Gallery = () => {
    return (
        <Container className="gallery-section text-center">
            <h2 className="section-title">Gallery</h2>
            <Row>
                <Col md={4} className='gallery-img'><Image src="/1.jpg" thumbnail /></Col>
                <Col md={4} className='gallery-img'><Image src="/2.jpg" thumbnail /></Col>
                <Col md={4} className='gallery-img'><Image src="/3.jpg" thumbnail /></Col>
            </Row>
        </Container>
    );
};

export default Gallery;
