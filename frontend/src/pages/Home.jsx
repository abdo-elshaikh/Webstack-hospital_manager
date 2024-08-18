import { useEffect, useState } from 'react';
import { Container, Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import TopHeader from '../components/TopHeader';
import HomeContent from '../components/Home/HomeContent';
import AboutUs from '../components/Home/AboutUs';
import Gallery from '../components/Home/Gallery';
import OnlineBooking from '../components/Home/OnlineBooking';
import Location from '../components/Home/Location';
import NotFound from '../components/NotFound';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import '../styles/home.css';

const Home = () => {
    const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);
    const [showTopHeader, setShowTopHeader] = useState(true);
    const [headerFixed, setHeaderFixed] = useState(false);

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
            <Box sx={{ position: 'relative' }}>
                {showTopHeader && <TopHeader />}
                <Header isFixed={headerFixed} />
            </Box>

            <Container sx={{ position: 'relative', marginX: 'auto' }}>
                <Routes>
                    <Route path="/" element={<HomeContent />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/online-booking" element={<OnlineBooking />} />
                    <Route path="/location" element={<Location />} />
                    <Route path="/home" element={<HomeContent />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
            </Container>

            {showScrollToTopButton && (
                <IconButton
                    size="large"
                    aria-label="scroll back to top"
                    color="primary"
                    sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 100 }}
                    onClick={() => window.scrollTo(0, 0)}
                >
                    <FontAwesomeIcon icon={faArrowAltCircleUp} />
                </IconButton>
            )}
        </>
    );
};

export default Home;
