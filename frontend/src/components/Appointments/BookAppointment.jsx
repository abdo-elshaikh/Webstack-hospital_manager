import React, { useState, useEffect } from 'react';
import {
    Container, Button, TextField, FormControl, InputLabel, Select,
    MenuItem, Table, TableHead, TableBody, TableCell, TableRow,
    TableSortLabel, TablePagination, Paper, Modal, Box, Typography
} from '@mui/material';
import { toast } from 'react-toastify';
import { createAppointment } from '../../services/appointmentService';
import { getAllBooks, getBookingBetweenDate } from '../../services/bookingService';
import { getPatientByName, createPatient } from '../../services/PatientService';
import 'react-toastify/dist/ReactToastify.css';

const BookAppointment = () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [bookings, setBookings] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [patients, setPatients] = useState([]);
    const [newPatient, setNewPatient] = useState({
        code: '', name: '', age: '', phone: '', address: '', created_by: currentUser._id
    });
    const [appointment, setAppointment] = useState({
        patient: '', reason: '', department: '', service: '', staff: '', status: 'pending', date: ''
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        fetchAllBookings();
    }, [page, rowsPerPage, order, orderBy]);

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
        setModalType(type);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalType('');
    };

    const handlePatientChange = (e) => {
        const { name, value } = e.target;
        setNewPatient({ ...newPatient, [name]: value });
    };

    const handleAppointmentChange = (e) => {
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
                handleShowModal('appointment');
            }
        } catch (error) {
            toast.error('Error creating patient');
        }
    };

    const handleSelectBooking = async (booking) => {
        try {
            const data = await getPatientByName(booking.name);
            if (data.error) {
                toast.error(`Patient not found. Please create a new patient for ${booking.name}`);
                setNewPatient({
                    ...newPatient,
                    name: booking.name,
                    phone: booking.phone,
                    address: booking.address,
                    age: booking.age
                });
                handleShowModal('patient');
            } else {
                setPatients(data.patients);
                setAppointment({
                    ...appointment,
                    department: booking.department,
                    service: booking.service,
                    reason: booking.reason,
                    status: 'pending'
                });
                handleShowModal('appointment');
            }
        } catch (error) {
            toast.error('Error fetching patient');
        }
    };

    const handleAppointmentSubmit = async (e) => {
        e.preventDefault();
        if (!appointment.patient) {
            toast.error('Please select a patient');
            return;
        }
        try {
            const data = await createAppointment(appointment);
            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success(data.message);
                handleCloseModal();
                setAppointment({
                    patient: '', reason: '', department: '', service: '', staff: '',
                    status: 'pending', date: ''
                });
                fetchAllBookings();
            }
        } catch (error) {
            toast.error('Error creating appointment');
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(bookings.map((booking) => booking._id));
        } else {
            setSelected([]);
        }
    };

    const handleClick = (id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const sortedBookings = bookings.sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <Container className="appointments" maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Book Appointment
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Button variant="contained" color="primary" onClick={() => handleShowModal('patient')}>
                    Add Patient
                </Button>
                <Button variant="contained" color="primary" onClick={() => handleShowModal('appointment')}>
                    Book Appointment
                </Button>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <TextField
                    type="date"
                    label="Start Date"
                    variant="outlined"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mr: 2 }}
                />
                <TextField
                    type="date"
                    label="End Date"
                    variant="outlined"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mr: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleSearch}>
                    Search
                </Button>
            </Box>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <input type="checkbox" onChange={handleSelectAllClick} />
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('name')}
                                >
                                    Patient
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'department'}
                                    direction={orderBy === 'department' ? order : 'asc'}
                                    onClick={() => handleRequestSort('department')}
                                >
                                    Department
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'service'}
                                    direction={orderBy === 'service' ? order : 'asc'}
                                    onClick={() => handleRequestSort('service')}
                                >
                                    Service
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'date'}
                                    direction={orderBy === 'date' ? order : 'asc'}
                                    onClick={() => handleRequestSort('date')}
                                >
                                    Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'asc'}
                                    onClick={() => handleRequestSort('status')}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((booking) => (
                            <TableRow
                                key={booking._id}
                                onClick={() => handleClick(booking._id)}
                                selected={selected.indexOf(booking._id) !== -1}
                            >
                                <TableCell padding="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selected.indexOf(booking._id) !== -1}
                                    />
                                </TableCell>
                                <TableCell>{booking.patient?.name}</TableCell>
                                <TableCell>{booking.department?.name}</TableCell>
                                <TableCell>{booking.service?.name}</TableCell>
                                <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                                <TableCell>{booking.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={bookings.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Modal for creating a new patient */}
            <Modal open={showModal && modalType === 'patient'} onClose={handleCloseModal}>
                <Box className="modal-box">
                    <Typography variant="h6" gutterBottom>
                        Add New Patient
                    </Typography>
                    <form onSubmit={handleCreateNewPatient}>
                        <TextField
                            label="Name"
                            name="name"
                            variant="outlined"
                            value={newPatient.name}
                            onChange={handlePatientChange}
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Phone"
                            name="phone"
                            variant="outlined"
                            value={newPatient.phone}
                            onChange={handlePatientChange}
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Age"
                            name="age"
                            variant="outlined"
                            value={newPatient.age}
                            onChange={handlePatientChange}
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Address"
                            name="address"
                            variant="outlined"
                            value={newPatient.address}
                            onChange={handlePatientChange}
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                        />
                        <Button variant="contained" color="primary" type="submit">
                            Create Patient
                        </Button>
                    </form>
                </Box>
            </Modal>

            {/* Modal for booking an appointment */}
            <Modal open={showModal && modalType === 'appointment'} onClose={handleCloseModal}>
                <Box className="modal-box">
                    <Typography variant="h6" gutterBottom>
                        Book Appointment
                    </Typography>
                    <form onSubmit={handleAppointmentSubmit}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="patient-label">Patient</InputLabel>
                            <Select
                                labelId="patient-label"
                                name="patient"
                                value={appointment.patient}
                                onChange={handleAppointmentChange}
                                required
                            >
                                {patients.map((patient) => (
                                    <MenuItem key={patient._id} value={patient._id}>
                                        {patient.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="department-label">Department</InputLabel>
                            <Select
                                labelId="department-label"
                                name="department"
                                value={appointment.department}
                                onChange={handleAppointmentChange}
                                required
                            >
                                {/* Map department options here */}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="service-label">Service</InputLabel>
                            <Select
                                labelId="service-label"
                                name="service"
                                value={appointment.service}
                                onChange={handleAppointmentChange}
                                required
                            >
                                {/* Map service options here */}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Reason"
                            name="reason"
                            variant="outlined"
                            value={appointment.reason}
                            onChange={handleAppointmentChange}
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Date"
                            type="date"
                            name="date"
                            variant="outlined"
                            value={appointment.date}
                            onChange={handleAppointmentChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            required
                            sx={{ mb: 2 }}
                        />
                        <Button variant="contained" color="primary" type="submit">
                            Book Appointment
                        </Button>
                    </form>
                </Box>
            </Modal>
        </Container>
    );
};

export default BookAppointment;
