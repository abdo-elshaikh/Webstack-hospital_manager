// src/components/AdminHome.jsx
import React from 'react';
import { Card, CardGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Keep this import for routing

const AdminHome = () => {
    return (
        <div className='content'>
            <h1>Welcome to Admin Panel</h1>
            <p>Select a menu item to get started</p>
            <div className="dashboard-details">
                <CardGroup>
                    <Card>
                        <Card.Body>
                            <Card.Title>Users</Card.Title>
                            <Card.Text>View and manage users</Card.Text>
                            <Link to="/admin/users">
                                <Button variant="primary">View</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Title>Departments</Card.Title>
                            <Card.Text>View and manage departments</Card.Text>
                            <Link to="/admin/departments">
                                <Button variant="primary">View</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Title>Services</Card.Title>
                            <Card.Text>View and manage services</Card.Text>
                            <Link to="/admin/services">
                                <Button variant="primary">View</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </CardGroup>
                <CardGroup>
                    <Card>
                        <Card.Body>
                            <Card.Title>Positions</Card.Title>
                            <Card.Text>View and manage positions</Card.Text>
                            <Link to="/admin/positions">
                                <Button variant="primary">View</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Title>Staff</Card.Title>
                            <Card.Text>View and manage staff</Card.Text>
                            <Link to="/admin/staff">
                                <Button variant="primary">View</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Title>Patients</Card.Title>
                            <Card.Text>View and manage patients</Card.Text>
                            <Link to="/admin/patients">
                                <Button variant="primary">View</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </CardGroup>
            </div>
        </div>
    );
};

export default AdminHome;
