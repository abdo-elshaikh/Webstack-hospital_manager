import React, { useEffect, useState } from 'react';
import {
    Grid, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Avatar, Typography, Divider, IconButton, Stack
} from '@mui/material';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from 'react-toastify';
import { updateUser } from '../services/AuthService';
import useAuth from '../contexts/useAuth';
import { Home, Logout, Edit, ArrowBack } from '@mui/icons-material';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

// Schema for form validation
const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    role: yup.string().required('Role is required'),
    age: yup.number(),
    phone: yup.string(),
    address: yup.string(),
    description: yup.string(),
});

const Profile = () => {
    const { user, handleLogout } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const ServerURL = 'http://localhost:5000/uploads/';
    const navigate = useNavigate();

    // Prepopulate form with user data
    useEffect(() => {
        if (user) {
            setValue('name', user.name);
            setValue('email', user.email);
            setValue('role', user.role);
            setValue('age', user.age);
            setValue('phone', user.phone);
            setValue('address', user.address);
            setValue('description', user.description);
            if (user.image) {
                setImagePreview(ServerURL + user.image);
            }
        }
    }, [user, setValue]);

    const handleModalClose = () => {
        setShowModal(false);
        setImagePreview(ServerURL + user.image);
        setImageFile(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('role', data.role);
            formData.append('age', data.age);
            formData.append('phone', data.phone);
            formData.append('address', data.address);
            formData.append('description', data.description);
            if (imageFile) {
                formData.append('image', imageFile);
            }
            const response = await updateUser(user._id, formData);
            if (response.error) {
                toast.error(response.error);
                return;
            }
            toast.success(response.message);
            handleModalClose();
            // Update stored user data
            localStorage.setItem('user', JSON.stringify(response.user));
        } catch (error) {
            toast.error(error.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <Box sx={{ bgcolor: '#f3f4f6', minHeight: '100vh' }}>
            <Grid container>
                {/* Header */}
                <Grid item xs={12} >
                    <Box sx={{ bgcolor: '#1976d2', p: 2, boxShadow: 1}}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5" color="white" fontWeight="bold">Profile</Typography>
                            <Stack direction="row" spacing={2}>
                                <IconButton color="inherit" onClick={() => navigate('/')}>
                                    <Home />
                                </IconButton>
                                <IconButton color="inherit" onClick={() => navigate(-1)}>
                                    <ArrowBack />
                                </IconButton>
                                <Button variant="contained" color="error" onClick={handleLogout}>
                                    <Logout /> Logout
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Grid>

                {/* Profile Info */}
                <Grid item xs={12} md={3} sx={{ minHeight: { xs: 'auto', md: 'calc(100vh - 64px)' }}}>
                    <Box sx={{ p: 3, bgcolor: '#fff', boxShadow: 1, alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Avatar
                            src={`${ServerURL}${user?.image}` || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                            alt="Profile"
                            sx={{ width: 150, height: 150, mb: 2, cursor: 'pointer', border: '3px solid #2196f3' }}
                            onClick={() => setShowModal(true)}
                        />
                        <Typography variant="h6" fontWeight="bold">{user?.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{user?.role}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Edit />}
                            sx={{ mt: 2 }}
                            onClick={() => setShowModal(true)}
                        >
                            Edit Profile
                        </Button>
                    </Box>
                </Grid>

                {/* Profile Details */}
                <Grid item xs={12} md={9}>
                    <Box sx={{p: 2}}>
                        <Typography variant="h5" fontWeight="bold" mb={2}>Profile Details</Typography>
                        <Divider />
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body1"><strong>Name:</strong> {user?.name}</Typography>
                            <Typography variant="body1"><strong>Email:</strong> {user?.email}</Typography>
                            <Typography variant="body1"><strong>Role:</strong> {user?.role}</Typography>
                            <Typography variant="body1"><strong>Age:</strong> {user?.age}</Typography>
                            <Typography variant="body1"><strong>Phone:</strong> {user?.phone}</Typography>
                            <Typography variant="body1"><strong>Address:</strong> {user?.address}</Typography>
                            <Typography variant="body1"><strong>Description:</strong> {user?.description}</Typography>
                            <Typography variant="body1"><strong>Joined On:</strong> {moment(user?.createdAt).format('MMMM Do YYYY')}</Typography>
                            <Typography variant="body1"><strong>Last Updated:</strong> {moment(user?.updatedAt).format('MMMM Do YYYY')}</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Edit Profile Modal */}
            <Dialog open={showModal} onClose={handleModalClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent dividers>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    defaultValue={user?.name}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    {...register('name')}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    defaultValue={user?.email}
                                    disabled
                                    {...register('email')}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Role"
                                    defaultValue={user?.role}
                                    disabled
                                    {...register('role')}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Age"
                                    type="number"
                                    defaultValue={user?.age}
                                    {...register('age')}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    defaultValue={user?.phone}
                                    {...register('phone')}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    defaultValue={user?.address}
                                    {...register('address')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    label="Description"
                                    defaultValue={user?.description}
                                    {...register('description')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <input type="file" onChange={handleImageChange} />
                                {imagePreview && <Avatar src={imagePreview} alt="Preview" sx={{ mt: 2, width: 100, height: 100 }} />}
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Profile;
