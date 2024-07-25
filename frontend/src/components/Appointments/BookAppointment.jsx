import { Button, Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { Modal, Container, Form, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { createAppointment } from '../../services/appointmentService';
import { getAllBooks, getBookingBetweenDate } from '../../services/bookingService';
import { getPatientByName, createPatient } from '../../services/PatientService';
import '../../styles/appointments.css';

const BookAppointment = () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('patient');
    const [bookings, setBookings] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [patients, setPatients] = useState([]);
    // const [selectedBooking, setSelectedBooking] = useState(null);
    const [newPatient, setNewPatient] = useState({
        code: '',
        name: '',
        age: '',
        phone: '',
        address: '',
        created_by: currentUser._id
    });
    const [appointment, setAppointment] = useState({
        patient: '',
        reason: '',
        department: '',
        service: '',
        staff: '',
        status: 'pending',
        date: ''
    });

    useEffect(() => {
        fetchAllBookings();
    }, []);

    const fetchAllBookings = async () => {
        try {
            const data = await getAllBooks();
            if (data.error) {
                toast.error(data.error);
            } else {
                setBookings(data.appointments);
            }
        } catch (error) {
            toast.error('Error fetching bookings');
        }
    };

    const handleSearch = async () => {
        if (startDate && endDate) {
            try {
                const data = await getBookingBetweenDate(startDate, endDate);
                if (data.error) {
                    toast.error(data.error);
                } else {
                    setBookings(data.appointments);
                }
            } catch (error) {
                toast.error('Error searching bookings');
            }
        } else {
            fetchAllBookings();
            toast.error('Please select start date and end date');
        }
    };

    const handleShowModal = (type) => {
        setShowModal(true);
        setModalType(type);
    };

    const handlePatient = (e) => {
        const { name, value } = e.target;
        setNewPatient({ ...newPatient, [name]: value });
    };

    const handleAppointment = (e) => {
        const { name, value } = e.target;
        setAppointment({ ...appointment, [name]: value });
    };

    const handleCreateNewPatient = async (e) => {
        e.preventDefault();
        try {
            const data = await createPatient(newPatient);
            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success(data.message);
                setAppointment({ ...appointment, patient: data.patient._id });
                setModalType('appointment');
            }
        } catch (error) {
            toast.error('Error creating patient');
        }
    };

    const handleSelectBooking = async (e, booking) => {
        if (e.target.checked) {
            // setSelectedBooking(booking);
            try {
                const data = await getPatientByName(booking.name);
                if (data.error) {
                    toast.error(`Not Found Any Patient. Create New: ${booking.name}. Contact With Them to Complete Information: ${booking.phone}`);
                    setNewPatient({
                        ...newPatient,
                        name: booking.name,
                        phone: booking.phone,
                        address: booking.address,
                        age: booking.age
                    });
                    setModalType('patient');
                } else {
                    setPatients(data.patients);
                    setAppointment({
                        ...appointment,
                        department: booking.department,
                        service: booking.service,
                        reason: booking.reason,
                        status: 'pending'
                    });
                    setModalType('appointment');
                }
                setShowModal(true);
            } catch (error) {
                toast.error('Error fetching patient');
            }
        }
    };

    const handleAppointmentSubmit = async (e) => {
        e.preventDefault();
        if (!appointment.patient) {
            toast.error('Please select patient');
        }
        try {
            const data = await createAppointment(appointment);
            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success(data.message);
                setShowModal(false);
                setAppointment({
                    patient: '',
                    reason: '',
                    department: '',
                    service: '',
                    staff: '',
                    status: 'pending',
                    date: ''
                });
                // setSelectedBooking(null);
                fetchAllBookings();
            }
        } catch (error) {
            toast.error('Error creating appointment');
        }
    };

    return (
        <div className="appointments">
            <ToastContainer />
            <h1>Book Appointment</h1>
            <Button variant="primary" onClick={() => handleShowModal('patient')}>Add Patient</Button>
            <Button variant="primary" onClick={() => handleShowModal('appointment')}>Book Appointment</Button>
            <Container>
                <Row>
                    <Col>
                        <Form>
                            <Form.Group>
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control type="date" name="startDate" onChange={(e) => setStartDate(e.target.value)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>End Date</Form.Label>
                                <Form.Control type="date" name="endDate" onChange={(e) => setEndDate(e.target.value)} />
                            </Form.Group>
                            <Button variant="primary" onClick={handleSearch}>Search</Button>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Patient</th>
                                    <th>Department</th>
                                    <th>Service</th>
                                    <th>Age</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Reason</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings?.map((booking, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type='checkbox'
                                                onChange={(e) => handleSelectBooking(e, booking)}
                                            />
                                        </td>
                                        <td>{booking.name}</td>
                                        <td>{booking.department?.name}</td>
                                        <td>{booking.service?.service}</td>
                                        <td>{booking.age}</td>
                                        <td>{booking.phone}</td>
                                        <td>{booking.address}</td>
                                        <td>{booking.reason}</td>
                                        <td>{booking.createdAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'patient' ? 'Add Patient' : 'Book Appointment'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalType === 'patient' ? (
                        <Form onSubmit={handleCreateNewPatient} className="needs-validation" noValidate>
                            <Form.Group>
                                <Form.Label>Code</Form.Label>
                                <Form.Control type="number" name="code" value={newPatient.code} onChange={handlePatient} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="name" value={newPatient.name} onChange={handlePatient} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Age</Form.Label>
                                <Form.Control type="text" name="age" value={newPatient.age} onChange={handlePatient} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type="text" name="phone" value={newPatient.phone} onChange={handlePatient} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" name="address" value={newPatient.address} onChange={handlePatient} />
                            </Form.Group>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Form>
                    ) : (
                        <Form onSubmit={handleAppointmentSubmit}>
                            <Form.Group>
                                <Form.Label>Patient</Form.Label>
                                <Form.Control as="select" name="patient" value={appointment.patient} onChange={handleAppointment}>
                                    <option value="">Select Patient</option>
                                    {patients?.map((patient, index) => (
                                        <option key={index} value={patient._id}>{patient.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Reason</Form.Label>
                                <Form.Control type="text" name="reason" value={appointment.reason} onChange={handleAppointment} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Department</Form.Label>
                                <Form.Control type="text" name="department" value={appointment.department} onChange={handleAppointment} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Service</Form.Label>
                                <Form.Control type="text" name="service" value={appointment.service} onChange={handleAppointment} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Staff</Form.Label>
                                <Form.Control type="text" name="staff" value={appointment.staff} onChange={handleAppointment} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Date</Form.Label>
                                <Form.Control type="datetime-local" name="date" value={appointment.date} onChange={handleAppointment} />
                            </Form.Group>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default BookAppointment;
