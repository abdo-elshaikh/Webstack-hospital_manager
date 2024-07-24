import { Modal, Button, Form, Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import {
    getAppointments,
    updateAppointment,
    createAppointment,
    deleteAppointment,
    changeAppointmentStatus
} from '../../services/appointmentService';
import { getPatients } from '../../services/PatientService';
import { getServicesByDepartment } from '../../services/priceService';
import { getStaffByDepartment } from '../../services/staffService';
import { getAllDepartments } from '../../services/departmentService';
import '../../styles/appointments.css';
import { Link } from 'react-router-dom';

const Appointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('create');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [patients, setPatients] = useState([]);
    const [services, setServices] = useState([]);
    const [staff, setStaff] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [formData, setFormData] = useState({
        patient: '',
        department: '',
        service: '',
        staff: '',
        date: '',
        status: ''
    });

    useEffect(() => {
        loadAppointments();
        loadPatients();
        loadDepartments();
    }, []);

    const loadAppointments = async () => {
        getAppointments().then((data) => {
            if(data.error) {
                toast.error(data.error);
                } else {
                    setAppointments(data.appointments);
            }
        })
    };

    const loadPatients = async () => {
        getPatients().then((data) => {
            if(data.error) {
                toast.error(data.error);
                } else {
                    setPatients(data.patients);
            }
    });
    };

    const loadDepartments = async () => {
        getAllDepartments().then((data) => {
            if(data.error) {
                toast.error(data.error);
                } else {
                    setDepartments(data.departments);
            }
        })
    };

    const handleDepartmentChange = async (e) => {
        const departmentId = e.target.value;
        setFormData(prevData => ({ ...prevData, department: departmentId }));
        try {
            const servicesData = await getServicesByDepartment(departmentId);
            if (servicesData.services) {
                setServices(servicesData.services);
            } else {
                toast.error(servicesData.message);
            }

            const staffData = await getStaffByDepartment(departmentId);
            if (staffData.staff) {
                const staffs = staffData.staff;
                staffs.map((s) => {
                    s.name = s.user.name;
                })
                setStaff(staffs);
            } else {
                toast.error(staffData.message);
            }
        } catch (error) {
            toast.error(`Error fetching services or staff: ${error.message}`);
        }
    };

    const handleModalOpen = (type, appointment) => {
        setModalType(type);
        setSelectedAppointment(appointment || null);
        setShowModal(true);

        if (type === 'update' && appointment) {
            setFormData({
                patient: appointment.patient,
                department: appointment.department,
                service: appointment.service,
                staff: appointment.staff,
                date: new Date(appointment.date).toISOString().slice(0, 16),
                status: appointment.status
            });
        } else if (type === 'create') {
            setFormData({
                patient: '',
                department: '',
                service: '',
                staff: '',
                date: '',
                status: ''
            });
        }
    };

    const handleModalClose = () => setShowModal(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'create') {
                await createAppointment(formData);
                toast.success('Appointment created successfully');
            } else if (modalType === 'update' && selectedAppointment) {
                await updateAppointment(selectedAppointment._id, formData);
                toast.success('Appointment updated successfully');
            }
            loadAppointments();
            handleModalClose();
        } catch (error) {
            toast.error('Error creating/updating appointment');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteAppointment(id);
            toast.success('Appointment deleted successfully');
            loadAppointments();
        } catch (error) {
            toast.error('Error deleting appointment');
        }
    };

    const handleChangeStatus = async (id, status) => {
        try {
            await changeAppointmentStatus(id, status);
            toast.success('Appointment status updated successfully');
            loadAppointments();
        } catch (error) {
            toast.error('Error changing appointment status');
        }
    };

    return (
        <div>
            <h1>Appointments</h1>
            <Button onClick={() => handleModalOpen('create')}>Create Appointment</Button>
            <div className="appointment-list">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Department</th>
                            <th>Service</th>
                            <th>Staff</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments?.map(appointment => (
                            <tr key={appointment._id}>
                                <td>{appointment.patient?.name}</td>
                                <td>{appointment.department?.name}</td>
                                <td>{appointment.service?.service}</td>
                                <td>{appointment.staff?.name}</td>
                                <td>{new Date(appointment.date).toLocaleString()}</td>
                                <td>{appointment.status}</td>
                                <td>
                                    <Button onClick={() => handleModalOpen('update', appointment)}>Edit</Button>
                                    <Button onClick={() => handleDelete(appointment._id)}>Delete</Button>
                                    <Button onClick={() => handleChangeStatus(appointment._id, appointment.status)}>Change Status</Button>
                                    <Link to={`/appointment/${appointment._id}`}>View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Modal for Create/Update Appointment */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'create' ? 'Create Appointment' : 'Update Appointment'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formPatient">
                            <Form.Label>Patient</Form.Label>
                            <Form.Control
                                as="select"
                                name="patient"
                                value={formData.patient}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Patient</option>
                                {patients.map(patient => (
                                    <option key={patient._id} value={patient._id}>{patient.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formDepartment">
                            <Form.Label>Department</Form.Label>
                            <Form.Control
                                as="select"
                                name="department"
                                value={formData.department}
                                onChange={handleDepartmentChange}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments?.map(department => (
                                    <option key={department._id} value={department._id}>{department.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formService">
                            <Form.Label>Service</Form.Label>
                            <Form.Control
                                as="select"
                                name="service"
                                value={formData.service}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Service</option>
                                {services?.map(service => (
                                    <option key={service._id} value={service._id}>{service.service}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formStaff">
                            <Form.Label>Staff</Form.Label>
                            <Form.Control
                                as="select"
                                name="staff"
                                value={formData.staff}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Staff</option>
                                {staff.map(staffMember => (
                                    <option key={staffMember._id} value={staffMember._id}>{staffMember.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {modalType === 'create' ? 'Create Appointment' : 'Update Appointment'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default Appointment;
