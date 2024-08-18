import React, { useState, useEffect } from 'react';
import {
    Container,
    Button,
    TextField,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Pagination,
    Fab,
    Box
} from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useParams } from 'react-router-dom';
import { getAppointmentsByPatient, changeAppointmentStatus } from '../../services/appointmentService';
import { QrCode2, Person3, Phone, SettingsBackupRestore, Print, Badge, Check, Cancel } from '@mui/icons-material';

const PatientAppointment = () => {
    const { user } = useAuth();
    const location = useLocation();
    const patient = location.state?.patient || {};
    const { patientId } = useParams();
    const [patientAppointments, setPatientAppointments] = useState([]);

   
    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        fetchAppointments();
    }, []);


    const fetchAppointments = async () => {
        const data = await getAppointmentsByPatient(patientId);
        if (data.error) {
            toast.error(data.error);
        } else {
            setPatientAppointments(data.appointments);
        }
    };

    const handleChangeAppointmentStatus = async (id, currentStatus, Newstatus, date) => {

        if (currentStatus !== 'pending') {
            toast.warning(`Appointment Already In ${currentStatus} !`, { autoClose: 3000 });
            return;
        } else if (Newstatus === 'pending' && date > new Date()) {
            toast.warning(`Appointment Date Is In The Future ${date} !`, { autoClose: 3000 });
            return;
        } else {
            try {
                const data = await changeAppointmentStatus(id, Newstatus, user._id);
                if (data.error) {
                    toast.error(data.error);
                } else {
                    toast.success(`Appointment Status Changed To ${Newstatus}.`, { autoClose: 3000 });
                    const updatedAppointment = data.appointment;
                    const updatedAppointments = patientAppointments.map(appointment =>
                        appointment._id === id ? updatedAppointment : appointment
                    );
                    setPatientAppointments(updatedAppointments);
                }
            } catch (error) {
                toast.error(`Error changing appointment status: ${error.message}`, { autoClose: 3000 });
            }
        }
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleBack = () => {
        history.go(-1);
    };

    return (
        <Container component={Paper} sx={{ mt: 4, pt: 2 }}>
            <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}  >
                <Button variant="contained" color="secondary" onClick={handleBack}>
                    <SettingsBackupRestore /> Back
                </Button>
            </Grid>
            {/* patient details here */}
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Patient Details
                </Typography>
                <Grid container spacing={2}>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Patient ID"
                            value={patient.code}
                            fullWidth
                            disabled
                            inputProps={{ startAdornment: <QrCode2 /> }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Name"
                            value={patient.name}
                            fullWidth
                            disabled
                            inputProps={{ startAdornment: <Person3 /> }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Phone"
                            value={patient.phone}
                            fullWidth
                            disabled
                            inputProps={{ startAdornment: <Phone /> }}
                        />
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ marginTop: 2 }}>
                <TableContainer >
                    <Table aria-label="simple table" size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Department</TableCell>
                                <TableCell>Service</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {patientAppointments.map(appointment => (
                                <TableRow key={appointment._id}>
                                    <TableCell>{appointment.department?.name}</TableCell>
                                    <TableCell>{appointment.service?.service}</TableCell>
                                    <TableCell>{appointment.price}</TableCell>
                                    <TableCell>{new Date(appointment?.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{appointment.status}</TableCell>
                                    <TableCell align="left" sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                        <Fab
                                            size="small"
                                            color='success'
                                            aria-label="complete"
                                            variant="circular"
                                            onClick={() => handleChangeAppointmentStatus(appointment._id, appointment.status, 'completed', appointment.date)}
                                        >
                                            <Check />
                                        </Fab>

                                        <Fab
                                            size="small"
                                            color='secondary'
                                            aria-label="cancel"
                                            variant="circular"
                                            onClick={() => handleChangeAppointmentStatus(appointment._id, appointment.status, 'cancelled', appointment.date)}
                                        >
                                            <Cancel />
                                        </Fab>
                                        <Fab
                                            size="small"
                                            color='info'
                                            aria-label="print"
                                            variant="circular"
                                            // onClick={}
                                        >
                                            <Print />
                                        </Fab>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={patientAppointments.length / 10}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </Box>
        </Container>
    );
};

export default PatientAppointment;
