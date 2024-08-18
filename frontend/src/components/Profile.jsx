import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/AuthService';
import {
    Grid,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    InputLabel,
    MenuItem,
    Select,
    FormControl,
    Avatar,
    Typography
} from '@mui/material';
import Header from './Header';
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from 'react-toastify';
import { updateUser } from '../services/AuthService';
import { useAuth } from '../contexts/AuthContext';

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    role: yup.string().required('Role is required'),
});

const Profile = () => {
    const { user, handleLogout } = useAuth();

    const [showModal, setShowModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const location = useLocation();
    const isStaffPage = location.pathname.includes('staff');
    const isAdminPage = location.pathname.includes('admin');
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });



    useEffect(() => {
        if (user) {
            setValue('name', user?.name || '');
            setValue('email', user?.email || '');
            setValue('role', user?.role || '');
        }
    }, []);




    const fetchUser = async (id) => {
        const { user } = await getCurrentUser(id);
        if (user) {
            setValue('name', user?.name || '');
            setValue('email', user?.email || '');
            setValue('role', user?.role || '');
        }
    };


    const handleModalClose = () => {
        setShowModal(false);
        setImagePreview(null);
        setImageFile(null);
        setValue('name', user?.name || '');
        setValue('email', user?.email || '');
        setValue('role', user?.role || '');
    };
    const handleModalShow = () => setShowModal(true);

    const handleUserUpdate = () => {
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            previewImage(file);
        }
    };

    const previewImage = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('role', data.role);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await updateUser(user._id, formData);
            if (response.error) {
                toast.error(response.error);
                return;
            } else {
                toast.success(response.message);
                fetchUser(response.user?._id);
                handleModalClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Something went wrong');
        }
    };

    if (!user) {
        return (
            <Box className="profile" sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6">Loading...</Typography>
                <Typography variant="subtitle1">Please wait...</Typography>
            </Box>
        );
    }

    const handleImageView = () => {
        if (user.googleId || user.facebookId) {
            if (user.image.includes('https://')) {
                return user.image;
            } else {
                return `http://localhost:5000/uploads/${user.image}`;
            }
        } else if (user.image) {
            return `http://localhost:5000/uploads/${user.image}`;
        } else {
            return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        }
    };

    return (
        <>
            {!isStaffPage && !isAdminPage && <Header />}
            <Box className="profile container" sx={{ p: 2, minHeight: '100vh' }}>
                <Grid container spacing={3} mt={12} p={3} bgcolor={'#f8f9fa'} borderRadius={5}>
                    <Grid item xs={12} md={3} >
                        <Box
                            className="left-side profile-info"
                            sx={{ backgroundColor: '#fff', p: 2, borderRadius: 1, border: '1px solid #dee2e6', textAlign: 'center' }}
                        >
                            <Avatar
                                src={handleImageView()}
                                alt="Profile"
                                sx={{ width: 150, height: 150, mx: 'auto', mb: 2, border: '1px solid #dee2e6', cursor: 'pointer' }}
                                onClick={handleModalShow}
                            />
                            <Typography variant="h6">{user?.name}</Typography>
                            <Typography variant="body1"><strong>Role:</strong> {user?.role}</Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ mt: 3 }}
                                onClick={handleUserUpdate}
                            >
                                Edit Profile
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Box className="profile-right" sx={{ p: 2, borderRadius: 1 }}>
                            <Typography variant="h5">Profile Details</Typography>
                            <hr />
                            <Box>
                                <Typography variant="body1"><strong>Phone:</strong> +20 111 222 3333</Typography>
                                <Typography variant="body1"><strong>Email:</strong> {user?.email}</Typography>
                                <Typography variant="body1"><strong>Address:</strong> 123 Main St, Anytown USA</Typography>
                                <Typography variant="body1"><strong>Description:</strong> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci fuga rerum reiciendis dolore ipsam excepturi accusamus magni velit autem ipsum aliquid, exercitationem ea, libero repellendus, ipsa deserunt nihil pariatur maxime!</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Dialog open={showModal} onClose={handleModalClose}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Name"
                                    fullWidth
                                    {...register('name')}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    variant="outlined"
                                    margin="normal"
                                />
                                <TextField
                                    label="Email"
                                    fullWidth
                                    type="email"
                                    {...register('email')}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    variant="outlined"
                                    margin="normal"
                                />
                                <FormControl fullWidth variant="outlined" margin="normal">
                                    <InputLabel id="role-label">Role</InputLabel>
                                    <Select
                                        labelId="role-label"
                                        label="Role"
                                        {...register('role')}
                                        error={!!errors.role}
                                        helperText={errors.role?.message}
                                        variant="outlined"
                                        margin="normal"
                                    >
                                        <MenuItem value="user">User</MenuItem>
                                        <MenuItem value="staff">Staff</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                    </Select>
                                    {errors.role && <p className="text-danger">{errors.role.message}</p>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    type="file"
                                    fullWidth
                                    onChange={handleImageChange}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    margin="normal"
                                    label="Upload Image"
                                    helperText="Please upload an image"
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{ width: '100%', marginTop: '10px', borderRadius: '50%' }}
                                    />
                                )}
                            </Grid>
                        </Grid>
                        <DialogActions>
                            <Button onClick={handleModalClose} variant="outlined" color="secondary">
                                Close
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                Save Changes
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Profile;
