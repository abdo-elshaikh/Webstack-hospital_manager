import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { getAppointments, deleteAppointment, changeAppointmentStatus } from '../../services/appointmentService';
import AppointmentForm from './AppointmentForm'; // Assume you have an AppointmentForm component
import { getAllDepartments } from '../../services/departmentService';

const Appointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [searchDate, setSearchDate] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortColumn, setSortColumn] = useState('date');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [modalMode, setModalMode] = useState('create');
    const [searchResults, setSearchResults] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        loadAppointments();
        loadDepartments();
    }, []);

    const loadAppointments = async () => {
        try {
            const data = await getAppointments();
            if (data.error) {
                toast.error(data.error);
            } else {
                let filteredAppointments = data.appointments;

                // Apply filters
                if (searchDate) {
                    filteredAppointments = filteredAppointments.filter(appointment =>
                        new Date(appointment.date).toDateString() === new Date(searchDate).toDateString()
                    );
                }

                if (filterDepartment) {
                    filteredAppointments = filteredAppointments.filter(appointment =>
                        appointment.department?._id === filterDepartment
                    );
                }

                if (filterStatus) {
                    filteredAppointments = filteredAppointments.filter(appointment =>
                        appointment.status === filterStatus
                    );
                }

                // Apply sorting
                filteredAppointments = filteredAppointments.sort((a, b) => {
                    if (sortColumn === 'date') {
                        return sortDirection === 'asc'
                            ? new Date(a.date) - new Date(b.date)
                            : new Date(b.date) - new Date(a.date);
                    }
                    return 0;
                });
                console.log('filteredAppointments', filteredAppointments);
                // Update state
                setAppointments(filteredAppointments);
                setSearchResults(filteredAppointments);
            }
        } catch (error) {
            toast.error(`Error loading appointments: ${error.message}`);
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

    const handleSort = (column) => {
        const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(newDirection);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleModalOpen = (mode, appointment = null) => {
        setModalMode(mode);
        setCurrentAppointment(appointment);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setCurrentAppointment(null);
    };

    const handleDelete = async (id) => {
        try {
            const result = await deleteAppointment(id);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Appointment deleted successfully');
                loadAppointments();
            }
        } catch (error) {
            toast.error(`Error deleting appointment: ${error.message}`);
        }
    };

    const handleChangeStatus = async (id, status) => {
        try {
            const result = await changeAppointmentStatus(id, status);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Appointment status updated successfully');
                loadAppointments();
            }
        } catch (error) {
            toast.error(`Error changing appointment status: ${error.message}`);
        }
    };

    const handleSearch = () => {
        if (searchDate || filterDepartment || filterStatus) {
            
            const filteredAppointments = appointments.filter(appointment => {
                if (searchDate) {
                    console.log('searchDate', new Date(searchDate).toLocaleDateString(), 'appointment.date', new Date(appointment.date).toLocaleDateString());
                    return new Date(appointment.date).toDateString() === new Date(searchDate).toDateString();
                }
                if (filterDepartment) {
                    return appointment.department?._id === filterDepartment;
                }
                if (filterStatus) {
                    return appointment.status === filterStatus;
                }
                return true;
            });
            setSearchResults(filteredAppointments);
        } else {
            loadAppointments();
        }
    };

    const handleViewAppointment = (appointment) => {
        navigate('/admin/appointments/view', { state: { appointment } });
    };


    return (
        <Box component={Paper} p={2} sx={{ width: '100%', bgcolor: 'background.paper', }} >
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleModalOpen('create')}
                sx={{ mb: 2 }}
                disabled
            >
                Create Appointment
            </Button>
            {/* Search and Filters */}
            <Box display='flex' justifyContent='space-between' alignItems='center' gap={2} mb={2} sx={{ width: '100%', mb: 2 }}>
                <TextField
                    label="Search by Date"
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Filter by Department</InputLabel>
                    <Select
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>All Departments</em>
                        </MenuItem>
                        {departments.map((department) => (
                            <MenuItem key={department._id} value={department._id}>
                                {department.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Filter by Status</InputLabel>
                    <Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>All Statuses</em>
                        </MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="in progress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="canceled">Canceled</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    sx={{ mb: 2 }}
                >
                    Search
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={() => handleSort('index')}>#</TableCell>
                            <TableCell onClick={() => handleSort('patient')}>Patient</TableCell>
                            <TableCell onClick={() => handleSort('department')}>Department</TableCell>
                            <TableCell onClick={() => handleSort('service')}>Service</TableCell>
                            <TableCell onClick={() => handleSort('staff')}>Staff</TableCell>
                            <TableCell onClick={() => handleSort('date')}>Date</TableCell>
                            <TableCell onClick={() => handleSort('status')}>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {searchResults.length > 0 ? searchResults
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
                                        <IconButton sx={{ mr: 1 }} onClick={() => handleDelete(appointment._id)}>
                                            <Delete />
                                        </IconButton>
                                        <IconButton onClick={() => handleViewAppointment(appointment)}>
                                            <Visibility />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )) : (
                            <TableRow>
                                <TableCell colSpan={8}>No appointments found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={appointments.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {/* Modal for Create/Update Appointment */}
            <Dialog open={showModal} onClose={handleModalClose}>
                <DialogTitle>{modalMode === 'create' ? 'Create Appointment' : 'Update Appointment'}</DialogTitle>
                <DialogContent>
                    <AppointmentForm
                        mode={modalMode}
                        appointment={currentAppointment}
                        onClose={handleModalClose}
                        onRefresh={loadAppointments}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default Appointment;
