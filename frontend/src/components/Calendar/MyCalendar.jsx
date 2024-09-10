import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
    Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Divider, Chip,
    Box, Select, MenuItem, InputLabel, FormControl, Typography, Card, CardContent
} from '@mui/material';
import { getAllStaff } from '../../services/staffService';
import { getAppointments, changeAppointmentStatus } from '../../services/appointmentService';
import { toast } from 'react-toastify';
import useAuth from '../../contexts/useAuth';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [staff, setStaff] = useState([]);
    const [staffSelected, setStaffSelected] = useState('all');
    const [appointments, setAppointments] = useState([]);
    const [appointmentSelected, setAppointmentSelected] = useState({});
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchStaff();
        fetchAppointments();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const fetchStaff = async () => {
        try {
            const staffData = await getAllStaff();
            setStaff(staffData.staff);
        } catch (error) {
            console.error("Error fetching staff:", error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const data = await getAppointments();
            setAppointments(data.appointments);
            setEvents(formatAppointments(data.appointments));
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    const formatAppointments = (appointments) => {
        return appointments.map(appointment => ({
            id: appointment._id,
            title: `${appointment.patient.name} - ${appointment.service?.service}`,
            start: new Date(appointment.date),
            end: new Date(new Date(appointment.date).getTime() + (30 * 60000)),
            status: appointment.status,
        }));
    };

    const selectAppointment = (event) => {
        const appointment = appointments.find(appt => appt._id === event.id);
        setAppointmentSelected(appointment);
        handleOpen();
    };

    const completeAppointment = async () => {
        if (appointmentSelected.status === 'completed') {
            toast.error('Appointment already completed');
            return;
        }
        try {
            const { error } = await changeAppointmentStatus(appointmentSelected._id, 'completed', user._id);
            if (error) throw new Error(error);
            toast.success('Appointment completed successfully');
            setAppointmentSelected(prev => ({ ...prev, status: 'completed' }));
            fetchAppointments();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSelectStaff = (event) => {
        const selectedStaff = event.target.value;
        setStaffSelected(selectedStaff);
        filterAppointments(selectedStaff, statusFilter);
    };

    const handleSelectStatus = (event) => {
        const status = event.target.value;
        setStatusFilter(status);
        filterAppointments(staffSelected, status);
    };

    const filterAppointments = (staffId, status) => {
        let filteredAppointments = appointments;

        if (staffId !== 'all') {
            filteredAppointments = filteredAppointments.filter(appointment => appointment.staff?._id === staffId);
        }

        if (status !== 'all') {
            filteredAppointments = filteredAppointments.filter(appointment => appointment.status === status);
        }

        setEvents(formatAppointments(filteredAppointments));
    };

    const handleReport = () => {
        toast.info(`Report generated for staff ${appointmentSelected.patient?.name} 
            with service ${appointmentSelected.service?.service}
            department ${appointmentSelected.department?.name}`);
    };

    const eventPropGetter = (event) => {
        let backgroundColor = '#3174ad';

        switch (event.status) {
            case 'completed':
                backgroundColor = '#BDE8CA';
                break;
            case 'cancelled':
                backgroundColor = '#A04747';
                break;
            case 'pending':
                backgroundColor = '#9DBDFF';
                break;
            default:
                backgroundColor = '#3174ad';
                break;
        }

        return {
            style: { backgroundColor, color: '#33372C', borderRadius: '5px', border: 'none', cursor: 'pointer' },
        };
    };

    return (
        <Box sx={{ width: '100%', minHeight: 'calc(100vh - 67px)', p: 1 }}>
            {/* filter bar */}
            <Grid container spacing={2} sx={{ mb: 2, }}>
                <Grid item xs={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel id="staff-select-label">Staff</InputLabel>
                        <Select
                            labelId="staff-select-label"
                            id="staff-select"
                            value={staffSelected}
                            label="Staff"
                            size='small'
                            onChange={handleSelectStaff}
                        >
                            <MenuItem value="all">All</MenuItem>
                            {staff.map(staff => (
                                <MenuItem key={staff._id} value={staff._id}>{staff.user?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel id="status-select-label">Status</InputLabel>
                        <Select
                            labelId="status-select-label"
                            id="status-select"
                            size='small'
                            value={statusFilter}
                            label="Status"
                            onChange={handleSelectStatus}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Calendar */}
            <Card sx={{ p: 2, bgcolor: '#ffffff', borderRadius: 2, boxShadow: 2 }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    onDoubleClickEvent={selectAppointment}
                    eventPropGetter={eventPropGetter}
                />
            </Card>

            {/* Dialog to display appointment details */}
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '12px',
                        boxShadow: 24,
                        bgcolor: 'background.default',
                    },
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', bgcolor: '#EEEDEB', py: 2, border: '1px solid #ddd', boxShadow: 2 }}>
                    Customer Details
                </DialogTitle>
                <DialogContent sx={{ p: 3, overflowY: 'auto', border: '1px solid #ddd', boxShadow: 2, bgcolor: '#fff' }}>
                    <Divider sx={{ my: 2, color: '#ddd', width: '100%' }} >
                        <Chip label="Patient Details" sx={{ fontWeight: 500 }} />
                    </Divider>
                    <Box >
                        <Grid container spacing={1}>
                            <Grid item md={2}>
                                <TextField variant='outlined' fullWidth label="Code" value={appointmentSelected?.patient?.code} disabled />
                            </Grid>
                            <Grid item md={5}>
                                <TextField variant='outlined' fullWidth label="Name" value={appointmentSelected?.patient?.name} disabled />
                            </Grid>
                            <Grid item md={2}>
                                <TextField variant='outlined' fullWidth label="Age" value={appointmentSelected?.patient?.age} disabled />
                            </Grid>
                            <Grid item md={3}>
                                <TextField variant='outlined' fullWidth label="Gender" value={appointmentSelected?.patient?.gender} disabled />
                            </Grid>
                        </Grid>
                        <Divider sx={{ my: 2, color: '#ddd', width: '100%' }} >
                            <Chip label="Appointment Details" sx={{ fontWeight: 500 }} />
                        </Divider>
                        <Grid container alignItems={'center'} justifyContent={'space-between'} spacing={2}>
                            <Grid item md={6}>
                                <TextField fullWidth label="Service" value={appointmentSelected?.service?.service} disabled />
                            </Grid>
                            <Grid item md={6}>
                                <TextField fullWidth label="Service Type" value={appointmentSelected?.serviceType} disabled />
                            </Grid>
                            <Grid item md={6}>
                                <TextField fullWidth label="Department" value={appointmentSelected?.department?.name} disabled />
                            </Grid>
                            <Grid item md={6}>
                                <TextField fullWidth label="Status" value={appointmentSelected?.status} disabled />
                            </Grid>
                            <Grid item md={12}>
                                <TextField fullWidth multiline rows={2} label="Reason" value={appointmentSelected?.reason} disabled />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', bgcolor: '#EEEDEB', py: 2, border: '1px solid #ddd', boxShadow: 2 }}>
                    <Button variant="outlined" color="warning" sx={{ mx: 1 }} onClick={handleReport}>Report</Button>
                    <Button variant="outlined" color="success" sx={{ mx: 1 }} onClick={completeAppointment}>Complete</Button>
                    <Button variant="outlined" color="error" sx={{ mx: 1 }} onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default MyCalendar;
