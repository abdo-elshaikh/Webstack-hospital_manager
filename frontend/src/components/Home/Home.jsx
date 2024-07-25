import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import HeroSection from './HeroSection';
import Gallery from './Gallery';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import Location from './Location';
import BookAppointments from './BookAppointments';
import '../../styles/home.css';

const Home = ({ user, isLogged }) => {
    // console.log(user);

    const tapToTop = () => {
        window.scrollTo(0,0);
    }

    useEffect(() => {
        window.addEventListener('scroll', () => {
            const tapToTop = document.querySelector('.tap-to-top');
            const header = document.querySelector('.header');

            if (window.scrollY > 80) {
                header.classList.add('fixed');
            } else {
                header.classList.remove('fixed');
            }
            
            if (window.scrollY > 500) {
                tapToTop.classList.add('active');
            } else {
                tapToTop.classList.remove('active');
            }
        });
    }, []);


    return (
        <Container fluid className="home-container">
            <HeroSection user={user} isLogged={isLogged} />
            <AboutUs />
            <Gallery />
            <BookAppointments user={user}/>
            <ContactUs />
            <Location />
            <div className="tap-to-top" onClick={tapToTop}>
                <span className='tap-icon'>top</span>
            </div>
        </Container>
    );
};

export default Home;
