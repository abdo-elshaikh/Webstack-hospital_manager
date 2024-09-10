import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { createAppointment } from '../../services/appointmentService';
import { getServicesByDepartment, getServicePriceByType } from '../../services/priceService';
import { getStaffByDepartment } from '../../services/staffService';
import { getAllDepartments } from '../../services/departmentService';
import {
    TextField, MenuItem, Button, Box, Typography, Divider,
    InputAdornment, Grid
} from '@mui/material';
import {
    Person as PersonIcon,
    LocalHospital as LocalHospitalIcon,
    CalendarToday as CalendarTodayIcon,
    AttachMoney as AttachMoneyIcon,
    MedicalServices as MedicalServicesIcon,
    Discount as DiscountIcon
} from '@mui/icons-material';
import useAuth from '../../contexts/useAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '../../styles/appointments.css';

const schema = yup.object().shape({
    department: yup.string().required('Department is required'),
    service: yup.string().required('Service is required'),
    staff: yup.string().required('Staff is required'),
    serviceType: yup.string().required('Service type is required'),
    date: yup.date().required('Date is required'),
    reason: yup.string().required('Reason is required'),
    price: yup.number().required('Price is required'),
    discount: yup.number().required('Discount is required').default(0),
    discountReason: yup.string().when('discount', {
        is: 0,
        then: (schema) => schema.default(''),
        otherwise: (schema) => schema.default(0),
    }),
    paid: yup.number().required('Paid is required'),
    rest: yup.number().required('Rest is required'),
    total: yup.number().required('Total is required'),
});

