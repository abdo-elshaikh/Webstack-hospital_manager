import { useState, useEffect } from 'react';
import { getservices, createService, updateService, deleteService } from '../../services/priceService';
import { getAllDepartments, createDepartment } from '../../services/departmentService';
import {
    Modal,
    Button,
    Table,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Pagination
} from '@mui/material';
import { Add, Edit, Delete, Upload } from '@mui/icons-material';
import { toast } from 'react-toastify';
import '../../styles/service.css';
import Papa from 'papaparse'; // CSV parsing library
import { Container } from 'react-bootstrap';

const Service = ({ open }) => {
    const [services, setServices] = useState([]);
    const [service, setService] = useState({ departmentId: '', service: '', prices: { cash: '', insurance: '', contract: '' } });
    const [departmentsService, setDepartmentsService] = useState([]);
    const [isInEdit, setIsInEdit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(false); // Loading state for fetching
    const [uploadLoading, setUploadLoading] = useState(false); // Loading state for uploading

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [servicesPerPage] = useState(10); // Number of services to display per page

    useEffect(() => {
        const fetchData = async () => {
            setFetchLoading(true); // Start fetching loading
            try {
                const serviceData = await getservices();
                if (serviceData.error) {
                    toast.error(serviceData.error);
                } else {
                    setServices(serviceData.services);
                }

                const departmentData = await getAllDepartments();
                if (departmentData.error) {
                    toast.error(departmentData.error);
                } else {
                    setDepartmentsService(departmentData.departments);
                }
            } catch (error) {
                toast.error('Error fetching data');
                console.error(error);
            } finally {
                setFetchLoading(false); // End fetching loading
            }
        };

        fetchData();
    }, []);

    // Pagination logic
    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = services.slice(indexOfFirstService, indexOfLastService);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'cash' || name === 'insurance' || name === 'contract') {
            setService((prevService) => ({
                ...prevService,
                prices: { ...prevService.prices, [name]: value }
            }));
        } else {
            setService((prevService) => ({
                ...prevService,
                [name]: value
            }));
        }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        const { departmentId, service: serviceName, prices } = service;

        if (!departmentId || !serviceName || !prices.cash || !prices.insurance || !prices.contract) {
            toast.error('All fields are required');
            return;
        }

        const serviceData = {
            departmentId,
            service: serviceName,
            prices: [
                { type: 'cash', price: prices.cash, description: 'Cash Payment' },
                { type: 'insurance', price: prices.insurance, description: 'Insurance Payment' },
                { type: 'contract', price: prices.contract, description: 'Contract Payment' }
            ]
        };

        try {
            if (isInEdit) {
                const data = await updateService(service._id, serviceData);
                if (data.error) {
                    toast.error(data.error);
                } else {
                    setServices((prevServices) =>
                        prevServices.map((s) =>
                            s._id === service._id ? data.service : s
                        )
                    );
                    toast.success('Service updated successfully');
                }
            } else {
                const data = await createService(serviceData);
                if (data.error) {
                    toast.error(data.error);
                } else {
                    setServices((prevServices) => [...prevServices, data.service]);
                    toast.success('Service created successfully');
                }
            }
        } catch (error) {
            toast.error('Error creating/updating service');
            console.error(error);
        } finally {
            setService({ departmentId: '', service: '', prices: { cash: '', insurance: '', contract: '' } });
            setIsInEdit(false);
            setIsModalOpen(false);
        }
    };

    const handleEdit = (id) => {
        const serv = services.find((s) => s._id === id);
        const prices = {
            cash: serv.prices.find(price => price.type === 'cash')?.price || '',
            insurance: serv.prices.find(price => price.type === 'insurance')?.price || '',
            contract: serv.prices.find(price => price.type === 'contract')?.price || ''
        };
        setService({ ...serv, departmentId: serv.department._id, prices });
        setIsModalOpen(true);
        setIsInEdit(true);
    };

    const handleDelete = async (id) => {
        try {
            const data = await deleteService(id);
            if (data.error) {
                toast.error(data.error);
            } else {
                setServices((prevServices) => prevServices.filter((s) => s._id !== id));
                toast.success('Service deleted successfully');
            }
        } catch (error) {
            toast.error('Error deleting service');
            console.error(error);
        }
    };

    const createNewDepartment = async (name) => {
        console.log('createNewDepartment', name);
        const department = { name, description: `${name} department description` };
        const data = await createDepartment(department);
        if (data.error) {
            toast.error(data.error);
            return null;
        } else {
            console.log('created NewDepartment', data.department);
            setDepartmentsService((prevDepartments) => [...prevDepartments, data.department]);
            return data.department;
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            setIsUploadModalOpen(true);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('No file selected');
            return;
        }

        setUploadLoading(true);

        Papa.parse(file, {
            header: true,
            complete: async (results) => {
                try {
                    const departmentIdMap = {};
                    for (const department of departmentsService) {
                        departmentIdMap[department.name] = department._id;
                    }

                    const servicesData = await Promise.all(
                        results.data.map(async (row) => {
                            let departmentId = departmentIdMap[row.departmentName];
                            if (!departmentId) {
                                // create new department
                                const newDepartment = await createNewDepartment(row.departmentName);
                                if (!newDepartment) {
                                    return null;
                                }
                                departmentIdMap[newDepartment.name] = newDepartment._id;
                                departmentId = newDepartment._id;
                            }

                            if (!row.service || !row.cash || !row.insurance || !row.contract) {
                                toast.error('Missing required fields');
                                return null;
                            }

                            return {
                                departmentId,
                                service: row.service,
                                prices: [
                                    { type: 'cash', price: row.cash, description: 'Cash Payment' },
                                    { type: 'insurance', price: row.insurance, description: 'Insurance Payment' },
                                    { type: 'contract', price: row.contract, description: 'Contract Payment' }
                                ]
                            };
                        })
                    );

                    const validServicesData = servicesData.filter(Boolean);
                    for (const serviceData of validServicesData) {
                        const data = await createService(serviceData);
                        if (data.error) {
                            toast.error(data.error);
                            return;
                        }
                        setServices((prevServices) => [...prevServices, data.service]);
                    }

                    toast.success('Services uploaded successfully');
                } catch (error) {
                    toast.error('Error uploading services');
                    console.error(error);
                } finally {
                    setUploadLoading(false);
                    setIsUploadModalOpen(false);
                    setFile(null);
                }
            },
            error: () => {
                toast.error('Error parsing file');
                setUploadLoading(false);
            },
        });
    };


    return (
        <Box className="service" component="section" >
            <div className="service__header container d-flex justify-content-between bg-secondary p-2">
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                        setService({ departmentId: '', service: '', prices: { cash: '', insurance: '', contract: '' } });
                        setIsModalOpen(true);
                    }}
                >
                    Add Service
                </Button>
                <Button
                    variant="contained"
                    startIcon={<Upload />}
                    component="label"
                >
                    Upload Services
                    <input
                        type="file"
                        hidden
                        accept=".csv"
                        onChange={handleFileUpload}
                    />
                </Button>
            </div>
            {uploadLoading && <LinearProgress color="secondary" sx={{ mt: 2 }} value={100} variant="determinate" />}

            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <DialogTitle>{isInEdit ? 'Edit Service' : 'Add Service'}</DialogTitle>
                <DialogContent>
                    <FormGroup>
                        <InputLabel>Department</InputLabel>
                        <Select
                            name="departmentId"
                            value={service.departmentId}
                            onChange={handleInputChange}
                            fullWidth
                        >
                            <MenuItem value="">Select Department</MenuItem>
                            {departmentsService.map((d) => (
                                <MenuItem key={d._id} value={d._id}>
                                    {d.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            label="Service"
                            name="service"
                            value={service.service}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            label="Cash Price"
                            name="cash"
                            value={service.prices.cash}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            label="Insurance Price"
                            name="insurance"
                            value={service.prices.insurance}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            label="Contract Price"
                            name="contract"
                            value={service.prices.contract}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsModalOpen(false)} color="secondary">
                        Close
                    </Button>
                    <Button onClick={handleCreateOrUpdate} color="primary">
                        {isInEdit ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)}>
                <DialogTitle>Upload Services</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        File: {file ? file.name : 'No file selected'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsUploadModalOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} color="primary" disabled={uploadLoading}>
                        {uploadLoading ? 'Uploading...' : 'Upload'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Table sx={{ mt: 2 }} size="small">
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Service</th>
                        <th>Cash Price</th>
                        <th>Insurance Price</th>
                        <th>Contract Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentServices.map((s) => (
                        <tr key={s._id}>
                            <td>{s.department?.name}</td>
                            <td>{s.service}</td>
                            <td>{s.prices?.find(price => price?.type === 'cash')?.price}</td>
                            <td>{s.prices?.find(price => price?.type === 'insurance')?.price}</td>
                            <td>{s.prices?.find(price => price?.type === 'contract')?.price}</td>
                            <td>
                                <IconButton
                                    color="primary"
                                    onClick={() => handleEdit(s._id)}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    color="secondary"
                                    onClick={() => handleDelete(s._id)}
                                >
                                    <Delete />
                                </IconButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination
                sx={{ mt: 2 }}
                count={Math.ceil(services.length / servicesPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"

            />

        </Box>
    );
};

export default Service;
