// src/components/Header.jsx
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import '../styles/header.css';

const Header = ({ currentUser, handleLogout, isLogedIn }) => {
    const navigate = useNavigate();
    const handleLogoutClick = () => {
        handleLogout();
        navigate('/login');
    }

    return (
        <header className="header">
            <Navbar bg="light" expand="lg">
                <Navbar.Brand as={Link} to="/">H S I</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        {isLogedIn ? (
                            <>
                                {currentUser?.role === 'admin' ?
                                    <>
                                        <NavDropdown title="Admin" id="basic-nav-dropdown">
                                            <NavDropdown.Item as={Link} to="/admin/users">Users</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/admin/departments">Departments</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/admin/staff">Staff</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/admin/positions">Positions</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/admin/appointments">Appointments</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/admin/patients">Patients</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/admin/services">Services</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/admin/permissions">Permissions</NavDropdown.Item>
                                        </NavDropdown>
                                    </>
                                    :
                                    <>
                                    {currentUser?.role === 'staff' ?
                                        <>
                                            <NavDropdown title="Staff" id="basic-nav-dropdown">
                                                <NavDropdown.Item as={Link} to="/staff/appointments">Appointments</NavDropdown.Item>
                                                <NavDropdown.Item as={Link} to="/staff/services">Services</NavDropdown.Item>
                                                <NavDropdown.Item as={Link} to="/staff/patients">Patients</NavDropdown.Item>
                                            </NavDropdown>
                                        </>
                                        : null 
                                    }
                                    </>
                                }
                                <Nav.Link as={Link} to={'/profile'}>Profile</Nav.Link>
                                <Nav.Link as={Button} variant="link" onClick={handleLogoutClick}>Logout</Nav.Link>

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

export default Header;
