import React from 'react';
import HeroSection from './HeroSection';
import AboutUs from './AboutUs';
import Gallery from './Gallery';
import ContactUs from './ContactUs';
import Location from './Location';
import { Container, useTheme, Divider } from '@mui/material';
import OnlineBooking from './OnlineBooking';

const HomeContent = () => {
    const theme = useTheme();
    return (
        <>
            <HeroSection />
            <OnlineBooking />
            <AboutUs />
            <Gallery />
            <Location />
            <ContactUs />
        </>
    );
};

export default HomeContent;