import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAppointments, changeAppointmentStatus, getAppointmentsByPatient, deleteAppointment, } from "../../services/appointmentService";
import { getPatients, deletePatient } from "../../services/PatientService";
import AppointmentCreate from "../Appointments/AppointmentCreate";
import CreatePatient from "../Patients/CreatePatient";
import { TablePaginationComponent, PaginationComponent } from "../PaginationComponent";
import {
    Box,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Badge,
    Tabs,
    Tab,
    Container,
    Pagination,
    Modal,
    useMediaQuery,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Fab,
    Select,
    MenuItem
} from "@mui/material";
import { Close as CloseIcon, Edit, Delete, Add, NoteAdd, Print, Cancel, Search, RemoveRedEye, Check } from "@mui/icons-material";
import useAuth from "../../contexts/useAuth";
import '../../styles/staff.css';

const StaffHome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [todayPatients, setTodayPatients] = useState([]);
    const [patient, setPatient] = useState({});
    const [patientToEdit, setPatientToEdit] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [maxCode, setMaxCode] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [tabValue, setTabValue] = useState('patients');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogPatient, setDialogPatient] = useState({});
    const [searchResult, setSearchResult] = useState([]);
    const [filter, setFilter] = useState('today');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    // modal for patient
    const [patientModalOpen, setPatientModalOpen] = useState(false);

    const statusColor = {
        'Pending': 'warning',
        'in progress': 'info',
        'completed': 'success',
        'Cancelled': 'danger',
    };


    const addAppointmentToPatient = (patient) => {
        // navigate('/staff/patient/appointments', { state: { patient } });
        setIsModalOpen(true);
        setPatient(patient);
    }

    const handleEditPatient = (patient) => {
        setPatientToEdit(patient);
        setIsEdit(true);
        if (isMobile || isTablet) setPatientModalOpen(true);
    }


    const fetchAppointments = async () => {
        try {
            const { appointments: fetchedAppointments, error } = await getAppointments();
            if (error) throw new Error(error);
            setAppointments(fetchedAppointments);
            filterTodayAppointments(fetchedAppointments);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchPatients = async () => {
        try {
            const { patients: fetchedPatients, error } = await getPatients();
            if (error) throw new Error(error);
            setPatients(fetchedPatients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            setMaxCode(getMaxPatientCode(fetchedPatients));
            filterTodayPatients(fetchedPatients);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getMaxPatientCode = (patients) => {
        return patients.reduce((max, patient) => Math.max(max, patient.code), 0) + 1;
    };

    const filterTodayAppointments = (appointments) => {
        const today = new Date().toDateString();
        setTodayAppointments(appointments.filter(({ date }) => new Date(date).toDateString() === today));
    };

    const filterTodayPatients = (patients) => {
        const today = new Date().toDateString();
        setTodayPatients(patients.filter(({ createdAt }) => new Date(createdAt).toDateString() === today));
    };

    const handleChangeStatus = async (appointment) => {
        try {
            const { _id, status, date } = appointment;
            const newStatus = getNewStatus(status, date);
            if (!newStatus) return;

            const { error, appointment: updatedAppointment } = await changeAppointmentStatus(_id, newStatus, user._id);
            if (error) throw new Error(error);

            toast.success(`Appointment status changed to ${newStatus}`);
            setAppointments(appointments.map(appointment => appointment._id === _id ? updatedAppointment : appointment));
            fetchAppointments();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getNewStatus = (status, date) => {
        const statusList = ['Pending', 'in progress', 'completed', 'Cancelled'];
        const index = statusList.indexOf(status);
        if (new Date(date) > new Date()) {
            toast.warning(`Cannot change status after appointment date: ${date}`, { autoClose: 3000 });
            return null;
        }
        if (index === -1 || index === -2) {
            toast.warning(`Invalid status: ${status}`, { autoClose: 3000 });
            return null;
        }
        const nextIndex = (index + 1) % statusList.length;
        return statusList[nextIndex];
    };

    const handleDeletePatient = async () => {
        setDialogOpen(true);
        // check if patient has active appointments
        const patientAppointmentsResult = await getPatientAppointments(dialogPatient);
        if (patientAppointmentsResult.length > 0) {
            toast.error('Cannot delete patient with active appointments');
            setDialogOpen(false);
            return;
        }
        // delete appointments associated with the patient
        for (const appointment of patientAppointmentsResult) {
            try {
                const data = await deleteAppointment(appointment._id);
                if (data.error) return toast.error(data.error);
                toast.success('Appointments deleted successfully');
            } catch (error) {
                toast.error(error.message);
            }
        }

        // delete patient from database
        try {
            const { error } = await deletePatient(dialogPatient._id);
            if (error) throw new Error(error);
            toast.success('Patient deleted successfully');
            fetchPatients();
            fetchAppointments();
            setDialogOpen(false);
        } catch (error) {
            toast.error(error.message);
            setDialogOpen(false);
        }
    };

    const getPatientAppointments = async (patient) => {
        try {
            const { appointments } = await getAppointmentsByPatient(patient._id);
            const activeAppointments = appointments.filter(appointment => appointment.status !== 'cancelled');
            return activeAppointments;
        } catch (error) {
            toast.error(`Error loading appointments: ${error.message}`);
            return [];
        }
    };

    const handleDeleteAppointment = async (appointmentId) => {
        try {
            const { error } = await deleteAppointment(appointmentId);
            if (error) throw new Error(error);
            fetchAppointments();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };


    useEffect(() => {
        fetchPatients();
        fetchAppointments();
    }, []);


    useEffect(() => {
        fetchPatients();
        fetchAppointments();
    }, [patients, appointments]);

    // filter options
    const filterOptions = [
        { label: 'Today', value: 'today', title: "Today's Patients" },
        { label: 'all', value: 'all', title: 'All Patients' },
        { label: 'search', value: 'search', title: 'Search Patients' },
    ];


    // patients table view
    const patientTab = (patients) => {
        return (
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
                    <Typography variant="h6" align="center">{filterOptions[filter]?.title}</Typography>
                    <PatientTable
                        patients={patients}
                        setDialogOpen={setDialogOpen}
                        setDialogPatient={setDialogPatient}
                        handleEditPatient={handleEditPatient}
                        addAppointmentToPatient={addAppointmentToPatient}
                    />
                </Box>
                {/* <TablePaginationComponent
                    totalPages={10}
                    currentPage={page}
                    setCurrentPage={handlePageChange}
                /> */}
            </Box>
        );
    };
    // appointments table view
    const appointmentTab = (appointments) => {
        return (
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
                    <AppointmentTable
                        appointments={appointments}
                        handleChangeStatus={handleChangeStatus}
                        statusColors={statusColor}
                        handleDeleteAppointment={handleDeleteAppointment}
                    />
                </Box>
                {/* <PaginationComponent
                    totalPages={10}
                    currentPage={page}
                    setCurrentPage={handlePageChange}
                /> */}
            </Box>
        );
    };

    // patient modal
    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: isMobile || isTablet ? 'column' : 'row', mb: 3 }}>
                {/* patient section */}
                {isMobile || isTablet ? (
                    <Container maxWidth="lg" sx={{ p: 2, backgroundColor: "#f8f9fa", border: '1px solid #dee2e6', borderRadius: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button
                            startIcon={<Add />}
                            variant="contained"
                            color="primary"
                            sx={{}}
                            onClick={() => { setPatientModalOpen(true); }}
                        >
                            Add Patient
                        </Button>
                    </Container>
                ) : (
                    <Box sx={{ flex: 1, mb: 3, mr: 3 }}>
                        <Container sx={{ p: 2, backgroundColor: "#f8f9fa", border: '1px solid #dee2e6', borderRadius: 2 }}>
                            <CreatePatient
                                patient={isEdit ? { ...patientToEdit, create_by: user?._id } : { ...patientToEdit, create_by: user?._id, code: maxCode }}
                                setPatient={setPatientToEdit}
                                isEdit={isEdit}
                                setIsEdit={setIsEdit}
                                patients={patients}
                                setSearchResult={setSearchResult}
                                setTabValue={setTabValue}
                                setFilter={(value) => setFilter(value)}
                            />
                        </Container>
                    </Box>
                )}
                {/* main content  */}
                <Box sx={{ flex: 3, }}>
                    {/* tabs section */}
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        textColor="primary"
                        indicatorColor="primary"
                        aria-label="primary tabs example"
                    >
                        <Tab label="Today Patients" value="today patients" />
                        <Tab label="Today Appointments" value="today appointments" />
                        <Tab label="Patients" value="patients" />
                        <Tab label="Appointments" value="appointments" />
                        <Tab label="Search Patients" value="search patients" />
                    </Tabs>

                    {/* patients table */}
                    {tabValue === 'patients' && patientTab(patients)}
                    {tabValue === 'today patients' && patientTab(todayPatients)}
                    {tabValue === 'search patients' && patientTab(searchResult)}

                    {/* Appointments table */}
                    {tabValue === 'appointments' && appointmentTab(appointments)}
                    {tabValue === 'today appointments' && appointmentTab(todayAppointments)}
                </Box>
            </Box>

            {/* Modal for creating appointment */}
            <Dialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fullWidth
                maxWidth="md"
                disableEscapeKeyDown
                disableAutoFocus
                PaperProps={{ sx: { borderRadius: 2 } }}
            >
                <DialogTitle
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <Typography variant="h6"> Patient - {patient?.name}</Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setIsModalOpen(false)}
                        aria-label="close"
                        sx={{ position: 'absolute', top: 10, right: 15, color: 'black', backgroundColor: 'lightgray' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent
                // dividers
                >
                    <AppointmentCreate patient={patient} setIsModalOpen={setIsModalOpen} />
                </DialogContent>
                {/* <DialogActions>
                <Button onClick={() => setIsModalOpen(false)} color="primary">
                    Close
                </Button>
            </DialogActions> */}
            </Dialog>

            {/* Modal for creating patient */}
            <Modal
                open={patientModalOpen}
                keepMounted
                disableEscapeKeyDown
                disableAutoFocus
            >

                <Box sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 5, backgroundColor: "background.paper", borderRadius: 1 }}>
                    <IconButton
                        sx={{ position: 'absolute', top: 10, right: 10 }}
                        onClick={() => setPatientModalOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                    <CreatePatient
                        patient={isEdit ? { ...patientToEdit, create_by: user?._id } : { ...patientToEdit, create_by: user?._id, code: maxCode }}
                        setPatient={setPatientToEdit}
                        isEdit={isEdit}
                        setIsEdit={setIsEdit}
                        setPatientModalOpen={setPatientModalOpen}
                        patientModalOpen={patientModalOpen}
                        patients={patients}
                        setSearchResult={setSearchResult}
                        setTabValue={setTabValue}
                        setFilter={(value) => setFilter(value)}

                    />
                </Box>
            </Modal>
            {/* Dialog for Delete Patient */}
            <Dialog
                open={dialogOpen}

            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the patient <strong>{dialogPatient.name}</strong>?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeletePatient} color="secondary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};


const PatientTable = ({ patients, setDialogPatient, handleEditPatient, setDialogOpen, addAppointmentToPatient }) => {
    const navigate = useNavigate();
    return (
        <>
            <TableContainer sx={{ mt: 3 }}>
                <Table size="small" >
                    <TableHead>
                        <TableRow>
                            <TableCell>Code</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients?.length > 0 ? patients.map(patient => (
                            <TableRow key={patient._id}>
                                <TableCell>{patient.code}</TableCell>
                                <TableCell>{patient.name}</TableCell>
                                <TableCell>{patient.age}</TableCell>
                                <TableCell>{patient.gender}</TableCell>
                                <TableCell>{patient.phone}</TableCell>
                                <TableCell>{patient.createdAt?.slice(0, 10)}</TableCell>
                                <TableCell align="right" sx={{ display: 'flex', gap: 1 }}>
                                    <Fab
                                        size="small"
                                        color="primary"
                                        aria-label="edit"
                                        onClick={() => handleEditPatient(patient)}
                                    >
                                        <Edit />
                                    </Fab>
                                    <Fab
                                        size="small"
                                        color="secondary"
                                        aria-label="delete"
                                        onClick={() => { setDialogPatient(patient); setDialogOpen(true) }}
                                    >
                                        <Delete />
                                    </Fab>
                                    <Fab
                                        size="small"
                                        color="success"
                                        aria-label="add appointment"
                                        onClick={() => addAppointmentToPatient(patient)}
                                    >
                                        <NoteAdd />
                                    </Fab>
                                    <Fab
                                        size="small"
                                        color="success"
                                        aria-label="view appointments"
                                        onClick={() => navigate(`/staff/patient/appointments/${patient._id}`, {state: {patient} })}
                                    >
                                    <RemoveRedEye />
                                </Fab>
                            </TableCell>
                            </TableRow>
                    )) : (
                    <TableRow>
                        <TableCell colSpan={7} align="center">No Patients Today</TableCell>
                    </TableRow>
                        )}
                </TableBody>
            </Table>
        </TableContainer >
        </>

    )
};

const AppointmentTable = ({ appointments, handleChangeStatus, statusColors, handleDeleteAppointment }) => {
    return (
        <TableContainer sx={{ mt: 3 }} >
            <Table size="small"  >
                <TableHead>
                    <TableRow>
                        <TableCell>Code</TableCell>
                        <TableCell>Patient Name</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Service</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {appointments.length ? appointments.map(appointment => (
                        <TableRow key={appointment._id}>
                            <TableCell>{appointment.patient?.code}</TableCell>
                            <TableCell>{appointment.patient?.name}</TableCell>
                            <TableCell>{appointment.department?.name}</TableCell>
                            <TableCell>{appointment.service?.service}</TableCell>
                            <TableCell>{appointment.price}</TableCell>
                            <TableCell>{new Date(appointment?.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Badge color={statusColors[appointment.status]}>{appointment.status}</Badge>
                            </TableCell>
                            <TableCell align="right" sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <Fab
                                    size="small"
                                    color={statusColors[appointment.status]}
                                    aria-label="print"
                                    variant="circular"
                                // onClick={handlePrintAppointment}
                                >
                                    <Print />
                                </Fab>
                                <Fab
                                    size="small"
                                    color={statusColors[appointment.status]}
                                    aria-label="edit"
                                    variant="circular"
                                    onClick={() => handleChangeStatus(appointment)}
                                >
                                    <Check />
                                </Fab>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">No Appointments Today</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
};


export default StaffHome;
