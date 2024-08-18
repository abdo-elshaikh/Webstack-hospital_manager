import { Box, CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminTopBar from '../components/Admin/AdminTopBar';
import AdminContent from '../components/Admin/AdminContent';
import Users from '../components/Users';
import Department from '../components/Departments/Department';
import Position from '../components/Positions/Position';
import Service from '../components/Services/Service';
import Staff from '../components/Staff/StaffMember';
import Patient from '../components/Patients/Patient';
import Appointment from '../components/Appointments/Appointment';
import BookAppointment from '../components/Appointments/BookAppointment';
import PatientAppointment from '../components/Appointments/PatientAppointment';
import AdminDashboardHome from '../components/Admin/AdminDashboardHome';
import NotFound from '../components/NotFound';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Admin = () => {
    const { user, handleLogout } = useAuth();
    const [open, setOpen] = useState(true);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AdminTopBar user={user} handleLogout={handleLogout} open={open} setOpen={setOpen} />
            <AdminSidebar open={open} setOpen={setOpen} />
            <Box component="main" sx={{ flexGrow: 1, p: 1, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
                <Routes>
                    <Route path="/" element={<AdminContent title="Dashboard"><AdminDashboardHome open={open} /></AdminContent>} />
                    <Route path="dashboard" element={<AdminContent title="Dashboard"><AdminDashboardHome open={open} /></AdminContent>} />
                    <Route path="users" element={<AdminContent title="Manage Users"><Users currentUser={user} open={open} /></AdminContent>} />
                    <Route path="departments" element={<AdminContent title="Manage Departments"><Department open={open} /></AdminContent>} />
                    <Route path="services" element={<AdminContent title="Manage Services"><Service open={open} /></AdminContent>} />
                    <Route path="positions" element={<AdminContent title="Manage Positions"><Position open={open} /></AdminContent>} />
                    <Route path="staff" element={<AdminContent title="Manage Staff"><Staff open={open} /></AdminContent>} />
                    <Route path="patients" element={<AdminContent title="Manage Patients"><Patient currentUser={user} open={open} /></AdminContent>} />
                    <Route path="appointments" element={<AdminContent title="Manage Appointments"><Appointment open={open} /></AdminContent>} />
                    <Route path="book-appointment" element={<AdminContent title="Book Appointment"><BookAppointment open={open} /></AdminContent>} />
                    <Route path="patient-appointment" element={<AdminContent title="Patient Appointment"><PatientAppointment open={open} /></AdminContent>} />                    
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default Admin;
