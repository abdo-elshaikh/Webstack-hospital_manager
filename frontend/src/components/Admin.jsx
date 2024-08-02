import { useState, useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Row } from 'react-bootstrap';
import Users from './Users';
import Department from './Departments/Department';
import Position from './Positions/Position';
import Service from './Services/Service';
import Staff from './Staff/Staff';
import Patient from './Patients/Patient';
import Appointment from './Appointments/Appointment';
import BookAppointment from './Appointments/BookAppointment';
import PatientAppointment from './Appointments/PatientAppointment';

import NotFound from './NotFound';
import '../styles/admin.css';

const Admin = () => {
    const [isSliderOpen, setIsSliderOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setIsSliderOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="admin-container" >
            <div className='admin-header row'>
                <Navbar bg="dark" variant="dark" expand="lg" className={isSliderOpen ? 'sidebar-open' : 'sidebar-closed'}>
                    <Navbar.Brand href="#home">Admin Panel</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setIsSliderOpen(!isSliderOpen)} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link>
                            <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>
                            <Nav.Link as={Link} to="/admin/departments">Departments</Nav.Link>
                            <Nav.Link as={Link} to="/admin/services">Services</Nav.Link>
                            <Nav.Link as={Link} to="/admin/positions">Positions</Nav.Link>
                            <Nav.Link as={Link} to="/admin/staff">Staff</Nav.Link>
                            <Nav.Link as={Link} to="/admin/patients">Patients</Nav.Link>
                            <Nav.Link as={Link} to="/admin/appointments">Appointments</Nav.Link>
                            <Nav.Link as={Link} to="/admin/booking">Booking</Nav.Link>
                            <Nav.Link as={Link} to="/">Exit</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
            <Container className="main-content">
                <Routes>
                    <Route path="" element={
                        <div className='content'>
                            <h1>Welcome to Admin Panel</h1>
                            <p>Select a menu item to get started</p>
                        </div>
                    } />
                    <Route path="users" element={<Users />} />
                    <Route path="departments" element={<Department />} />
                    <Route path="services" element={<Service />} />
                    <Route path="positions" element={<Position />} />
                    <Route path="staff" element={<Staff />} />
                    <Route path="patients" element={<Patient />} />
                    <Route path="appointments" element={<Appointment />} />
                    <Route path="booking" element={<BookAppointment />} />
                    <Route path="appointments/patient/:id" element={<PatientAppointment />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Container>
        </div>
    );
};

export default Admin;
