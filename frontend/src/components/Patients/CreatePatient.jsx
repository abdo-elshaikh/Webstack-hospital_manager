import React, { useEffect } from "react";
import { createPatient, updatePatient } from "../../services/PatientService";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from "react-toastify";
import { IconButton, TextField, Button, Grid, Typography, InputAdornment, MenuItem, Box, FormControl, Select, InputLabel, useMediaQuery, useTheme, Modal } from "@mui/material";
import { Person4, PhoneAndroid, QrCode, Elderly, Search, Transgender, NotListedLocation } from '@mui/icons-material';

// Schema validation
const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    gender: yup.string().required('Gender is required'),
    age: yup.number().required('Age is required').positive().integer().min(1, 'Age must be a positive integer'),
    phone: yup.string()
        .required('Phone is required')
        .matches(/^01[0125][0-9]{8}$/, 'Phone number must be a valid Egyptian phone number')
        .length(11, 'Phone number must be 11 digits'),
    address: yup.string().required('Address is required'),
    description: yup.string().nullable(),
});

const CreatePatient = ({ patient, setPatient, isEdit, setIsEdit, setPatientModalOpen, patientModalOpen, patients, setFilter, setSearchResult }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [patientToSearch, setPatientToSearch] = React.useState('');

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    // Reset form values whenever the patient state changes
    useEffect(() => {
        reset(patient);
    }, [patient, reset]);

    const handleSubmitPatient = (data) => {
        if (isEdit) {
            updateExistingPatient(data);
        } else {
            createNewPatient(data);
        }
    };

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setPatient({ ...patient, [name]: value });
    };

    const createNewPatient = (data) => {
        data.create_by = patient?.create_by;
        data.code = patient?.code;
        createPatient(data)
            .then(response => {
                if (response.error) {
                    toast.error(response.error);
                    return;
                }
                toast.success('Patient created successfully');
                setPatient({});
                setIsEdit(false);
                if (patientModalOpen) setPatientModalOpen(false);
            })
            .catch(error => {
                toast.error('Failed to create patient', error);
            });
    };

    const updateExistingPatient = (data) => {
        data.code = patient?.code;
        data.create_by = patient?.create_by;
        updatePatient(patient?._id, data)
            .then(response => {
                if (response.error) {
                    toast.error(response.error);
                    return;
                }
                toast.success('Patient updated successfully');
                setPatient({});
                setIsEdit(false);
                if (patientModalOpen) setPatientModalOpen(false);
            })
            .catch(error => {
                toast.error('Failed to update patient', error);
            });
    };

    const handleCancel = () => {
        setPatient({});
        setIsEdit(false);
        setSearchResult([]);
        if (patientModalOpen) setPatientModalOpen(false);
    };

    const handleSearchByName = () => {
        if (!patientToSearch) {
            toast.error('Please enter patient name');
            return;
        }

        const name = patientToSearch.trim();
        const searchResult = patients.filter(patient => patient.name.toLowerCase().includes(name.toLowerCase()));
        if (searchResult.length === 0) {
            toast.error('No patients found');
            return;
        }
        setSearchResult(searchResult);
        setFilter('search');
    };

    const handleSearchByPhone = () => {
        if (!patientToSearch) {
            toast.error('Please enter patient phone number');
            return;
        }

        const phone = patientToSearch;
        const searchResult = patients.filter(patient => patient.phone === phone);
        if (searchResult.length === 0) {
            toast.error('No patients found');
            return;
        }
        setSearchResult(searchResult);
        setFilter('search');
    };

    return (
        <>
            <Typography id="modal-create-patient" variant="h6" component="h2">
                {isEdit ? 'Edit Patient' : 'Create Patient'}
            </Typography>
            <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit(handleSubmitPatient)}>
                <Grid container spacing={2}>
                    {/* Form fields with InputAdornment for icons */}
                    {/* Code Field */}
                    <Grid item xs={12}>
                        <TextField
                            label="Code"
                            fullWidth
                            disabled
                            color="primary"
                            variant="outlined"
                            {...register("code")}
                            error={!!errors.code}
                            helperText={errors.code?.message}
                            value={patient.code ?? ''}
                            onChange={(e) => handleChangeInput(e)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <QrCode />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    {/* Name Field */}
                    <Grid item xs={12}>
                        <TextField
                            label="Name"
                            fullWidth
                            variant="outlined"
                            {...register("name")}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            value={patient.name ?? ''}
                            onChange={(e) => {
                                handleChangeInput(e);
                                setPatientToSearch(e.target.value);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person4 />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleSearchByName}
                                        >
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    {/* Gender Field */}
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="gender-label">Gender</InputLabel>
                            <Select
                                labelId="gender-label"
                                label="Gender"
                                {...register("gender")}
                                error={!!errors.gender}
                                value={patient.gender ?? ""}
                                onChange={handleChangeInput}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Transgender />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="" disabled>Select Gender</MenuItem>
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                            </Select>
                            {errors.gender && <Typography variant="caption" color="error">{errors.gender.message}</Typography>}
                        </FormControl>
                    </Grid>

                    {/* Age Field */}
                    <Grid item xs={12}>
                        <TextField
                            label="Age"
                            fullWidth
                            variant="outlined"
                            type="number"
                            {...register("age")}
                            error={!!errors.age}
                            helperText={errors.age?.message}
                            value={patient.age ?? ''}
                            onChange={handleChangeInput}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Elderly />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    {/* Phone Field */}
                    <Grid item xs={12}>
                        <TextField
                            label="Phone"
                            fullWidth
                            variant="outlined"
                            {...register("phone")}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                            value={patient.phone ?? ''}
                            onChange={(e) => {
                                handleChangeInput(e);
                                setPatientToSearch(e.target.value);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PhoneAndroid />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleSearchByPhone}
                                        >
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    {/* Address Field */}
                    <Grid item xs={12}>
                        <TextField
                            label="Address"
                            fullWidth
                            variant="outlined"
                            {...register("address")}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                            value={patient.address ?? ''}
                            onChange={handleChangeInput}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <NotListedLocation />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    {/* Additional Info Field */}
                    <Grid item xs={12}>
                        <TextField
                            label="Additional Info"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={3}
                            {...register("description")}
                            value={patient.description ?? ''}
                            onChange={handleChangeInput}
                        />
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
                        <Grid item>
                            <Button variant="contained" color="primary" type="submit">
                                {isEdit ? 'Update' : 'Create'}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default CreatePatient;
