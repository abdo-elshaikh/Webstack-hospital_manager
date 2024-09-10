import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Profile from '../components/Profile';
import Header from '../components/Header';
import TopHeader from '../components/TopHeader';
import HomeContent from '../components/Home/HomeContent';
import AboutUs from '../components/Home/AboutUs';
import Gallery from '../components/Home/Gallery';
import OnlineBooking from '../components/Home/OnlineBooking';
import Location from '../components/Home/Location';
import ContactUs from '../components/Home/ContactUs';
import Footer from '../components/Footer';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PrivateRoute from '../components/PrivateRoute';
import '../styles/home.css';

const Home = () => {
    const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);
    const [showTopHeader, setShowTopHeader] = useState(true);
    const [headerFixed, setHeaderFixed] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            setShowTopHeader(scrollY <= 100);
            setShowScrollToTopButton(scrollY > 100);
            setHeaderFixed(scrollY > 150);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <>
            {showTopHeader && <TopHeader />}
            <Header isFixed={headerFixed} />
            <Routes>
                <Route path="/" element={<HomeContent />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/online-booking" element={<OnlineBooking />} />
                <Route path="/location" element={<Location />} />
                <Route path="/profile" element={<PrivateRoute allowedRoles={['user', 'admin', 'staff']} element={Profile} />} />
                <Route path="*" element={<Navigate to='/not-found' />} />
            </Routes>
            <Footer />
            {showScrollToTopButton && !isMobile && (
                <IconButton
                    size="large"
                    aria-label="scroll back to top"
                    color="primary"
                    sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 100 }}
                    onClick={() => window.scrollTo(0, 0)}
                >
                    <ArrowUpwardIcon />
                </IconButton>
            )}
        </>
    );
};

export default Home;
