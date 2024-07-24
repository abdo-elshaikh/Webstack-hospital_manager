// src/components/Header.jsx
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import '../styles/header.css';

const Header = ({ isLogged, currentUser, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const handleLogoutNav = () => {
        onLogout();
        navigate('/login');
    }

    return (
        <header className="header">
            <Navbar bg="light" expand="lg">
                <Navbar.Brand as={Link} to="/">H S I</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleMenu} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        {isLogged ? (
                            <>
                                {currentUser.role === 'admin' && (
                                    <NavDropdown
                                        title="Admin"
                                        id="basic-nav-dropdown"
                                        className="nav-link">
                                        <NavDropdown.Item as={Link} to={`/profile/${currentUser._id}`}>Profile</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/admin/users">Users</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/admin/departments">Departments</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/admin/staff">Staff</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/admin/positions">Positions</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/admin/appointments">Appointments</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/admin/services">Services</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/admin/permissions">Permissions</NavDropdown.Item>
                                    </NavDropdown>
                                )}
                                <Nav.Link className='nav-link logout' as={Button} variant="link" onClick={handleLogoutNav}>Logout</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </header>
    );
};

Header.propTypes = {
    currentUser: PropTypes.object,
    onLogout: PropTypes.func.isRequired,
    isLogged: PropTypes.bool.isRequired,
};

export default Header;
