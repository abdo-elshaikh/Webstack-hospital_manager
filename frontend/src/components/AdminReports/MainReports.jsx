import React, { useState, useEffect } from 'react';
import useAuth from '../../contexts/useAuth';
import { toast } from 'react-toastify';
import {
    Container,
    Typography,
    Button,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Card
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { getAllDepartments } from '../../services/departmentService';
import { Search, ArrowDropUp, ArrowDropDown } from '@mui/icons-material';

const MainReports = () => {
    const { user: currentUser } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [todayReports, setTodayReports] = useState({});
    const [yesterdayReports, setYesterdayReports] = useState({});

    useEffect(() => {
        fetchTodayReports();
        fetchYesterdayReports();
    }, []);

    const fetchTodayReports = async () => {
        setTodayReports({
            newPatients: 75,
            totalAppointments: 120,
            totalRevenue: 10000,
            totalExpenses: 5000,
            newUsers: 10
        });
    }

    const fetchYesterdayReports = async () => {
        setYesterdayReports({
            newPatients: 50,
            totalAppointments: 90,
            totalRevenue: 8000,
            totalExpenses: 4000,
            newUsers: 15
        });
    }

    const handleCompareReports = () => {
        console.log('compare reports');
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Main Reports
            </Typography>
            {/* Daily Reports */}
            <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                <Typography variant='h6' component='h2' sx={{ marginBottom: '20px' }}>
                    Daily Reports
                </Typography>
                <Grid container spacing={2}>
                    <Grid item sm={6} md={3} >
                        <Card sx={{ padding: '20px' }}>
                            <Typography variant='h6' component='h2'>
                                New Patients
                            </Typography>
                            <Typography variant='h3' component='h2'>
                                {todayReports.newPatients}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {todayReports.newPatients > yesterdayReports.newPatients ? <ArrowDropUp sx={{ color: 'green' }} /> : <ArrowDropDown sx={{ color: 'red' }} />}
                                {((todayReports.newPatients - yesterdayReports.newPatients) * (100 / yesterdayReports.newPatients)).toFixed(2)}%
                                {todayReports.newPatients > yesterdayReports.newPatients ? ' more' : ' less'} than yesterday
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item sm={6} md={3}>
                        <Card sx={{ padding: '20px' }}>
                            <Typography variant='h6' component='h2'>
                                Total Appointments
                            </Typography>
                            <Typography variant='h3' component='h2'>
                                {todayReports.totalAppointments}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {todayReports.totalAppointments > yesterdayReports.totalAppointments ? <ArrowDropUp sx={{ color: 'green' }} /> : <ArrowDropDown sx={{ color: 'red' }} />}
                                {((todayReports.totalAppointments - yesterdayReports.totalAppointments) * (100 / yesterdayReports.totalAppointments)).toFixed(2)} %
                                {todayReports.totalAppointments > yesterdayReports.totalAppointments ? 'more' : 'less'} than yesterday
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item sm={6} md={3}>
                        <Card sx={{ padding: '20px' }}>
                            <Typography variant='h6' component='h2'>
                                Total Revenue
                            </Typography>
                            <Typography variant='h3' component='h2'>
                                $ {(todayReports.totalRevenue)}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {todayReports.totalRevenue > yesterdayReports.totalRevenue ? <ArrowDropUp sx={{ color: 'green' }} /> : <ArrowDropDown sx={{ color: 'red' }} />}
                                {(todayReports.totalRevenue - yesterdayReports.totalRevenue) * (100 / yesterdayReports.totalRevenue).toFixed(2)} % {todayReports.totalRevenue > yesterdayReports.totalRevenue ? 'more' : 'less'} than yesterday
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item sm={6} md={3}>
                        <Card sx={{ padding: '20px' }}>
                            <Typography variant='h6' component='h2'>
                                New Users
                            </Typography>
                            <Typography variant='h3' component='h2'>
                                {todayReports.newUsers}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {todayReports.newUsers > yesterdayReports.newUsers ? <ArrowDropUp sx={{ color: 'green' }} /> : <ArrowDropDown sx={{ color: 'red' }} />}
                                {(todayReports.newUsers - yesterdayReports.newUsers) * (100 / yesterdayReports.newUsers).toFixed(2)} %
                                {todayReports.newUsers > yesterdayReports.newUsers ? 'more' : 'less'} than yesterday
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default MainReports;
