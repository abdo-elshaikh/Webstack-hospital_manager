import React from 'react';
import { Box, Container, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Jan', patients: 4000, appointments: 2400, revenue: 12000 },
    { name: 'Feb', patients: 3000, appointments: 1398, revenue: 11000 },
    { name: 'Mar', patients: 2000, appointments: 9800, revenue: 15000 },
    { name: 'Apr', patients: 2780, appointments: 3908, revenue: 14000 },
    { name: 'May', patients: 1890, appointments: 4800, revenue: 16000 },
    { name: 'Jun', patients: 2390, appointments: 3800, revenue: 13000 },
    { name: 'Jul', patients: 3490, appointments: 4300, revenue: 17000 },
];

const AdminDashboard = () => {
    return (
        <Container maxWidth="xl">
            <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                    {/* Overview Cards */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Total Doctors
                                </Typography>
                                <Typography variant="h4">50</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Total Users
                                </Typography>
                                <Typography variant="h4">1,234</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Appointments Today
                                </Typography>
                                <Typography variant="h4">123</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Patients Per Day
                                </Typography>
                                <Typography variant="h4">75</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Total Revenue
                                </Typography>
                                <Typography variant="h4">$12,345</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    {/* Additional Metrics */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Feedback
                                </Typography>
                                <Typography variant="h4">123</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Charts */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Patient Growth Over Time
                            </Typography>
                            <LineChart width={600} height={300} data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="patients" stroke="#8884d8" />
                            </LineChart>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Appointments Over Time
                            </Typography>
                            <LineChart width={600} height={300} data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="appointments" stroke="#82ca9d" />
                            </LineChart>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Revenue Over Time
                            </Typography>
                            <LineChart width={600} height={300} data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#ff7300" />
                            </LineChart>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default AdminDashboard;
