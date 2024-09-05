import { useState, useEffect } from 'react';
import {
    Container, Button, TextField, Select, Paper,
    MenuItem, Table, TableHead, TableBody, TableCell, TableRow,
    TableSortLabel, TablePagination, Box, Grid,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { Add, Search, Done, Cancel } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { createAppointment } from '../../services/appointmentService';
import { getAllBooks, updateBooking } from '../../services/bookingService';
import { getPatientByName, createPatient, getMaxCode, } from '../../services/PatientService';
import { getServicePriceByType } from '../../services/priceService';
import { getStaffByDepartment } from '../../services/staffService';
import useAuth from '../../contexts/useAuth';

const BookAppointment = () => {
    const { user: currentUser } = useAuth();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogPatient, setDialogPatient] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [bookinsResult, setBookingsResult] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState({});
    const [newPatient, setNewPatient] = useState({});
    const [appointment, setAppointment] = useState({});
    const [departmentStaff, setDepartmentStaff] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [selected, setSelected] = useState([]);

    const [dialogConfirmReject, setDialogConfirmReject] = useState(false);
    const [bookingId, setBookingId] = useState('');


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
    // Search bookings between dates
    const handleSearch = async () => {
        const filteredBookings = bookings.filter((booking) => {
            const bookingDate = new Date(booking.createdAt.split('T')[0]);
            const start = new Date(startDate.split('T')[0]);
            const end = new Date(endDate.split('T')[0]);
            return bookingDate >= start && bookingDate <= end;
        });
        // console.log(filteredBookings.length, 'filteredBookings', filteredBookings);
        setBookingsResult(filteredBookings);
    };

    const handleCreatePatient = async () => {
        try {
            const data = await createPatient(newPatient);
            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success('Patient created successfully');
                setNewPatient({ ...newPatient, code: data.code + 1 });
            }
        } catch (error) {
            toast.error('Error creating patient');
        }
    };

    const handleAddAppointment = async () => {
        if (!selectedPatient) {
            toast.error('Please select a patient');
            return;
        }
        setAppointment({ ...appointment, patient: selectedPatient });
        console.log('appointment to add', appointment);
        setDialogOpen(true);
    };


    // Handle select booking
    const handleSelectBooking = async (booking) => {
        console.log('booking', booking);
        if (!booking || !booking.name) {
            toast.error('Invalid booking data');
            return;
        }
        if (booking.status === 'accepted') {
            toast.error('Booking already accepted');
            return;
        }
        if (booking.status === 'rejected') {
            toast.error('Booking rejected by staff');
            return;
        }
        const service_price = await servicePrice(booking.service?._id, 'cash');
        console.log('service_price', service_price.price);
        // if (servicePrice) setAppointment({ ...appointment, price: Number(service_price?.price) });
        const staff = await staffSelection(booking.department?._id);
        console.log('staff', staff);
        if (staff) setDepartmentStaff(staff);
        setAppointment({
            ...appointment,
            bookingId: booking._id,
            department: booking.department,
            service: booking.service,
            price: Number(service_price?.price),
            serviceType: 'cash',
            reason: booking.reason,
            date: new Date(),
            status: 'pending',
            staff: '',

        })
        try {
            // check if patient exists for booking
            const data = await getPatientByName(booking.name);
            if (data.error) {
                toast.error(`Patient not found. Please create a new patient for ${booking.name}`);
                const { maxCode } = await getMaxCode();
                const newPatient = {
                    name: booking.name,
                    code: maxCode + 1,
                    age: booking.age,
                    gender: booking.gender,
                    phone: booking.phone,
                    address: booking.address,
                    created_by: currentUser._id
                }
                setNewPatient(newPatient);
                setDialogPatient(true);
                // handleAcceptBooking(booking._id);
            } else {
                toast.success(`Patients found for ${booking.name} , please select patient`);
                // console.log('data patients', data.patients);
                setPatients(data.patients);
                // focus on patient selection input field after selection 
                const patientSelect = document.getElementById('patient-select');
                if (patientSelect) {
                    patientSelect.classList.remove('Mui-disabled');
                    // patientSelect.value = data.patients[0]._id;
                    patientSelect.focus();
                    // patientSelect.style.borderBlockColor = 'green';
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred');
            }
        }
    };

    // Handle create new appointment
    const handleAppointmentSubmit = async () => {
        if (!appointment.patient || !selectedPatient) {
            toast.error('Please select a patient');
            return;
        }
        try {
            const data = await createAppointment(appointment);
            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success(data.message);
                handleAcceptBooking(appointment.bookingId, { status: 'accepted' });
                setSelectedPatient({});
                setDialogOpen(false);
                setAppointment({});
            }
        } catch (error) {
            toast.error('Error creating appointment');
        }
    };

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle sort by column 
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Handle select all
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(bookings.map((booking) => booking._id));
        } else {
            setSelected([]);
        }
    };

    // Handle row selection
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

    // Handle row selection
    const handleSelectClick = (event) => {
        const selectedIndex = selected.indexOf(event.target.value);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, event.target.value);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };
    // sort bookings based on selected column
    const sortBookings = (bookings) => {
        const sortedBookings = bookings?.sort((a, b) => {
            if (a[orderBy] < b[orderBy]) {
                return order === 'asc' ? -1 : 1;
            }
            if (a[orderBy] > b[orderBy]) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sortedBookings;
    }

    const servicePrice = async (serviceId, type) => {
        try {
            const response = await getServicePriceByType(serviceId, type);
            if (response.error) {
                toast.error(response.error);
            }
            return response.price;
        } catch (error) {
            console.log(error);
        }
    }

    const staffSelection = async (departmentId) => {
        try {
            const response = await getStaffByDepartment(departmentId);
            if (response.error) {
                toast.error(response.error);
            }
            return response.staff;
        } catch (error) {
            console.log(error);
        }
    }

    const handleSelectPatient = (event) => {
        const patient = patients.find((patient) => patient._id === event.target.value);
        // console.log('selected patient', patient);
        setSelectedPatient(patient);
        // focus on add appointment button
        const addAppointmentBtn = document.getElementById('add-appointment-btn');
        if (addAppointmentBtn) {
            addAppointmentBtn.focus();
        }
    };

    const handleRejectBooking = async (bookingId) => {
        const bookStatus = bookings.find((booking) => booking._id === bookingId).status;
        if (bookStatus === 'rejected') {
            toast.error('Booking already rejected');
            return;
        } else if (bookStatus === 'accepted') {
            toast.error('Booking pending approval cannot be rejected');
            return;
        } else {
            setBookingId(bookingId);
            setDialogConfirmReject(true);
        }
    };

    const handleAcceptBooking = async (bookingId) => {
        const bookStatus = bookings.find((booking) => booking._id === bookingId).status;
        if (bookStatus === 'accepted') {
            toast.error('Booking already accepted');
            return;
        } else if (bookStatus === 'rejected') {
            toast.error('Booking rejected cannot be accepted');
            return;
        } else {
            try {
                const data = await updateBooking(bookingId, 'accepted');
                if (data.error) {
                    toast.error(data.error);
                } else {
                    toast.success(` Booking ${data.booking?.status} successfully`);
                    setSelected([]);
                    fetchAllBookings();
                }
            } catch (error) {
                toast.error('Error accepting booking');
            }
        }
    };

    const handleConfirmReject = async () => {
        try {
            const data = await updateBooking(bookingId, 'rejected');
            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success(` Booking ${data.booking?.status} successfully`);
                setSelected([]);
                setDialogConfirmReject(false);
                fetchAllBookings();
            }
        } catch (error) {
            toast.error('Error rejecting booking');
        }
    };

    const handleCancelReject = () => {
        setDialogConfirmReject(false);
        setBookingId(null);
    };

    useEffect(() => {
        fetchAllBookings();
    }, []);

    return (
        <Box component={Paper} p={2} sx={{ width: '100%', bgcolor: 'background.paper', alignContent: 'center' }} >
            {/* Add patient and appointment buttons and search bar with date picker */}
            <Grid container spacing={2} mb={2} border={1} >
                <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    {}
                    <Select
                        id="patient-select"
                        disabled={patients?.length === 0}
                        value={selectedPatient?._id || ''}
                        onChange={handleSelectPatient}
                        sx={{ mr: 2, width: '300px' }}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        
                    >
                        <MenuItem value={``} aria-checked><em>Select Patient</em></MenuItem>
                        {patients?.map((patient) => (
                            <MenuItem key={patient?._id} value={patient?._id}>
                                {patient?.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button 
                        sx={{ mr: 1, borderRadius: '50%', p: 2 }}
                        id="add-appointment-btn"
                        variant="outlined"
                        color="success"
                        disabled={selectedPatient?._id ? false : true}
                        onClick={handleAddAppointment}
                    >
                        <Add />
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', backgroundColor: '#fff', p: 1 }}>
                    <TextField
                        type="date"
                        label="Start Date"
                        variant="standard"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mr: 2 }}
                    />
                    <TextField
                        type="date"
                        label="End Date"
                        variant="standard"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mr: 2 }}
                    />
                    <Button variant="contained" sx={{ mr: 1, borderRadius: '50%', p: 2 }} color="primary" onClick={handleSearch}>
                        <Search sx={{ color: '#fff' }} />
                    </Button>
                </Grid>
            </Grid>

            {/* Table with patient and appointment details */}
            <Box sx={{ width: '100%' }}>
                <Table stickyHeader sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
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
                                    active={orderBy === 'gender'}
                                    direction={orderBy === 'time' ? order : 'asc'}
                                    onClick={() => handleRequestSort('gender')}
                                >
                                    Gender
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
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortBookings(bookinsResult.length > 0 ? bookinsResult : bookings).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((booking) => (
                            <TableRow
                                key={booking._id}
                                onClick={() => handleClick(booking._id)}
                                selected={selected.indexOf(booking._id) !== -1}
                            >
                                <TableCell padding="checkbox">
                                    <input
                                        type="checkbox"
                                        onChange={(event) => handleSelectClick(event, booking._id)}
                                        checked={selected.indexOf(booking._id) !== -1}
                                    />
                                </TableCell>
                                <TableCell>{booking.name}</TableCell>
                                <TableCell>{booking.department?.name}</TableCell>
                                <TableCell>{booking.service?.service}</TableCell>
                                <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{booking.gender}</TableCell>
                                <TableCell>{booking.status}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        sx={{ mr: 1 }}
                                        onClick={() => {
                                            handleSelectBooking(booking);
                                            // handleAcceptBooking(booking._id);
                                        }}
                                    >
                                        <Done />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleRejectBooking(booking._id)}
                                    >
                                        <Cancel />
                                    </Button>
                                </TableCell>
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
            </Box>

            {/* Modal for creating new appointment or patient */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    add appointment
                </DialogTitle>
                <DialogContent>
                    <Box
                        component={"form"}
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },

                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <div>
                            <TextField
                                required
                                id="outlined-required"
                                label="Patient Name"
                                value={appointment.patient?.name || ''}
                                onChange={(e) => setAppointment({ ...appointment, patient: { ...appointment.patient, name: e.target.value } })}
                            />
                            <TextField
                                required
                                id="outlined-required"
                                label="Department"
                                value={appointment.department?.name || ''}
                                onChange={(e) => setAppointment({ ...appointment, department: e.target.value })}
                            />
                            <TextField
                                required
                                id="outlined-required"
                                label="Service"
                                value={appointment.service?.service || ''}
                                onChange={(e) => setAppointment({ ...appointment, service: e.target.value })}
                            />
                            <TextField
                                required
                                id="outlined-required"
                                label="Price"
                                type='number'
                                value={appointment?.price}
                                onChange={(e) => setAppointment({ ...appointment, price: e.target.value })}
                            />

                            <TextField
                                required
                                id="outlined-required"
                                label="Date"
                                type='datetime-local'
                                value={appointment.date || ''}
                                onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
                            />

                            <Select
                                id="demo-simple-select"
                                label="Staff"
                                required
                                value={appointment.staff?._id || ""} // Access the _id if staff exists, otherwise use an empty string
                                sx={{ m: 1, width: '25ch' }}
                                onChange={(e) => setAppointment({ ...appointment, staff: e.target.value })}
                            >
                                <MenuItem value={""}>Select Staff</MenuItem>
                                {departmentStaff?.map((staff) => (
                                    <MenuItem key={staff._id} value={staff._id}>{staff.user?.name}</MenuItem>
                                ))}
                            </Select>

                        </div>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            handleAppointmentSubmit();
                            setDialogOpen(false);
                        }}
                    >
                        Submit
                    </Button>
                    <Button onClick={() => setDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for creating new patient */}
            <Dialog
                open={dialogPatient}
                onClose={() => setDialogPatient(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    add patient
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <div>
                            <TextField
                                required
                                id="outlined-required"
                                label="Code"
                                value={newPatient.code}
                                onChange={(e) => setNewPatient({ ...newPatient, code: e.target.value })}
                            />
                            <TextField
                                required
                                id="outlined-required"
                                label="Name"
                                value={newPatient.name}
                                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                            />
                            <TextField
                                required
                                id="outlined-required"
                                label="Phone"
                                value={newPatient.phone}
                                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                            />
                            <TextField
                                required
                                id="outlined-required"
                                label="Gender"
                                value={newPatient.gender}
                                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                            />
                            <TextField
                                required
                                id="outlined-required"
                                label="Age"
                                value={newPatient.age}
                                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                            />
                            <TextField
                                required
                                id="outlined-required"
                                label="Address"
                                value={newPatient.address}
                                onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                            />
                            <TextField
                                required
                                id="outlined-required"
                                label="Description"
                                onChange={(e) => setNewPatient({ ...newPatient, description: e.target.value })}
                            />
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        handleCreatePatient();
                        setDialogPatient(false);
                    }}>Create</Button>
                    <Button onClick={() => {
                        setDialogPatient(false);
                    }}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* dialog confirm reject booking */}
            <Dialog
                open={dialogConfirmReject}
                onClose={() => setDialogConfirmReject(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirmation or Rejection booking
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to reject this booking?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmReject}>Confirm</Button>
                    <Button onClick={handleCancelReject}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};


export default BookAppointment;
