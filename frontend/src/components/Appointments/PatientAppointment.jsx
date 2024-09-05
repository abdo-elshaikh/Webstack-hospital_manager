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
    Fab,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Checkbox
} from '@mui/material';
import { toast } from 'react-toastify';
import useAuth from '../../contexts/useAuth';
import Invoice from '../Invoice';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { getAppointmentsByPatient, changeAppointmentStatus } from '../../services/appointmentService';
import { QrCode2, Person3, Phone, SettingsBackupRestore, Print, Check, Cancel, Receipt, ViewDay } from '@mui/icons-material';

const PatientAppointment = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const patient = location.state?.patient || {};
    const [openInvoice, setOpenInvoice] = useState(false);
    const [patientAppointments, setPatientAppointments] = useState([]);
    const [selectedAppointments, setSelectedAppointments] = useState([]);

    
    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        const data = await getAppointmentsByPatient(patient._id);
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
                    fetchAppointments();
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
        navigate(-1);
    };

    const handleCloseInvoice = () => {
        setOpenInvoice(false);
        setSelectedAppointments([]);
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedAppointments(patientAppointments);
        } else {
            setSelectedAppointments([]);
        }
    }

    const handleCreateInvoice = () => {
        const completedAppointments = selectedAppointments.filter((d) => d.status === 'completed');
        setSelectedAppointments(completedAppointments);
        if (completedAppointments.length === 0) {
            toast.warning('Please select at least one completed appointment');
            return;
        }
        setOpenInvoice(true);
    }        

    const handleSelectAppointment = (event, appointment) => {
        if (event.target.checked) {
            setSelectedAppointments([...selectedAppointments, appointment]);
        } else {
            setSelectedAppointments(selectedAppointments.filter((d) => d._id !== appointment._id));
        }
    };

    const handleViewAppointment = (appointment) => {
        navigate('/admin/appointments/view', { state: { appointment } });
    };

    const isSelected = (appointment) => selectedAppointments.indexOf(appointment) !== -1;

    return (
        <Container component={Paper} sx={{ mt: 4, pt: 2 }}>
            <Grid container  >
                <Grid item xs={6}>
                    <Button variant="contained" color="secondary" onClick={handleBack}>
                        <SettingsBackupRestore /> Back
                    </Button>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Button variant="contained" color="success" onClick={handleCreateInvoice}>
                        <Receipt /> Generate Invoice
                    </Button>
                </Grid>
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
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={selectedAppointments.length > 0 && selectedAppointments.length < patientAppointments.length}
                                        checked={patientAppointments.length > 0 && selectedAppointments.length === patientAppointments.length}
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Service</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {patientAppointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((appointment) => {
                                const isItemSelected = isSelected(appointment);
                                const labelId = `checkbox-list-label-${appointment._id}`;
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={appointment._id}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isItemSelected}
                                                onChange={(event) => handleSelectAppointment(event, appointment)}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </TableCell>
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
                                                onClick={() => handleViewAppointment(appointment)}
                                            >
                                                <ViewDay />
                                            </Fab>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={patientAppointments.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </Box>

            {/* Dialog for displaying the invoice */}
            <Dialog open={openInvoice} onClose={handleCloseInvoice} maxWidth="md" fullWidth>
                <DialogTitle>Invoice</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Invoice appointments={selectedAppointments} patient={patient}/>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseInvoice} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default PatientAppointment;
