import React, { useState, useEffect } from 'react';
import {
    Container,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Modal,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Paper,
    IconButton,
    TablePagination,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { toast } from 'react-toastify';
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
import { Link } from 'react-router-dom';
import '../../styles/appointments.css';

const Appointment = ({ open }) => {
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

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        loadAppointments();
        loadPatients();
        loadDepartments();
    }, []);

    const loadAppointments = async () => {
        try {
            const data = await getAppointments();
            if (data.error) {
                toast.error(data.error);
            } else {
                setAppointments(data.appointments);
            }
        } catch (error) {
            toast.error(`Error loading appointments: ${error.message}`);
        }
    };

    const loadPatients = async () => {
        try {
            const data = await getPatients();
            if (data.error) {
                toast.error(data.error);
            } else {
                setPatients(data.patients);
            }
        } catch (error) {
            toast.error(`Error loading patients: ${error.message}`);
        }
    };

    const loadDepartments = async () => {
        try {
            const data = await getAllDepartments();
            if (data.error) {
                toast.error(data.error);
            } else {
                setDepartments(data.departments);
            }
        } catch (error) {
            toast.error(`Error loading departments: ${error.message}`);
        }
    };

    const handleDepartmentChange = async (e) => {
        const departmentId = e.target.value;
        setFormData((prevData) => ({ ...prevData, department: departmentId }));

        try {
            const servicesData = await getServicesByDepartment(departmentId);
            if (servicesData.services) {
                setServices(servicesData.services);
            } else {
                toast.error(servicesData.message);
            }

            const staffData = await getStaffByDepartment(departmentId);
            if (staffData.staff) {
                const staffs = staffData.staff.map((s) => ({
                    ...s,
                    name: s.user.name,
                }));
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

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Container >
            <Button variant="contained" color="primary" onClick={() => handleModalOpen('create')}>
                Create Appointment
            </Button>
            <div className="appointment-list mt-3">
                <TableContainer >
                    <Table size="small" >
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Patient</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Service</TableCell>
                                <TableCell>Staff</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments.length > 0 ? appointments
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((appointment, index) => (
                                <TableRow key={appointment._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{appointment.patient?.name}</TableCell>
                                    <TableCell>{appointment.department?.name}</TableCell>
                                    <TableCell>{appointment.service?.service}</TableCell>
                                    <TableCell>{appointment.staff?.name}</TableCell>
                                    <TableCell>{new Date(appointment.date).toLocaleString()}</TableCell>
                                    <TableCell>{appointment.status}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleModalOpen('update', appointment)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(appointment._id)}>
                                            <Delete />
                                        </IconButton>
                                        <IconButton onClick={() => handleChangeStatus(appointment._id, appointment.status)}>
                                            <Visibility />
                                        </IconButton>
                                        <Button variant="contained" component={Link} to={`/appointment/${appointment._id}`}>
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : <TableRow><TableCell colSpan={7}>No appointments found</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* Pagination */}
                <TablePagination
                    component="div"
                    count={appointments.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>

            {/* Modal for Create/Update Appointment */}
            <Modal open={showModal} onClose={handleModalClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Paper className="modal-content">
                    <h2>{modalType === 'create' ? 'Create Appointment' : 'Update Appointment'}</h2>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Patient</InputLabel>
                            <Select
                                name="patient"
                                value={formData.patient}
                                onChange={handleInputChange}
                                required
                            >
                                <MenuItem value="">
                                    <em>Select Patient</em>
                                </MenuItem>
                                {patients.map((patient) => (
                                    <MenuItem key={patient._id} value={patient._id}>
                                        {patient.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Department</InputLabel>
                            <Select
                                name="department"
                                value={formData.department}
                                onChange={handleDepartmentChange}
                                required
                            >
                                <MenuItem value="">
                                    <em>Select Department</em>
                                </MenuItem>
                                {departments.map((department) => (
                                    <MenuItem key={department._id} value={department._id}>
                                        {department.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Service</InputLabel>
                            <Select
                                name="service"
                                value={formData.service}
                                onChange={handleInputChange}
                                required
                            >
                                <MenuItem value="">
                                    <em>Select Service</em>
                                </MenuItem>
                                {services.map((service) => (
                                    <MenuItem key={service._id} value={service._id}>
                                        {service.service}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Staff</InputLabel>
                            <Select
                                name="staff"
                                value={formData.staff}
                                onChange={handleInputChange}
                                required
                            >
                                <MenuItem value="">
                                    <em>Select Staff</em>
                                </MenuItem>
                                {staff.map((staffMember) => (
                                    <MenuItem key={staffMember._id} value={staffMember._id}>
                                        {staffMember.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Date"
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="canceled">Canceled</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" type="submit">
                            {modalType === 'create' ? 'Create' : 'Update'}
                        </Button>
                    </form>
                </Paper>
            </Modal>
        </Container>
    );
};

export default Appointment;
