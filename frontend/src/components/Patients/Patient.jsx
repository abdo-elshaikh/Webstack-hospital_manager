import {
    getPatients,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientByName,
    getPatientByCode,
    getMaxCode
} from '../../services/PatientService';
import PatientAppointment from '../Appointments/PatientAppointment';
import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { getCurrentUser } from '../../services/AuthService';
import { toast } from 'react-toastify';
import {
    Modal,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TablePagination,
    TableSortLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Checkbox
} from '@mui/material';
import { Edit, Delete, Search, Add, CalendarToday } from '@mui/icons-material';
import '../../styles/patient.css';

const Patient = ({ currentUser, open }) => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [maxCode, setMaxCode] = useState(0);
    const emptyPatient = {
        name: '',
        code: 0,
        age: 0,
        address: '',
        phone: '',
        description: '',
        create_by: currentUser,
    };

    const [patient, setPatient] = useState(emptyPatient);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [searchResult, setSearchResult] = useState([]);
    const [sortDirection, setSortDirection] = useState('asc');
    const [orderBy, setOrderBy] = useState('code');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchAllPatients();
    }, []);

    useEffect(() => {
        getMaxPatientCode();
    }, [patients]);

    const getMaxPatientCode = () => {
        // getMaxCode().then(response => {
        //     if (response.error) {
        //         toast.error(response.error);
        //         return;
        //     }
        //     setMaxCode(response.maxCode + 1);
        // });
        const maxCode = patients.map(patient => patient.code).reduce((acc, curr) => Math.max(acc, curr), 0);
        setMaxCode(maxCode + 1);
    };

    const fetchAllPatients = () => {
        setPatients([]);
        getPatients()
            .then(response => {
                if (!response || !Array.isArray(response.patients)) {
                    toast.error('Failed to fetch patients');
                    return;
                }
                setPatients(response.patients);
            })
            .catch(error => {
                toast.error('Failed to fetch patients', error);
            });
        setSearchResult([]);
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchType || !search) {
            toast.error('Please enter a search type and search term');
            return;
        }

        let searchResponse;
        try {
            if (searchType === 'name') {
                searchResponse = await getPatientByName(search);
            } else if (searchType === 'code') {
                searchResponse = await getPatientByCode(search);
            } else {
                setSearchResult([]);
                toast.error('Please enter a valid search type');
                return;
            }
        } catch (error) {
            toast.error('Something went wrong');
            return;
        }

        if (searchResponse.error) {
            toast.error(searchResponse.error);
            return;
        }

        const { patients, patient } = searchResponse;
        const searchResult = searchType === 'name' ? patients : [patient];
        setSearchResult(searchResult);
        toast.success(searchResponse.message);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
    };

    const handleCreateOrEdit = async (e) => {
        e.preventDefault();
        if (!validPhoneNumber(patient.phone)) {
            return;
        }
        console.log(patient);
        if (isEdit) {
            const response = await updatePatient(patient._id, patient);
            if (response.error) {
                toast.error(response.error);
            } else {
                const updatedPatients = patients.map((p) => (p._id === patient._id ? response.patient : p));
                setPatients(updatedPatients);
                toast.success(response.message);
            }
        } else {
            const response = await createPatient({ ...patient, code: maxCode });
            if (response.error) {
                toast.error(response.error);
            } else {
                setPatients([...patients, response.patient]);
                toast.success(response.message);
            }
        }
        setPatient(emptyPatient);
        setIsEdit(false);
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        deletePatient(id).then((response) => {
            if (response.error) {
                toast.error(response.error);
            } else {
                toast.success(response.message);
                setPatients(patients.filter((patient) => patient._id !== id));
            }
        });
    };

    const handleDeleteSelected = (patientsSelected) => {
        patientsSelected.forEach((patientId) => {
            handleDelete(patientId);
            setPatients(patients.filter((p) => p._id !== patientId));
        });
        setSelected([]);
    }

    const handleModalClose = () => {
        setPatient(emptyPatient);
        setIsEdit(false);
        setIsModalOpen(false);
    };

    const validPhoneNumber = (phoneNumber) => {
        const regex = /^01[0125][0-9]{8}$/;
        if (!regex.test(phoneNumber)) {
            toast.error('Phone number must be a valid Egyptian phone number');
            return false;
        }
        if (phoneNumber.length !== 11) {
            toast.error('Phone number must be 11 digits');
            return false;
        }
        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatient({ ...patient, [name]: value, create_by: currentUser ? currentUser : getCurrentUser() });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (property) => {
        const isAscending = orderBy === property && sortDirection === 'asc';
        setSortDirection(isAscending ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(patients.map((p) => p._id));
        } else {
            setSelected([]);
        }
    };

    const handleSelectClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const sortPatients = (data) => {
        return data.sort((a, b) => {
            if (a[orderBy] < b[orderBy]) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (a[orderBy] > b[orderBy]) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const linkToPatientAppointments = (patient) => {
        // navigate to patient appointments and pass patient data
        navigate(`/admin/patient-appointment`, { state: { patient } });
    };

    const sortedPatients = sortPatients(searchResult.length > 0 ? searchResult : patients);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedPatients.length - page * rowsPerPage);

    return (
        <Box component={Paper} p={2} sx={{ width: '100%', bgcolor: 'background.paper', }} >
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={2} sx={{ width: '100%' }}>
                <Button variant='contained' startIcon={<Add />} onClick={() => setIsModalOpen(true)}>
                    Add Patient
                </Button>
                <Button
                    variant='contained'
                    color='error'
                    startIcon={<Delete />}
                    onClick={() => handleDeleteSelected(selected)}
                    disabled={selected.length === 0}
                >
                    Delete Selected
                </Button>
            </Box>
            <Box  component={Paper} p={2} mb={2} bgcolor={'#f8f9fa'}>
                <form onSubmit={handleSearch}>
                    <Box alignContent={'center'} display='flex' justifyContent='space-between' alignItems='center'>
                        <TextField
                            label='Search'
                            variant='outlined'
                            value={search}
                            onChange={handleSearchChange}
                            style={{ flex: 2, marginRight: '1rem' }}
                        />
                        <FormControl style={{ flex: 1, marginRight: '1rem' }}>
                            <InputLabel>Search By</InputLabel>
                            <Select
                                value={searchType}
                                onChange={handleSearchTypeChange}
                                label='Search By'
                            >
                                <MenuItem value='name'>Name</MenuItem>
                                <MenuItem value='code'>Code</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant='contained' color='primary' type='submit' startIcon={<Search />}>
                            Search
                        </Button>
                    </Box>
                </form>
            </Box>
            <TableContainer  >
                <Table aria-label="simple table"  size='small' >
                    <TableHead>
                        <TableRow>
                            <TableCell padding='checkbox'>
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < patients.length}
                                    checked={patients.length > 0 && selected.length === patients.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'code'}
                                    direction={orderBy === 'code' ? sortDirection : 'asc'}
                                    onClick={() => handleSort('code')}
                                >
                                    Code
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? sortDirection : 'asc'}
                                    onClick={() => handleSort('name')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient) => {
                            const isItemSelected = isSelected(patient._id);
                            return (
                                <TableRow
                                    hover
                                    key={patient._id}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding='checkbox'>
                                        <Checkbox
                                            checked={isItemSelected}
                                            onChange={(event) => handleSelectClick(event, patient._id)}
                                        />
                                    </TableCell>
                                    <TableCell>{patient.code}</TableCell>
                                    <TableCell>{patient.name}</TableCell>
                                    <TableCell>{patient.age}</TableCell>
                                    <TableCell>{patient.address}</TableCell>
                                    <TableCell>{patient.phone}</TableCell>
                                    <TableCell>{patient.gender}</TableCell>
                                    <TableCell>{patient.description}</TableCell>
                                    <TableCell align='right' sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton onClick={() => {
                                            setPatient(patient);
                                            setIsEdit(true);
                                            setIsModalOpen(true);
                                        }}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(patient._id)}>
                                            <Delete />
                                        </IconButton>
                                        <IconButton onClick={() => linkToPatientAppointments(patient)}>
                                            <CalendarToday />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {/* {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={7} />
                            </TableRow>
                        )} */}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component='div'
                count={patients.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Dialog open={isModalOpen} onClose={handleModalClose} fullWidth maxWidth='sm'>
                <DialogTitle>{isEdit ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField
                            fullWidth
                            name='name'
                            label='Name'
                            value={patient.name}
                            onChange={handleInputChange}
                            margin='dense'
                        />
                        <TextField
                            fullWidth
                            name='code'
                            label='Code'
                            value={patient.code || maxCode }
                            onChange={handleInputChange}
                            margin='dense'
                            disabled
                        />
                        <TextField
                            fullWidth
                            name='age'
                            label='Age'
                            value={patient.age}
                            onChange={handleInputChange}
                            margin='dense'
                        />
                        <FormControl style={{ width: '100%' }} >
                            <InputLabel>Gender</InputLabel>
                            <Select
                                name='gender'
                                value={patient.gender}
                                onChange={handleInputChange}
                                label='Gender'
                            >
                                <MenuItem value='male'>Male</MenuItem>
                                <MenuItem value='female'>Female</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            name='address'
                            label='Address'
                            value={patient.address}
                            onChange={handleInputChange}
                            margin='dense'
                        />
                        <TextField
                            fullWidth
                            name='phone'
                            label='Phone'
                            value={patient.phone}
                            onChange={handleInputChange}
                            margin='dense'

                        />
                        <TextField
                            fullWidth
                            name='description'
                            label='Description'
                            value={patient.description}
                            onChange={handleInputChange}
                            margin='dense'
                            multiline
                            rows={3}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose} color='primary'>
                        Cancel
                    </Button>
                    <Button onClick={handleCreateOrEdit} color='primary'>
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Patient;
