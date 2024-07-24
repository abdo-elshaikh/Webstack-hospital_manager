import React from 'react';
import { Container } from 'react-bootstrap';
import '../../styles/home.css';

const Location = () => {
    return (
        <Container className="location-section text-center">
            <h2>Location</h2>
            <p>Find us at our address below:</p>
            <p>123 Hospital Road, City, Country</p>
        </Container>
    );
};

export default Location;
