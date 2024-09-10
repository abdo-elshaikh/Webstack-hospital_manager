import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Avatar,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
    ListItemAvatar
} from '@mui/material';
import { ArrowUpward, ArrowDownward, Person2 } from '@mui/icons-material';
// Services imports
import { getAllStaff } from '../../services/staffService';
import { getPatients } from '../../services/PatientService';
import { getAllBooks } from '../../services/bookingService';
import { getAllDepartments } from '../../services/departmentService';
import { getAllContacts } from '../../services/contactService';
import { getAppointments } from '../../services/appointmentService';
import { getUsers } from '../../services/AdminService';

// Date Range imports
import {
    getToday,
    getYesterday,
    getThisMonth,
    getLastMonth,
    getThisYear,
    getLastYear,
    getThisWeek,
    getLastWeek,
    getBeforeYesterday,
} from '../../constants/DateRange';

const AdminDashboard = () => {
    const [staffs, setStaffs] = useState([]);
    const [patients, setPatients] = useState([]);
    const [books, setBooks] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [
                    staffResponse,
                    patientResponse,
                    bookResponse,
                    departmentResponse,
                    contactResponse,
                    appointmentResponse,
                    userResponse,
                ] = await Promise.all([
                    getAllStaff(),
                    getPatients(),
                    getAllBooks(),
                    getAllDepartments(),
                    getAllContacts(),
                    getAppointments(),
                    getUsers(),
                ]);
                setStaffs(staffResponse.staff || []);
                setPatients(patientResponse.patients || []);
                setBooks(bookResponse.appointments || []);
                setDepartments(departmentResponse.departments || []);
                setContacts(contactResponse.contacts || []);
                setAppointments(appointmentResponse.appointments || []);
                setUsers(userResponse.users || []);
            } catch (err) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const dataByDate = (data, date) => {
        const from = new Date(date.start);
        const to = new Date(date.end);
        return data.filter(item => {
            const itemDate = new Date(item.date || item.createdAt);
            return itemDate >= from && itemDate <= to;
        });
    };

    const getRevenue = (data, date) => {
        const filteredData = dataByDate(data, date);
        return filteredData.reduce((acc, item) => acc + item.total, 0);
    };

    // appointments data chart
    const todayData = dataByDate(appointments, getToday());
    const thisWeekData = dataByDate(appointments, getThisWeek());
    const thisMonthData = dataByDate(appointments, getThisMonth());
    const thisYearData = dataByDate(appointments, getThisYear());

    // revenue data chart
    const revenueData = [
        { name: 'Jan', revenue: getRevenue(appointments, { start: '2024-01-01', end: '2024-01-31' }) },
        { name: 'Feb', revenue: getRevenue(appointments, { start: '2024-02-01', end: '2024-02-28' }) },
        { name: 'Mar', revenue: getRevenue(appointments, { start: '2024-03-01', end: '2024-03-31' }) },
        { name: 'Apr', revenue: getRevenue(appointments, { start: '2024-04-01', end: '2024-04-30' }) },
        { name: 'May', revenue: getRevenue(appointments, { start: '2024-05-01', end: '2024-05-31' }) },
        { name: 'Jun', revenue: getRevenue(appointments, { start: '2024-06-01', end: '2024-06-30' }) },
        { name: 'Jul', revenue: getRevenue(appointments, { start: '2024-07-01', end: '2024-07-31' }) },
        { name: 'Aug', revenue: getRevenue(appointments, { start: '2024-08-01', end: '2024-08-31' }) },
        { name: 'Sep', revenue: getRevenue(appointments, { start: '2024-09-01', end: '2024-09-30' }) },
        { name: 'Oct', revenue: getRevenue(appointments, { start: '2024-10-01', end: '2024-10-31' }) },
        { name: 'Nov', revenue: getRevenue(appointments, { start: '2024-11-01', end: '2024-11-30' }) },
        { name: 'Dec', revenue: getRevenue(appointments, { start: '2024-12-01', end: '2024-12-31' }) },
    ];

    // booking data chart
    const bookingData = [
        { name: 'Waiting', count: books.filter(book => book.status === 'wait')?.length || 0 },
        { name: 'Confirmed', count: books.filter(book => book.status === 'accepted')?.length || 0 },
        { name: 'Cancelled', count: books.filter(book => book.status === 'rejected')?.length || 0 },
    ];

    return (
        <Container maxWidth="xl">
            {loading && <LinearProgress />}
            {error && (
                <Typography variant="h6" color="error" gutterBottom>
                    {error}
                </Typography>
            )}

            {!loading && (
                <>
                    {/* Overview Cards */}
                    <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', bgcolor: '#f5f5f5' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <DashboardCard title="Today Profit" value="$36.45" percentage="26%" isPositive={false} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <DashboardCard title="This Week" value="$96.25" percentage="24%" isPositive={true} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <DashboardCard title="Total Sales" value="696" percentage="26%" isPositive={true} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <DashboardCard title="Visitors" value="960" percentage="26%" isPositive={false} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <DashboardCard title="Page View" value="46,230" percentage="26%" isPositive={false} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <DashboardCard title="Average Time" value="2:10 min" percentage="26%" isPositive={false} />
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider sx={{ mt: 2, mb: 2 }} />

                    {/* Charts and Lists */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Grid container spacing={2}>
                                {/* Online Bookings Chart */}
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Online Bookings
                                        </Typography>
                                    </Paper>
                                </Grid>

                                {/* Revenue Chart */}
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Revenue Chart
                                        </Typography>

                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Recent Activities */}
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2, height: '100%' }}>
                                <Typography variant="h6" gutterBottom>
                                    Recent Activities
                                </Typography>
                                <List>
                                    {contacts.slice(0, 5).map(contact => (
                                        <ListItem key={contact._id} divider>
                                            <ListItemAvatar>
                                                <Avatar
                                                    sx={{ bgcolor: '' }}
                                                >
                                                    <Person2 color="primary" />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`Name: ${contact.name}`}
                                                secondary={`Msg: ${contact.message}`}
                                            />
                                        </ListItem>
                                    ))}
                                    {contacts.length === 0 && (
                                        <Typography variant="body2" color="textSecondary">
                                            No recent activities found.
                                        </Typography>
                                    )}
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
        </Container>
    );
};

const DashboardCard = ({ title, value, percentage, isPositive }) => {
    return (
        <Card variant="outlined" sx={{ minWidth: 150 }}>
            <CardContent>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h5" component="div">
                    {value}
                </Typography>
                <Box display="flex" alignItems="center">
                    {isPositive ? (
                        <ArrowUpward sx={{ color: 'green' }} />
                    ) : (
                        <ArrowDownward sx={{ color: 'red' }} />
                    )}
                    <Typography variant="body2" sx={{ color: isPositive ? 'green' : 'red', ml: 0.5 }}>
                        {percentage} from yesterday
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default AdminDashboard;
