import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Typography,
    Box,
    DialogActions
} from '@mui/material';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getAllDepartments } from '../../services/departmentService'
import { getAllStaff } from '../../services/staffService';
import { getservices } from '../../services/priceService';
import { getPatients } from '../../services/PatientService'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    patient: Yup.string().required('Patient is required'),
    department: Yup.string().required('Department is required'),
    staff: Yup.string().required('Staff is required'),
    service: Yup.string().required('Service is required'),
    serviceType: Yup.string().oneOf(['cash', 'insurance', 'contract']).required('Service type is required'),
    price: Yup.number().required('Price is required'),
    discount: Yup.number().min(0, 'Discount cannot be negative'),
    discountReason: Yup.string().when('discount', {
        is: (val) => val > 0,
        then: Yup.string().required('Discount reason is required')
    }),
    paid: Yup.number().required('Paid amount is required'),
    rest: Yup.number().required('Rest amount is required'),
    total: Yup.number().required('Total amount is required'),
    status: Yup.string().oneOf(['pending', 'in progress', 'completed', 'cancelled']).required('Status is required'),
    date: Yup.date().required('Date is required'),
    reason: Yup.string()
});

const AppointmentForm = ({ mode, appointment, onClose, onRefresh }) => {
    const [patients, setPatients] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [staff, setStaff] = useState([]);
    const [services, setServices] = useState([]);

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: appointment || {},
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (appointment) {
            reset(appointment);
        }
    }, [appointment, reset]);

    const loadInitialData = async () => {
        try {
            const patientsData = await getPatients();
            const departmentsData = await getDepartments();
            const staffData = await getStaff();
            const servicesData = await getServices();

            setPatients(patientsData);
            setDepartments(departmentsData);
            setStaff(staffData);
            setServices(servicesData);
        } catch (error) {
            toast.error(`Error loading data: ${error.message}`);
        }
    };

    const onSubmit = async (data) => {
        try {
            if (mode === 'create') {
                // Handle create appointment
                // await createAppointment(data);
            } else {
                // Handle update appointment
                // await updateAppointment(appointment._id, data);
            }
            toast.success('Appointment saved successfully');
            onRefresh();
            onClose();
        } catch (error) {
            toast.error(`Error saving appointment: ${error.message}`);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                {mode === 'create' ? 'Create Appointment' : 'Update Appointment'}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="patient"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel>Patient</InputLabel>
                                <Select {...field} error={!!errors.patient}>
                                    {patients.map((patient) => (
                                        <MenuItem key={patient._id} value={patient._id}>
                                            {patient.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.patient && <Typography color="error">{errors.patient.message}</Typography>}
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="department"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel>Department</InputLabel>
                                <Select {...field} error={!!errors.department}>
                                    {departments.map((department) => (
                                        <MenuItem key={department._id} value={department._id}>
                                            {department.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.department && <Typography color="error">{errors.department.message}</Typography>}
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="staff"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel>Staff</InputLabel>
                                <Select {...field} error={!!errors.staff}>
                                    {staff.map((member) => (
                                        <MenuItem key={member._id} value={member._id}>
                                            {member.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.staff && <Typography color="error">{errors.staff.message}</Typography>}
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="service"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel>Service</InputLabel>
                                <Select {...field} error={!!errors.service}>
                                    {services.map((service) => (
                                        <MenuItem key={service._id} value={service._id}>
                                            {service.service}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.service && <Typography color="error">{errors.service.message}</Typography>}
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="serviceType"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel>Service Type</InputLabel>
                                <Select {...field} error={!!errors.serviceType}>
                                    <MenuItem value="cash">Cash</MenuItem>
                                    <MenuItem value="insurance">Insurance</MenuItem>
                                    <MenuItem value="contract">Contract</MenuItem>
                                </Select>
                                {errors.serviceType && <Typography color="error">{errors.serviceType.message}</Typography>}
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} type="number" label="Price" fullWidth error={!!errors.price} helperText={errors.price?.message} />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="discount"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} type="number" label="Discount" fullWidth error={!!errors.discount} helperText={errors.discount?.message} />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="discountReason"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="Discount Reason" fullWidth error={!!errors.discountReason} helperText={errors.discountReason?.message} />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="paid"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} type="number" label="Paid" fullWidth error={!!errors.paid} helperText={errors.paid?.message} />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="rest"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} type="number" label="Rest" fullWidth error={!!errors.rest} helperText={errors.rest?.message} />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="total"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} type="number" label="Total" fullWidth error={!!errors.total} helperText={errors.total?.message} />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select {...field} error={!!errors.status}>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="in progress">In Progress</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                </Select>
                                {errors.status && <Typography color="error">{errors.status.message}</Typography>}
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} type="date" label="Date" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.date} helperText={errors.date?.message} />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="reason"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="Reason" fullWidth multiline rows={4} error={!!errors.reason} helperText={errors.reason?.message} />
                        )}
                    />
                </Grid>
            </Grid>
            <DialogActions>
                <Button type="submit" variant="contained" color="primary">
                    {mode === 'create' ? 'Create' : 'Update'}
                </Button>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Box>
    );
};

export default AppointmentForm;
