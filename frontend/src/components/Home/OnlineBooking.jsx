import { useState, useEffect } from 'react';
import {
    DialogContentText, Dialog, DialogContent, DialogTitle, DialogActions, Container, Grid, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel, Box, InputAdornment, Paper,
} from '@mui/material';
import { LocationOn, Phone, Person, Cake, Money, Note, AddCard, Upload,  } from '@mui/icons-material';
import { bookAppointment, uploadImage } from '../../services/bookingService';
import { getAllDepartments } from '../../services/departmentService';
import { getServicesByDepartment } from '../../services/priceService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../contexts/useAuth';
import '../../styles/home.css';

const OnlineBooking = () => {
    const { user } = useAuth();
    const emptyAppointment = {
        user: user?._id,
        department: '',
        service: '',
        name: '',
        age: '',
        gender: '',
        phone: '',
        address: '',
        reason: '',
        status: 'wait',
        image: '',
    };

    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [services, setServices] = useState([]);
    const [appointment, setAppointment] = useState(emptyAppointment);
    const [servicePrice, setServicePrice] = useState(0);
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [image, setImage] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setImage(null);
    };

    const handleAppointment = (e) => {
        const { name, value } = e.target;
        setAppointment({ ...appointment, [name]: value });
    };

    const handleAppointmentSubmit = async (e) => {
        if (appointment.reason === '' || appointment.reason === '' || appointment.name === '' || appointment.age === '' || appointment.gender === '' || appointment.phone === '' || appointment.address === '') {
            toast.error('Please fill in all required fields!');
            return;
        }
        if (appointment.image === '') {
            toast.error('Please upload an prescription image!');
            setOpen(true);
            return;
        }
        e.preventDefault();
        if (!user) {
            toast.error('Please login to book an appointment or register!');
            navigate('/auth/login');
        }
        const data = await bookAppointment(appointment);
        if (data.error) {
            toast.error(data.error);
        } else {
            toast.success("Appointment booked successfully! We will contact you soon.", { autoClose: 9000 });
            setAppointment(emptyAppointment);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }

    };

    const handleUploadClick = () => {
        if (!image) {
            toast.error('Please select an image!');
            return;
        }
        handleUpload(image);
    };

    const handleUpload = async (image) => {
        const data = await uploadImage(image);
        if (data.error) {
            toast.error(data.error);
        } else {
            toast.success('Image uploaded successfully!');
            // console.log(data.url);
            setAppointment({ ...appointment, image: data.url });
            handleClose();
        }
    }

    return (
        <>
            <Container
                maxWidth="lg"
                component="section"
                sx={{
                    position: 'relative', marginTop: '-140px', zIndex: 6,
                    borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.3)', p: 4, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                }}>
                {/* <Typography variant="h4" component="h1" align="center" sx={{ color: 'rgba(255, 255, 255, 1)', fontWeight: 'bold' }}>
                    Online Booking
                </Typography> */}
                <Typography
                    variant="h5"
                    component="h2"
                    align="center"
                    sx={{ color: 'rgba(255, 255, 255, 1)', fontWeight: 'bold', mb: 1 }}
                >
                    Book an appointment online
                </Typography>
                <Paper elevation={6} sx={{ p: 4, borderRadius: '8px', mb: 4, backgroundColor: 'rgba(255, 255, 255, 1)', }}>
                    <Box
                        component="form"
                        onSubmit={handleAppointmentSubmit}
                        sx={{
                            display: 'grid',
                            gap: 2,
                            borderRadius: '8px',
                        }}
                    >
                        <Grid container spacing={3} position={'relative'} alignContent={'center'} alignItems={'end'}>
                            {/* patient name input */}
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    placeholder='Patient Name'
                                    name="name"
                                    variant='standard'
                                    error={!!errors.name}
                                    value={appointment.name}
                                    onChange={handleAppointment}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person sx={{ color: 'primary.main'}} />|
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            {/* phone number input */}
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    placeholder='Phone Number'
                                    name="phone"
                                    variant='standard'
                                    error={!!errors.phone}
                                    value={appointment.phone}
                                    onChange={handleAppointment}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone sx={{ color: 'primary.main'}} /> |
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* age input */}
                            <Grid item xs={6} sm={6} md={2}>
                                <TextField
                                    fullWidth
                                    placeholder='Age'
                                    name="age"
                                    type='number'
                                    variant='standard'
                                    error={!!errors.age}
                                    value={appointment.age}
                                    onChange={handleAppointment}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Cake sx={{ color: 'primary.main'}} /> |
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* gender input */}
                            <Grid item xs={6} sm={6} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        name="gender"
                                        label="Gender"
                                        variant='standard'
                                        error={!!errors.gender}
                                        value={appointment.gender}
                                        onChange={handleAppointment}
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* address input */}
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    placeholder='Address'
                                    name="address"
                                    variant='standard'
                                    error={!!errors.address}
                                    value={appointment.address}
                                    onChange={handleAppointment}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationOn  sx={{ color: 'primary.main'}}/> |
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* department input */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth disabled={departments.length === 0}>
                                    <InputLabel>Department</InputLabel>
                                    <Select
                                        name="department"
                                        label="Department"
                                        variant='standard'
                                        error={!appointment.service}
                                        value={appointment.department}
                                        onChange={(e) => handleDepartmentChange(e.target.value)}
                                    >
                                        <MenuItem value="">Select Department</MenuItem>
                                        {departments.map((department) => (
                                            <MenuItem key={department._id} value={department._id}>
                                                {department.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* service input */}
                            <Grid item xs={6} sm={6} md={3}>
                                <FormControl fullWidth disabled={services.length === 0}>
                                    <InputLabel>Service</InputLabel>
                                    <Select
                                        name="service"
                                        label="Service"
                                        variant='standard'
                                        error={!appointment.department}
                                        value={appointment.service}
                                        onChange={(e) => handleServiceChange(e.target.value)}
                                        disabled={!appointment.department}
                                    >
                                        <MenuItem value="">Select Service</MenuItem>
                                        {services.map((service) => (
                                            <MenuItem key={service._id} value={service._id}>
                                                {service.service}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* price view */}
                            <Grid item xs={6} sm={6} md={2}>
                                <TextField
                                    fullWidth
                                    // label="Price"
                                    name="price"
                                    variant="standard"
                                    value={servicePrice}
                                    disabled
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Money  sx={{ color: 'primary.main'}}/> € :
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* reason input */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    // label="Note"
                                    placeholder='Note'
                                    name="reason"
                                    variant="standard"
                                    error={!!errors.reason}
                                    value={appointment.reason}
                                    onChange={handleAppointment}

                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Note sx={{ color: 'primary.main'}} />|
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>


                        </Grid>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            bottom: -10,
                        }}
                    >

                        <Button
                            variant="contained"
                            color="success"
                            type="submit"
                            vocab='book'
                            onClick={handleAppointmentSubmit}
                            sx={{
                                p: 2.5,
                                borderRadius: '50%',
                                mr: 2,
                                '&:hover': {
                                    backgroundColor: 'darkorange',
                                    opacity: 0.8,
                                    transform: 'scale(1.1)',
                                    transition: 'all 0.3s ease',
                                },

                            }}
                        >
                            <AddCard />
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            type='button'
                            onClick={handleClickOpen}
                            sx={{
                                p: 2.5,
                                borderRadius: '50%',
                                '&:hover': {
                                    backgroundColor: 'darkblue',
                                    opacity: 0.8,
                                    transform: 'scale(1.1)',
                                    transition: 'all 0.3s ease',

                                },
                            }}
                        >
                            <Upload />
                        </Button>
                    </Box>
                </Paper>
            </Container>

            {/* prescription dialog */}
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                aria-labelledby="alert-dialog-title"
                PaperProps={{
                    style: {
                        borderRadius: 20,
                        boxShadow: 24,
                        p: 4,
                        backgroundColor: '#f5f5f5',

                    },
                }}
                maxWidth="sm"
                sx={{ zIndex: 6, p: 2, boxShadow: 24,  }}
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    {'Upload prescription'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <DialogContentText id="alert-dialog-description">
                                {`${appointment?.name} please upload your prescription.\n\nNote: You can upload only one prescription at a time.`}
                            </DialogContentText>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }} >
                            <Button variant="outlined" color="inherit" component="label">
                                Upload Prescription
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleImageChange}
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={7} sx={{ textAlign: 'center', mt: 2, ml: 1, minHeight: 300, border: 2, borderColor: 'grey.500', p: 2 }}>
                            {/* image preview */}
                            {image && <img src={URL.createObjectURL(image)} alt="Prescription" width="300" height="300" />}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleUploadClick}>Upload</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};



export default OnlineBooking;
