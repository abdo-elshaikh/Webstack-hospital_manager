import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../styles/staff.css';

const StaffNav = ({ isMenuOpen, toggleMenu, isMobile }) => {

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                if (isMenuOpen) toggleMenu(); // Close the menu when screen size is larger
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen, toggleMenu]);

    return (
        <>
            <Navbar className={`navbar ${isMenuOpen ? 'd-flex' : 'd-none'} ${isMobile ? 'mobile-nav' : ''}`}>
                <Container className="d-flex flex-column w-100" fluid>
                    <Navbar.Brand as={Link} to="/staff" className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faUser} />
                        {!isMobile && <span className="ml-2">Staff</span>}
                    </Navbar.Brand>
                    {/* Add more menu items as needed */}
                    <Navbar.Brand as={Link} to="/staff" className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faUser} />
                        {!isMobile && <span className="ml-2">Staff</span>}
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </>
    );
};

export default StaffNav;
