import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { createAppointment } from '../../services/appointmentService';
import { getServicesByDepartment, getServicePriceByType } from '../../services/priceService';
import { getStaffByDepartment } from '../../services/staffService';
import { getAllDepartments } from '../../services/departmentService';
import { TextField, MenuItem, Button, Box, Typography, Divider, InputAdornment, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faNotesMedical, faCalendar, faUserMd, faStethoscope, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/appointments.css';

const AppointmentCreate = ({ patient, setIsModalOpen }) => {
    const { user } = useAuth();
    const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
        defaultValues: {
            patient: patient?.id || '',
            department: '',
            service: '',
            staff: '',
            serviceType: '',
            date: new Date(),
            reason: '',
            discountReason: '',
            status: 'pending',
            price: 0,
            discount: 0,
            paid: 0,
            rest: 0,
            total: 0,
            createdBy: user._id,
        }
    });
    const [departments, setDepartments] = useState([]);
    const [services, setServices] = useState([]);
    const [staff, setStaff] = useState([]);
    const [servicePrice, setServicePrice] = useState([]);
    const [isOtherDiscount, setIsOtherDiscount] = useState(false);
    const [otherDiscount, setOtherDiscount] = useState('');

    // const serviceTypes = ['cash', 'insurance', 'contract'];
    const discounts = ['10%', '20%', '25%', '30%', '50%', '75%', '100%', 'other'];

    useEffect(() => {
        fetchDepartments();
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

    const handleServiceChange = async (e) => {
        const serviceId = e.target.value;
        setValue('service', serviceId);
        const service = services.find(service => service._id === serviceId);
        setServicePrice(service?.prices || []);
        if (service && service.prices.length > 0) {
            setValue('serviceType', service.prices[0].type);
            setValue('price', service.prices[0].price);
            calculateServiceAmount();
        }
    };

    const handleServiceTypeChange = (e) => {
        const type = e.target.value;
        setValue('serviceType', type);
        const service = services.find(service => service._id === watch('service'));
        const priceInfo = service?.prices.find(price => price.type === type);
        if (priceInfo) {
            setValue('price', priceInfo.price);
            calculateServiceAmount();
        }
    };

    const handleDiscountChange = (e) => {
        const discountValue = e.target.value;
        if (discountValue === 'other' && !isOtherDiscount) {
            setIsOtherDiscount(true);
            // toast.info('add custom discount');
        } else {
            setIsOtherDiscount(false);
            const discount = (Number(discountValue.replace('%', '')) / 100) * watch('price');
            setValue('discount', discount);
            setOtherDiscount(discount);
            calculateServiceAmount();
        }
    };

    const handleOtherDiscountChange = (e) => {
        const discountValue = e.target.value;
        setOtherDiscount(discountValue);
        setValue('discount', discountValue);
        calculateServiceAmount();
    };

    const handlePaidChange = (e) => {
        const paidValue = e.target.value;
        setValue('paid', paidValue);
        calculateServiceAmount();
    };

    const calculateServiceAmount = () => {
        const price = Number(watch('price'));
        const discount = Number(watch('discount') || 0);
        const paid = Number(watch('paid') || price - discount);
        const rest = price - paid;
        const total = rest + paid;
        console.log({ 'price': price, 'discount': discount, 'paid': paid, 'rest': rest, 'total': total });
        setValue('rest', rest);
        setValue('paid', paid);
        setValue('total', total);
    };
    // const fetchServiceAmount = () => {
    //     const price = watch('price');
    //     const discount = watch('discount') || 0;
    //     const paid = watch('paid') ? Number(watch('paid')) : Number(price) - Number(discount);
    //     const rest = Number(price) - Number(paid);
    //     const total = Number(rest) - Number(discount);

    //     setValue('rest', rest);
    //     setValue('paid', paid);
    //     setValue('total', total);
    // };

    const onSubmit = async (data) => {
        console.log(data);
        if (new Date(data.date) < new Date()) {
            toast.error('Please select a date in the future.');
            return;
        }
        try {
            const response = await createAppointment({ ...data, patient: patient?._id, create_by: user?._id });
            console.log(response.appointment);
            toast.success(`Appointment created successfully for ${patient.name}`);
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Error creating appointment.');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        reset({
            service: '',
            serviceType: '',
            price: 0,
            discount: 0,
            paid: 0,
            rest: 0,
            total: 0,
            staff: '',
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, px: 1 }}>
            <Divider sx={{ mb: 2 }} />
            <Grid container sx={{ border: '1px solid #ccc', borderRadius: '5px', px: 2 }} spacing={2}>
                {/* Patient Input */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Patient"
                        value={patient.name}
                        disabled
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faUser} />
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
                                    <FontAwesomeIcon icon={faUserMd} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="">Select Department</MenuItem>
                        {departments.map(department => (
                            <MenuItem key={department._id} value={department._id}>
                                {department.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Service Input */}
                <Grid item xs={6}>
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
                                    <FontAwesomeIcon icon={faStethoscope} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="">Select Service</MenuItem>
                        {services.map(service => (
                            <MenuItem key={service._id} value={service._id}>
                                {service.service}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Service Type Input */}
                <Grid item xs={6}>
                    <TextField
                        select
                        fullWidth
                        label="Service Type"
                        {...register('serviceType', { required: 'Service type is required' })}
                        onChange={handleServiceTypeChange}
                        error={!!errors.serviceType}
                        helperText={errors.serviceType?.message}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faNotesMedical} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="">Select Service Type</MenuItem>
                        {servicePrice.map((type, index) => (
                            <MenuItem key={index} value={type.type}>
                                {type.type}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Price Input */}
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        {...register('price')}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faDollarSign} />
                                </InputAdornment>
                            ),
                        }}
                        disabled
                        sx={{ mb: 2 }}
                    />
                </Grid>

                {/* Discount Type Input */}
                <Grid item xs={4}>
                    <TextField
                        select
                        fullWidth
                        label="Discount"
                        {...register('discountType')}
                        onChange={handleDiscountChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faDollarSign} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="">Select Discount</MenuItem>
                        {discounts.map((discount, index) => (
                            <MenuItem key={index} value={discount}>
                                {discount}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Other Discount Input */}
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        label="Other Discount"
                        type="number"
                        value={otherDiscount}
                        onChange={handleOtherDiscountChange}
                        disabled={!isOtherDiscount}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faDollarSign} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                </Grid>

                {/* Discount Reason Input */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Discount Reason"
                        {...register('discountReason')}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faDollarSign} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                </Grid>

                {/* Paid Input */}
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        label="Paid"
                        type="number"
                        {...register('paid')}
                        onChange={handlePaidChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faDollarSign} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                </Grid>

                {/* Rest Input */}
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        label="Rest"
                        type="number"
                        {...register('rest')}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faDollarSign} />
                                </InputAdornment>
                            ),
                        }}
                        disabled
                        sx={{ mb: 2 }}
                    />
                </Grid>

                {/* Total Input */}
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        label="Total"
                        type="number"
                        {...register('total')}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faDollarSign} />
                                </InputAdornment>
                            ),
                        }}
                        disabled
                        sx={{ mb: 2 }}
                    />
                </Grid>

                {/* Date Input */}
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        type="datetime-local"
                        label="Date"
                        {...register('date', { required: 'Date is required' })}
                        error={!!errors.date}
                        helperText={errors.date?.message}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faCalendar} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                </Grid>

                {/* Staff Input */}
                <Grid item xs={6}>
                    <TextField
                        select
                        fullWidth
                        label="Staff"
                        {...register('staff')}
                        error={!!errors.staff}
                        helperText={errors.staff?.message}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faUserMd} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="">Select Staff</MenuItem>
                        {staff && staff?.map(staffMember => (
                            <MenuItem key={staffMember._id} value={staffMember._id}>
                                {staffMember.user?.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>

            {/* <Divider sx={{ my: 2 }} /> */}
            <Grid container spacing={2} marginTop={1}>
                <Grid item xs={6}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Create Appointment
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button type="button" variant="outlined" color="secondary" fullWidth onClick={handleCancel}>
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AppointmentCreate;
