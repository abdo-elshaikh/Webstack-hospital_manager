import React, { useState, useEffect } from 'react';
import {
    getservices,
    createService,
    updateService,
    deleteService,
} from '../../services/priceService';
import {
    getAllDepartments,
    createDepartment,
} from '../../services/departmentService';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Paper,
    Tabs,
    Tab,
    Toolbar,
    Typography,
    TablePagination,
    Select,
    MenuItem,
} from '@mui/material';
import { Add, Upload, Edit, Delete, SaveAlt } from '@mui/icons-material';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const Service = () => {
    const [services, setServices] = useState([]);
    const [service, setService] = useState({
        departmentId: '',
        service: '',
        prices: { cash: '', insurance: '', contract: '' },
    });
    const [departmentsService, setDepartmentsService] = useState([]);
    const [isInEdit, setIsInEdit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleTabChange = (event, newValue) => {
        setSelectedDepartment(newValue);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch data
    const fetchData = async () => {
        setFetchLoading(true);
        try {
            const serviceData = await getservices();
            if (serviceData?.error) {
                toast.error(serviceData.error);
            } else {
                setServices(serviceData.services);
            }

            const departmentData = await getAllDepartments();
            if (departmentData?.error) {
                toast.error(departmentData.error);
            } else {
                setDepartmentsService(departmentData.departments);
            }
        } catch (error) {
            toast.error('Error fetching data');
            console.error(error);
        } finally {
            setFetchLoading(false);
        }
    };

    // Handle input change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (['cash', 'insurance', 'contract'].includes(name)) {
            setService((prevService) => ({
                ...prevService,
                prices: { ...prevService.prices, [name]: value },
            }));
        } else {
            setService((prevService) => ({
                ...prevService,
                [name]: value,
            }));
        }
    };

    // Create or update service
    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        const { departmentId, service: serviceName, prices } = service;
        if (!departmentId || !service || !prices.cash || !prices.insurance || !prices.contract) {
            toast.error('Please fill in all required fields');
            return;
        }

        const serviceData = {
            departmentId,
            service: serviceName,
            prices: [
                { type: 'cash', price: prices.cash, description: 'Cash Payment' },
                { type: 'insurance', price: prices.insurance, description: 'Insurance Payment' },
                { type: 'contract', price: prices.contract, description: 'Contract Payment' },
            ],
        };

        try {
            if (isInEdit) {
                const data = await updateService(service._id, serviceData);
                if (data?.error) {
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
                if (data?.error) {
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
            setService({
                departmentId: '',
                service: '',
                prices: { cash: '', insurance: '', contract: '' },
            });
            setIsInEdit(false);
            setIsModalOpen(false);
        }
    };

    // Handle edit
    const handleEdit = (id) => {
        const serv = services.find((s) => s._id === id);
        const prices = {
            cash: serv.prices.find((price) => price.type === 'cash')?.price || '',
            insurance: serv.prices.find((price) => price.type === 'insurance')?.price || '',
            contract: serv.prices.find((price) => price.type === 'contract')?.price || '',
        };
        setService({ ...serv, departmentId: serv.department._id, prices });
        setIsModalOpen(true);
        setIsInEdit(true);
    };

    // Handle delete
    const handleDelete = async (id) => {
        try {
            const data = await deleteService(id);
            if (data?.error) {
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

    // Create new department
    const createNewDepartment = async (name) => {
        const department = {
            name,
            description: `${name} department description`,
        };
        const data = await createDepartment(department);
        if (data?.error) {
            toast.error(data.error);
            return null;
        } else {
            setDepartmentsService((prevDepartments) => [...prevDepartments, data.department]);
            return data.department;
        }
    };

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            setIsUploadDialogOpen(true);
        }
    };

    // Handle upload services 
    const handleUpload = async () => {
        if (!file) {
            toast.error('No file selected for upload');
            return;
        }

        setUploadLoading(true);

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetNames = workbook.SheetNames;
            const departments = sheetNames.map((sheetName) => ({
                name: sheetName.replace(/\s/g, ''),
                description: `${sheetName} department description`,
            }));

            const dataServices = sheetNames.map((sheetName) => {
                const sheet = workbook.Sheets[sheetName];
                return XLSX.utils.sheet_to_json(sheet);
            });

            const newDepartments = [];
            const newServices = [];

            for (let i = 0; i < departments.length; i++) {
                const department = departments[i];
                const departmentExists = departmentsService.find(
                    (d) => d.name.toLowerCase() === department.name.toLowerCase()
                );
                if (!departmentExists) {
                    const newDepartment = await createNewDepartment(department.name);
                    if (newDepartment) {
                        newDepartments.push(newDepartment);
                    }
                } else {
                    newDepartments.push(departmentExists);
                }

                for (let j = 0; j < dataServices[i].length; j++) {
                    const service = dataServices[i][j];
                    const serviceExists = services.find(
                        (s) => s.service.toLowerCase() === service.service.toLowerCase()
                    );
                    if (!serviceExists) {
                        const newService = await createService({
                            departmentId: newDepartments[i]._id,
                            service: service.service,
                            prices: [
                                { type: 'cash', price: service.cash, description: 'Cash Payment' },
                                { type: 'insurance', price: service.insurance, description: 'Insurance Payment' },
                                { type: 'contract', price: service.contract, description: 'Contract Payment' },
                            ],
                        });
                        if (newService) {
                            newServices.push(newService);
                        }
                    } else {
                        newServices.push(serviceExists);
                    }
                }

                setDepartmentsService(newDepartments);
                setServices(newServices);
            }

            toast.success('Services uploaded successfully');
            setUploadLoading(false);
            setIsUploadDialogOpen(false);
            setFile(null);
        };

        reader.readAsBinaryString(file);
    };

    // export data to csv
    const handleExport = () => {
        const dataToExport = filteredServices.map(service => ({
            Service: service.service,
            'Cash Price': service.prices.find(price => price.type === 'cash')?.price || '',
            'Insurance Price': service.prices.find(price => price.type === 'insurance')?.price || '',
            'Contract Price': service.prices.find(price => price.type === 'contract')?.price || '',
            Department: service.department.name,
        }));

        // Create a new workbook and add data
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Services');

        // Generate Excel file and trigger download
        XLSX.writeFile(wb, 'services_data.xlsx');
    };

    // Pagination component
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Pagination component
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredServices = services.filter(service =>
        selectedDepartment === 'All' || service.department.name === selectedDepartment
    );

    const paginatedServices = filteredServices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box component={Paper} sx={{ p: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <Toolbar
                sx={{ border: '1px solid #e0e0e0', mb: 2, borderRadius: 1, display: 'flex', alignItems: 'center' }}
                bgcolor="background.default"
            >
                <Typography variant="h6" component="div">
                    {selectedDepartment.toUpperCase()} Services
                </Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setIsModalOpen(true)}
                    sx={{ ml: 'auto' }}
                >
                    Add Service
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Upload />}
                    component="label"
                    sx={{ ml: 2 }}
                >
                    Upload Services
                    <input type="file" hidden onChange={handleFileUpload} />
                </Button>
                <Button
                    variant="outlined"
                    color="success"
                    startIcon={<SaveAlt />}
                    onClick={handleExport}
                    sx={{ ml: 2 }}
                >
                    Export to CSV
                </Button>
            </Toolbar>

            <Tabs
                value={selectedDepartment}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
                sx={{
                    borderBottom: '1px solid #e0e0e0',
                    mb: 2,
                    backgroundColor: '#f5f5f5', // Background color for the Tabs component
                    borderRadius: 2, // Border radius for rounded corners
                    '& .MuiTab-root': {
                        textTransform: 'none', // Disable uppercase transformation
                        fontWeight: 'bold',
                        color: '#333', // Text color for the tabs
                        '&.Mui-selected': {
                            color: '#1976d2', // Text color for selected tab
                        },
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#1976d2', // Color of the indicator line
                    },
                }}
            >
                <Tab label="All" value="All" />
                {departmentsService.map((department) => (
                    <Tab key={department._id} label={department.name} value={department.name} />
                ))}
            </Tabs>

            {fetchLoading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Service</TableCell>
                                <TableCell>Cash Price</TableCell>
                                <TableCell>Insurance Price</TableCell>
                                <TableCell>Contract Price</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedServices.map((service, index) => (
                                <TableRow key={service._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{service.service}</TableCell>
                                    <TableCell>{service.prices.find((price) => price.type === 'cash')?.price}</TableCell>
                                    <TableCell>{service.prices.find((price) => price.type === 'insurance')?.price}</TableCell>
                                    <TableCell>{service.prices.find((price) => price.type === 'contract')?.price}</TableCell>
                                    <TableCell>{service.department.name}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEdit(service._id)}
                                            sx={{ mr: 1 }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => handleDelete(service._id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredServices.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            borderTop: '1px solid #e0e0e0',
                            mt: 2,
                            backgroundColor: '#f5f5f5',
                            borderRadius: 2,

                        }}
                    />

                </TableContainer>
            )}

            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{isInEdit ? 'Edit Service' : 'Add Service'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleCreateOrUpdate}>
                        <TextField
                            margin="dense"
                            label="Service Name"
                            name="service"
                            value={service.service}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <Select
                            fullWidth
                            margin="dense"
                            value={service.departmentId || ''}
                            name="departmentId"
                            onChange={handleInputChange}
                            displayEmpty
                            required
                        >
                            <MenuItem value="" disabled>
                                Select Department
                            </MenuItem>
                            {departmentsService.map((dept) => (
                                <MenuItem key={dept._id} value={dept._id}>
                                    {dept.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            margin="dense"
                            label="Cash Price"
                            name="cash"
                            value={service.prices.cash}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            type="number"
                        />
                        <TextField
                            margin="dense"
                            label="Insurance Price"
                            name="insurance"
                            value={service.prices.insurance}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            type="number"
                        />
                        <TextField
                            margin="dense"
                            label="Contract Price"
                            name="contract"
                            value={service.prices.contract}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            type="number"
                        />
                        <DialogActions>
                            <Button onClick={() => setIsModalOpen(false)} color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">
                                {isInEdit ? 'Update' : 'Create'}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isUploadDialogOpen} onClose={() => setIsUploadDialogOpen(false)}>
                <DialogTitle>Upload Services</DialogTitle>
                <DialogContent>
                    {uploadLoading ? (
                        <CircularProgress />
                    ) : (
                        <Typography>Are you sure you want to upload the services?</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsUploadDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} color="primary" disabled={uploadLoading}>
                        {uploadLoading ? 'Uploading...' : 'Upload'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Service;
