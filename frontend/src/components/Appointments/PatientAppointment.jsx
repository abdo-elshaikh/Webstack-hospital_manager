import { Modal, Button, Form, Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { createAppointment, getAppointmentsByPatient, deleteAppointment, changeAppointmentStatus } from '../../services/appointmentService';
import { getServicesByDepartment } from '../../services/priceService';
import { getStaffByDepartment } from '../../services/staffService';
import { getAllDepartments } from '../../services/departmentService';
import { useParams } from 'react-router-dom';

const PatientAppointment = () => {
    const { id: patientId } = useParams();
    const [show, setShow] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [services, setServices] = useState([]);
    const [staff, setStaff] = useState([]);
    const [patientAppointments, setPatientAppointments] = useState([]);
    const [appointment, setAppointment] = useState({
        patient: patientId,
        department: '',
        service: '',
        staff: '',
        date: '',
        status: 'pending'
    });

    useEffect(() => {
        const fetchDepartments = async () => {
            const data = await getAllDepartments();
            if (data.error) {
                toast.error(data.error);
            } else {
                setDepartments(data.departments);
            }
        };

        const fetchAppointments = async () => {
            const data = await getAppointmentsByPatient(patientId);
            if (data.error) {
                toast.error(data.error);
            } else {
                setPatientAppointments(data.appointments);
                console.log(data.appointments)
            }
        };

        fetchDepartments();
        fetchAppointments();
    }, [patientId]);

    const handleDepartmentChange = async (e) => {
        const departmentId = e.target.value;
        const serviceData = await getServicesByDepartment(departmentId);
        const staffData = await getStaffByDepartment(departmentId);

        if (serviceData.error || staffData.error) {
            toast.error(serviceData.error || staffData.error);
        } else {
            setServices(serviceData.services);
            setStaff(staffData.staff);
            setAppointment({ ...appointment, department: departmentId });
        }
    };

    const handleDeleteAppointment = async (id) => {
        const data = await deleteAppointment(id);
        if (data.error) {
            toast.error(data.error);
        } else {
            toast.success('Appointment deleted successfully');
            setPatientAppointments(patientAppointments.filter(appointment => appointment._id !== id));
        }
    };

    const handleStatusAppointment = async (id, status) => {
        const allStatus = ['pending', 'in progress', 'completed'];
        const index = allStatus.indexOf(status);
        const newStatus = index === 2 ? null : allStatus[index + 1];
        if (newStatus) {
            const data = await changeAppointmentStatus(id, newStatus);
            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success('Appointment status changed successfully');
                const updatedAppointment = data.appointment;
                const updatedAppointments = patientAppointments.map(appointment => 
                    appointment._id === id ? updatedAppointment : appointment
                );
                setPatientAppointments(updatedAppointments);
            }
        }
    };

    const handleChange = (e) => {
        setAppointment({ ...appointment, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await createAppointment(appointment);
        if (data.error) {
            toast.error(data.error);
        } else {
            toast.success('Appointment created successfully');
            setPatientAppointments([...patientAppointments, data.appointment]);
            setShow(false);
        }
    };

    return (
        <div>
            <Button variant="primary" onClick={() => setShow(true)}>
                Add New Appointment
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Service</th>
                        <th>Staff</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {patientAppointments.map(appointment => (
                        <tr key={appointment._id}>
                            <td>{appointment.department.name}</td>
                            <td>{appointment.service.service}</td>
                            <td>{appointment.staff.name}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.status}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleStatusAppointment(appointment._id, appointment.status)}>Change Status</Button>
                                <Button variant="danger" onClick={() => handleDeleteAppointment(appointment._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="department">
                            <Form.Label>Department</Form.Label>
                            <Form.Control as="select" name="department" onChange={handleDepartmentChange} value={appointment.department}>
                                <option value="">Select Department</option>
                                {departments.map(department => (
                                    <option key={department._id} value={department._id}>{department.department}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="service">
                            <Form.Label>Service</Form.Label>
                            <Form.Control as="select" name="service" onChange={handleChange} value={appointment.service}>
                                <option value="">Select Service</option>
                                {services.map(service => (
                                    <option key={service._id} value={service._id}>{service.service}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="staff">
                            <Form.Label>Staff</Form.Label>
                            <Form.Control as="select" name="staff" onChange={handleChange} value={appointment.staff}>
                                <option value="">Select Staff</option>
                                {staff.map(staff => (
                                    <option key={staff._id} value={staff._id}>{staff.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="date">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" name="date" onChange={handleChange} value={appointment.date} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </div>
    );
}

export default PatientAppointment;
