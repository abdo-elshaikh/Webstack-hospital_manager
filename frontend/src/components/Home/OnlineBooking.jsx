import { useState, useEffect } from 'react';
import { Container, Grid, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import { bookAppointment } from '../../services/bookingService';
import { getAllDepartments } from '../../services/departmentService';
import { getServicesByDepartment } from '../../services/priceService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/home.css';

const OnlineBooking = () => {
    const { user } = useAuth();
    const emptyAppointment = {
        user: user,
        department: '',
        service: '',
        name: '',
        age: '',
        phone: '',
        address: '',
        reason: '',
    };

    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [services, setServices] = useState([]);
    const [appointment, setAppointment] = useState(emptyAppointment);
    const [servicePrice, setServicePrice] = useState(0);

    const handleAppointment = (e) => {
        const { name, value } = e.target;
        setAppointment({ ...appointment, [name]: value });
    };

    const handleAppointmentSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to book an appointment or register!');
            navigate('/login');
        } else {
            bookAppointment(appointment).then((data) => {
                if (data.error) {
                    toast.error(data.error);
                } else {
                    toast.success("Appointment booked successfully! We will contact you soon.");
                    setAppointment(emptyAppointment);
                }
            });
        }
    };

    useEffect(() => {
        getAllDepartments().then((data) => {
            if (data.error) {
                toast.error(data.error);
            } else {
                setDepartments(data.departments);
            }
        });

    }, []);

    const handleDepartmentChange = async (departmentId) => {
        if (departmentId === '') {
            setServices([]);
            setServicePrice(0);
            return;
        }

        setAppointment({ ...appointment, department: departmentId });
        getServicesByDepartment(departmentId).then((data) => {
            if (data.error) {
                toast.error(data.error);
                setServices([]);
            } else {
                setServices(data.services);
            }
        });
    };

    const handleServiceChange = async (serviceId) => {
        setAppointment({ ...appointment, service: serviceId });
        setServicePrice(
            services.find((service) => service._id === serviceId)?.prices[0].price || '0'
        );
    };

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h4" component="h2" gutterBottom align="center">
                Book Appointment
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} md={6}>
                    <form onSubmit={handleAppointmentSubmit}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="department-label">Department</InputLabel>
                            <Select
                                labelId="department-label"
                                value={appointment.department}
                                onChange={(e) => handleDepartmentChange(e.target.value)}
                                label="Department"
                                required
                            >
                                <MenuItem value="">
                                    <em>Select Department</em>
                                </MenuItem>
                                {departments.map((department) => (
                                    <MenuItem key={department._id} value={department._id}>
                                        {department.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal" disabled={!appointment.department}>
                            <InputLabel id="service-label">Service</InputLabel>
                            <Select
                                labelId="service-label"
                                value={appointment.service}
                                onChange={(e) => handleServiceChange(e.target.value)}
                                label="Service"
                                required
                            >
                                <MenuItem value="">
                                    <em>Select Service</em>
                                </MenuItem>
                                {services.map((service) => (
                                    <MenuItem key={service._id} value={service._id}>
                                        {service.service}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box mt={1} mb={2}>
                            {servicePrice && (
                                <Typography variant="subtitle1">
                                    Price: ${servicePrice}
                                </Typography>
                            )}
                        </Box>

                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={appointment.name}
                            onChange={handleAppointment}
                            margin="normal"
                            required
                        />

                        <TextField
                            fullWidth
                            label="Age"
                            name="age"
                            type="number"
                            value={appointment.age}
                            onChange={handleAppointment}
                            margin="normal"
                            required
                        />

                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={appointment.phone}
                            onChange={handleAppointment}
                            margin="normal"
                            required
                        />

                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={appointment.address}
                            onChange={handleAppointment}
                            margin="normal"
                            required
                        />

                        <TextField
                            fullWidth
                            label="Reason"
                            name="reason"
                            value={appointment.reason}
                            onChange={handleAppointment}
                            margin="normal"
                            multiline
                            rows={4}
                            required
                        />

                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                            Book Appointment
                        </Button>
                    </form>
                </Grid>
                {/* image to book appointment gif */}
                <Grid item xs={12} md={6}>
                    <img
                        src='https://i.ibb.co/0mKqG6p/book-appointment.gif'
                        alt="Appointment"
                        style={{ width: '100%', height: 'auto' }}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default OnlineBooking;
