// src/components/AdminPanel.jsx
import React from 'react';
import { Navbar, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faCalendarCheck, faUsers, faBuilding, faBriefcase, faConciergeBell, faUserMd, faProcedures, faClipboardList } from '@fortawesome/free-solid-svg-icons';

const AdminPanel = ({ isSliderOpen, toggleSidebar }) => {
    const renderTooltip = (label) => (
        <Tooltip id="button-tooltip">
            {label}
        </Tooltip>
    );

    return (
        <div className={`admin-panel ${isSliderOpen ? 'sidebar-open' : 'sidebar-closed'} col-md-2`}>
            <Navbar bg="dark" variant="dark" expand="lg" className="flex-md-column">
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleSidebar} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="flex-column">
                        <OverlayTrigger placement="right" overlay={renderTooltip('Users')}>
                            <Nav.Link as={Link} to="/admin/users">
                                <FontAwesomeIcon icon={faUsers} />
                                {isSliderOpen && <span> Users</span>}
                            </Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement="right" overlay={renderTooltip('Departments')}>
                            <Nav.Link as={Link} to="/admin/departments">
                                <FontAwesomeIcon icon={faBuilding} />
                                {isSliderOpen && <span> Departments</span>}
                            </Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement="right" overlay={renderTooltip('Services')}>
                            <Nav.Link as={Link} to="/admin/services">
                                <FontAwesomeIcon icon={faConciergeBell} />
                                {isSliderOpen && <span> Services</span>}
                            </Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement="right" overlay={renderTooltip('Positions')}>
                            <Nav.Link as={Link} to="/admin/positions">
                                <FontAwesomeIcon icon={faBriefcase} />
                                {isSliderOpen && <span> Positions</span>}
                            </Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement="right" overlay={renderTooltip('Staff')}>
                            <Nav.Link as={Link} to="/admin/staff">
                                <FontAwesomeIcon icon={faUserMd} />
                                {isSliderOpen && <span> Staff</span>}
                            </Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement="right" overlay={renderTooltip('Patients')}>
                            <Nav.Link as={Link} to="/admin/patients">
                                <FontAwesomeIcon icon={faProcedures} />
                                {isSliderOpen && <span> Patients</span>}
                            </Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement="right" overlay={renderTooltip('Appointments')}>
                            <Nav.Link as={Link} to="/admin/appointments">
                                <FontAwesomeIcon icon={faClipboardList} />
                                {isSliderOpen && <span> Appointments</span>}
                            </Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement="right" overlay={renderTooltip('Booking')}>
                            <Nav.Link as={Link} to="/admin/booking">
                                <FontAwesomeIcon icon={faCalendarCheck} />
                                {isSliderOpen && <span> Booking</span>}
                            </Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement="right" overlay={renderTooltip('Exit')}>
                            <Nav.Link as={Link} to="/">
                                <FontAwesomeIcon icon={faSignOutAlt} />
                                {isSliderOpen && <span> Exit</span>}
                            </Nav.Link>
                        </OverlayTrigger>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

export default AdminPanel;
