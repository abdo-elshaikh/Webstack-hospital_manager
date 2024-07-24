import React from 'react';
import { Container } from 'react-bootstrap';
import HeroSection from './HeroSection';
import Gallery from './Gallery';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import Location from './Location';
import BookAppointments from './BookAppointments';
import '../../styles/home.css';

const Home = ({ user, isLogged }) => {
    return (
        <Container fluid className="home-container">
            <HeroSection user={user} isLogged={isLogged} />
            <AboutUs />
            <Gallery />
            <BookAppointments />
            <Location />
            <ContactUs />
        </Container>
    );
};

export default Home;
