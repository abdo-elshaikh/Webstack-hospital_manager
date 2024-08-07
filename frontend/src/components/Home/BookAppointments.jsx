import { useState, useEffect } from 'react';
import { Button, Container, Form, FormControl, FormSelect, FormGroup, FormLabel, Row, Col } from 'react-bootstrap';
import { bookAppointment } from '../../services/bookingService';
import { getAllDepartments } from '../../services/departmentService';
import { getServicesByDepartment } from '../../services/priceService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../styles/home.css';

const BookAppointments = ({ user }) => {
    const emptyAppointment = {
        user: user,
        department: '',
        service: '',
        name: '',
        age: '',
        phone: '',
        address: '',
        reason: '',
    };
    const serviceSelected = document.getElementById('service');
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [services, setServices] = useState([]);
    const [appointment, setAppointment] = useState(emptyAppointment);
    const [servicePrice, setservicePrice] = useState('');

    const handleAppointment = (e) => {
        const { name, value } = e.target;
        setAppointment({ ...appointment, [name]: value });
    };

    const handleAppointmentSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to book an appointment or register!');
            navigate('/login');
        } else {
            bookAppointment(appointment).then((data) => {
                if (data.error) {
                    toast.error(data.error);
                } else {
                    toast.success("Appointment booked successfully! We will contact you soon.");
                    setAppointment(emptyAppointment);
                }
            });
        }
    };

    useEffect(() => {
        getAllDepartments().then((data) => {
            if (data.error) {
                toast.error(data.error);
            } else {
                setDepartments(data.departments);
            }
        });
    }, []);

    const handleDepartmentChange = async (departmentId) => {
        setAppointment({ ...appointment, department: departmentId });
        getServicesByDepartment(departmentId).then((data) => {
            if (data.error) {
                toast.error(data.error);
                setServices([]);
                serviceSelected.setAttribute('disabled');
            } else {
                setServices(data.services);
                serviceSelected.removeAttribute('disabled');
            }
        });
    };

    const handelServiceChange = async (serviceId) => {
        // console.log(service)
        setAppointment({...appointment, service: serviceId});
        setservicePrice(
            services.find((service) => service._id === serviceId)?.price || '0'
        );
    }

    return (
        <Container className="book-appointments-section text-center">
            <h2 className="section-title">Book Appointment</h2>
            <Row>
                <Col md={6} className="form-column">
                    <Form onSubmit={handleAppointmentSubmit}>
                        <FormGroup className="mb-3">
                            <FormLabel>Department</FormLabel>
                            <FormSelect
                                name="department"
                                onChange={(e) => handleDepartmentChange(e.target.value)}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments &&
                                    departments.map((department) => (
                                        <option key={department._id} value={department._id}>
                                            {department.name}
                                        </option>
                                    ))}
                            </FormSelect>
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <FormLabel>Service</FormLabel>
                            <FormSelect
                                name="service"
                                onChange={(e) => handelServiceChange(e.target.value)}
                                id="service"
                                disabled
                                required
                            >
                                <option value="">Select Service</option>
                                {services &&
                                    services.map((service) => (
                                        <option key={service._id} value={service._id}>
                                            {service.service}
                                        </option>
                                    ))}
                            </FormSelect>
                            <label id='service-price'>Price ${servicePrice}</label>
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <FormLabel>Name</FormLabel>
                            <FormControl type="text" name="name" onChange={handleAppointment} required />
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <FormLabel>Age</FormLabel>
                            <FormControl type="number" name="age" onChange={handleAppointment} required />
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <FormLabel>Phone</FormLabel>
                            <FormControl type="text" name="phone" onChange={handleAppointment} required />
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <FormLabel>Address</FormLabel>
                            <FormControl type="text" name="address" onChange={handleAppointment} required />
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <FormLabel>Reason</FormLabel>
                            <FormControl type="text" name="reason" onChange={handleAppointment} required />
                        </FormGroup>
                        <Button type="submit" className="btn btn-primary w-100">
                            Book Appointment
                        </Button>
                    </Form>
                </Col>
                <Col md={6} className="d-none d-md-block">
                    <img src="/book.png" alt="Booking Illustration" className="img-fluid" />
                </Col>
            </Row>
        </Container>
    );
};

export default BookAppointments;
