// src/components/AdminHeader.jsx
import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../../styles/admin.css';

const AdminHeader = ({ currentUser, isSliderOpen, toggleSidebar, isMobile }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleMenu = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="flex-md-column">
            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleSidebar} />
            <Navbar.Collapse id="basic-navbar-nav" onToggle={toggleMenu}>
                <Nav className="flex-row w-100 justify-content-between">
                    <Nav.Link as={Link} to="/admin">
                        <FontAwesomeIcon icon={faTachometerAlt} />
                        {isSliderOpen && <span> Dashboard</span>}
                    </Nav.Link>
                    <NavDropdown
                        title={currentUser?.name}
                        id="basic-nav-dropdown"
                        className={isCollapsed ? 'collapse' : ''}
                    >
                        <NavDropdown.Item as={Link} to="/profile">
                            <FontAwesomeIcon icon={faUser} />
                            {isSliderOpen && <span> Profile</span>}
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                toggleSidebar();
                                window.location.reload();
                            }}
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            {isSliderOpen && <span> Logout</span>}
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default AdminHeader;
