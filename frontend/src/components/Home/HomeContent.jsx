import React from 'react';
import HeroSection from './HeroSection';
import AboutUs from './AboutUs';
import Gallery from './Gallery';
import ContactUs from './ContactUs';
import Location from './Location';
import { Container, useTheme } from '@mui/material';
import OnlineBooking from './OnlineBooking';

const HomeContent = () => {
    const theme = useTheme();
    return (
        <>
            <HeroSection />
            <Container sx={{ backgroundColor: theme.palette.background.paper }}>
                <AboutUs />
                <Gallery />
                <OnlineBooking />
                <Location />
                <ContactUs />
            </Container>
        </>
    );
};

export default HomeContent;