import { Box, Grid, Typography, Toolbar, CssBaseline } from '@mui/material';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminTopBar from '../components/Admin/AdminTopBar';
import AdminContent from '../components/Admin/AdminContent';
import Users from '../components/Users';
import Department from '../components/Departments/Department';
import Position from '../components/Positions/Position';
import Service from '../components/Services/Service';
import Staff from '../components/Admin/StaffMember';
import Patient from '../components/Patients/Patient';
import Appointment from '../components/Appointments/Appointment';
import BookAppointment from '../components/Appointments/BookAppointment';
import PatientAppointment from '../components/Appointments/PatientAppointment';
import ContactList from '../components/Contact/ContactList';
import ContactView from '../components/Contact/ContactView';
import AppointmentView from '../components/Appointments/AppointmentView';
import Invoice from '../components/Invoice';
import MyCalendar from '../components/Calendar/MyCalendar';
import AdminDashboardHome from '../components/Admin/AdminDashboardHome';
import MainReports from '../components/AdminReports/MainReports';
import NotificationsList from '../components/Notifications/NotificationsList';

import { useState } from 'react';
import useAuth from '../contexts/useAuth';

const Admin = () => {
    const { user, handleLogout } = useAuth();
    const [open, setOpen] = useState(true);

    return (
        <Box display={'flex'} sx={{
            p: 0,
            
        }}>
            <CssBaseline />
            <AdminTopBar user={user} handleLogout={handleLogout} open={open} setOpen={setOpen} />
            <AdminSidebar open={open} setOpen={setOpen} />
            <Box component={'main'} flexGrow={1} py={3} bgcolor={'#f5f5f5'}  mt={5} minHeight={'calc(100vh - 60px)'}>
                <Routes>
                    <Route path="/" element={<AdminContent title="Dashboard"><AdminDashboardHome /></AdminContent>} />
                    <Route path="dashboard" element={<AdminContent title="Dashboard"><AdminDashboardHome /></AdminContent>} />
                    <Route path="users" element={<AdminContent title="Users"><Users /></AdminContent>} />
                    <Route path="departments" element={<AdminContent title="Departments"><Department /></AdminContent>} />
                    <Route path="services" element={<AdminContent title="Services"><Service /></AdminContent>} />
                    <Route path="positions" element={<AdminContent title="Positions"><Position /></AdminContent>} />
                    <Route path="staff" element={<AdminContent title="Staff"><Staff /></AdminContent>} />
                    <Route path="patients" element={<AdminContent title="Patients"><Patient /></AdminContent>} />
                    <Route path="appointments" element={<AdminContent title="Appointments"><Appointment /></AdminContent>} />
                    <Route path="book-appointment" element={<AdminContent title="Online Booking"><BookAppointment /></AdminContent>} />
                    <Route path="patient-appointment" element={<AdminContent title="Patient Appointment"><PatientAppointment /></AdminContent>} />
                    <Route path="contacts" element={<AdminContent title="Contacts"><ContactList /></AdminContent>} />
                    <Route path="appointments/view" element={<AdminContent title="View Appointment"><AppointmentView /></AdminContent>} />
                    <Route path="contact/:contactId" element={<AdminContent title="View Contact"><ContactView /></AdminContent>} />
                    <Route path='appointments/invoice' element={<AdminContent title="Invoice"><Invoice /></AdminContent>} />
                    <Route path='calendar' element={<AdminContent title="Calendar"><MyCalendar /></AdminContent>} />
                    <Route path='reports' element={<AdminContent title="Reports"><MainReports /></AdminContent>} />
                    <Route path='notifications' element={<AdminContent title="Notifications"><NotificationsList /></AdminContent>} />
                    <Route path="*" element={<Navigate to="/not-found" />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default Admin;