const AppointmentCreate = ({ patient, setIsModalOpen }) => {
    const { user } = useAuth();
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const [departments, setDepartments] = useState([]);
    const [services, setServices] = useState([]);
    const [staff, setStaff] = useState([]);
    const [servicePrice, setServicePrice] = useState([]);
    const [isOtherDiscount, setIsOtherDiscount] = useState(false);
    const [discountType, setDiscountType] = useState("");

    const serviceTypes = ['cash', 'insurance', 'contract'];
    const discounts = ['10%', '20%', '25%', '30%', '50%', '75%', '100%', 'other'];

    useEffect(() => {
        fetchDepartments();
        calculateServiceAmount();
    }, []);

    const fetchDepartments = async () => {
        try {
            const data = await getAllDepartments();
            setDepartments(data.departments);
        } catch (error) {
            toast.error('Error fetching departments.');
        }
    };

    const handleDepartmentChange = async (e) => {
        const departmentId = e.target.value;
        setValue('department', departmentId);
        try {
            const servicesData = await getServicesByDepartment(departmentId);
            setServices(servicesData.services || []);
            const staffData = await getStaffByDepartment(departmentId);
            setStaff(staffData.staff || []);
        } catch (error) {
            toast.error('Error fetching services or staff.');
        }
    };

    const handleServiceChange = (e) => {
        const serviceId = e.target.value;
        setValue('service', serviceId);
        const service = services.find(service => service._id === serviceId);
        setServicePrice(service?.prices || []);
        if (service && service.prices.length > 0) {
            const price = Number(service.prices[0].price);
            setValue('price', price);
            setValue('serviceType', 'cash');
            calculateServiceAmount(price, 0, 0);
        }
    };

    const handleServiceTypeChange = (e) => {
        const type = e.target.value;
        setValue('serviceType', type);
        const service = services.find(service => service._id === watch('service'));
        const priceInfo = service?.prices.find(price => price.type === type);
        if (priceInfo) {
            setValue('price', priceInfo.price);
            calculateServiceAmount(priceInfo.price, 0, 0);
        }
    };

    const handleDiscountTypeChange = (e) => {
        const discountValue = e.target.value;
        if (discountValue === 'other' && !isOtherDiscount) {
            setIsOtherDiscount(true);
        } else {
            setIsOtherDiscount(false);
            const discount = (Number(discountValue.replace('%', '')) / 100) * watch('price');
            calculateServiceAmount(watch('price'), discount, 0);
        }
    };

    const handleOtherDiscountChange = (e) => {
        const discountValue = e.target.value;
        if (discountValue > watch('price')) {
            toast.error('Discount value cannot be greater than price.');
            setValue('discount', watch('price'));
            calculateServiceAmount(watch('price'), 0, watch('paid'));
            return;
        }
        calculateServiceAmount(watch('price'), discountValue, 0);
    };

    const handlePaidChange = (e) => {
        const paidValue = e.target.value;
        if (paidValue > (watch('price') - watch('discount'))) {
            toast.error('Paid value cannot be greater than price.');
            setValue('paid', watch('price') - watch('discount'));
            calculateServiceAmount(watch('price'), watch('discount'), watch('paid'));
            return;
        }
        calculateServiceAmount(watch('price'), watch('discount'), paidValue);
    };

    const calculateServiceAmount = (price, discount, paid) => {
        if (!price) return;
        const discountValue = discount - (discount % 10);
        const paidValue = paid === 0 ? price - discountValue : paid;
        const rest = Number(price) - Number(discountValue) - Number(paidValue);
        const total = Number(paidValue) + Number(rest);
        setValue('discount', discountValue);
        setValue('paid', paidValue);
        setValue('rest', rest);
        setValue('total', total);
    };

    const onSubmit = async (data) => {
        if (new Date(data.date) < new Date()) {
            toast.error('Please select a date in the future.');
            return;
        }
        try {
            const response = await createAppointment({ ...data, patient: patient?._id, create_by: user?._id });
            if (response.error) {
                toast.error(response.error);
            } else {
                toast.success('Appointment created successfully for ' + patient?.name + '.');
                setIsModalOpen(false);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} width={'100%'} >
            <Divider sx={{ mb: 2 }} />
            <Grid container sx={{ border: '1px solid #ccc', px: 1, backgroundColor: '#f5f5f5', borderRadius: '5px' }} spacing={2}>
                <Grid container item xs={8}>
                    {/* Patient Input */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Patient"
                            value={patient?.name}
                            disabled
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Divider sx={{ mb: 1 }} />
                    {/* Department Input */}
                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="Department"
                            {...register('department', { required: 'Department is required' })}
                            onChange={handleDepartmentChange}
                            error={!!errors.department}
                            helperText={errors.department?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocalHospitalIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="" disabled>Select Department</MenuItem>
                            {departments.map(department => (
                                <MenuItem key={department._id} value={department._id}>
                                    {department.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Service Input */}
                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="Service"
                            {...register('service', { required: 'Service is required' })}
                            onChange={handleServiceChange}
                            error={!!errors.service}
                            helperText={errors.service?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MedicalServicesIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="" disabled>Select Service</MenuItem>
                            {services.map(service => (
                                <MenuItem key={service._id} value={service._id}>
                                    {service.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Staff Input */}
                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="Staff"
                            {...register('staff', { required: 'Staff is required' })}
                            error={!!errors.staff}
                            helperText={errors.staff?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="" disabled>Select Staff</MenuItem>
                            {staff.map(staffMember => (
                                <MenuItem key={staffMember._id} value={staffMember._id}>
                                    {staffMember.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Date Input */}
                    <Grid item xs={12}>
                        <TextField
                            type="datetime-local"
                            fullWidth
                            label="Date & Time"
                            {...register('date', { required: 'Date & Time is required' })}
                            error={!!errors.date}
                            helperText={errors.date?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarTodayIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                        />
                    </Grid>

                    {/* Service Type Input */}
                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="Service Type"
                            {...register('serviceType', { required: 'Service Type is required' })}
                            onChange={handleServiceTypeChange}
                            error={!!errors.serviceType}
                            helperText={errors.serviceType?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MedicalServicesIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="" disabled>Select Service Type</MenuItem>
                            {serviceTypes.map((type, index) => (
                                <MenuItem key={index} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Reason Input */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Reason"
                            {...register('reason', { required: 'Reason is required' })}
                            error={!!errors.reason}
                            helperText={errors.reason?.message}
                            sx={{ mb: 2 }}
                        />
                    </Grid>

                    {/* Price Input */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            {...register('price', { required: 'Price is required' })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachMoneyIcon />
                                    </InputAdornment>
                                ),
                            }}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                            sx={{ mb: 2 }}
                        />
                    </Grid>

                    {/* Discount Input */}
                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="Discount"
                            {...register('discount', { required: 'Discount is required' })}
                            onChange={handleDiscountTypeChange}
                            error={!!errors.discount}
                            helperText={errors.discount?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DiscountIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="" disabled>Select Discount</MenuItem>
                            {discounts.map((discount, index) => (
                                <MenuItem key={index} value={discount}>
                                    {discount}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {isOtherDiscount && (
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Other Discount"
                                type="number"
                                {...register('discount', { required: 'Discount is required' })}
                                onChange={handleOtherDiscountChange}
                                error={!!errors.discount}
                                helperText={errors.discount?.message}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                    )}

                    {/* Paid Input */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Paid"
                            type="number"
                            {...register('paid', { required: 'Paid amount is required' })}
                            onChange={handlePaidChange}
                            error={!!errors.paid}
                            helperText={errors.paid?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachMoneyIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                        />
                    </Grid>

                    {/* Rest Input */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Rest"
                            type="number"
                            {...register('rest', { required: 'Rest amount is required' })}
                            error={!!errors.rest}
                            helperText={errors.rest?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachMoneyIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                            disabled
                        />
                    </Grid>

                    {/* Total Input */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Total"
                            type="number"
                            {...register('total', { required: 'Total amount is required' })}
                            error={!!errors.total}
                            helperText={errors.total?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachMoneyIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                            disabled
                        />
                    </Grid>
                </Grid>

                <Grid container item xs={4} alignItems="flex-end">
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mb: 1 }}>
                            Create Appointment
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleCancel} fullWidth>
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AppointmentCreate;
