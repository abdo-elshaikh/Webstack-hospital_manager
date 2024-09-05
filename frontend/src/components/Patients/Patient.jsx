import {
    getPatients,
    deletePatient,
} from '../../services/PatientService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
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
    Checkbox,

} from '@mui/material';
import { Edit, Delete, Search, Add, CalendarToday } from '@mui/icons-material';
import '../../styles/patient.css';

const Patient = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [sortDirection, setSortDirection] = useState('asc');
    const [orderBy, setOrderBy] = useState('code');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dateType, setDateType] = useState('');
    const [searchElements, setSearchElements] = useState({
        code: '',
        name: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        fetchAllPatients();
    }, []);


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

   
    const handleDateType = async () => {

        let startDate = '';
        let endDate = '';
        console.log(dateType, 'date type');

        // Adjust dates based on the selected date type
        switch (dateType) {
            case 'today':
                startDate = endDate = new Date().toISOString().split('T')[0];
                break;
            case 'yesterday':
                startDate = endDate = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
                break;
            case 'beforeYasterday':
                startDate = endDate = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0];
                break;
            case 'thisWeek':
                startDate = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
                endDate = new Date().toISOString().split('T')[0];
                break;
            case 'lastWeek':
                startDate = new Date(new Date().setDate(new Date().getDate() - 14)).toISOString().split('T')[0];
                endDate = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
                break;
            case 'thisMonth':
                startDate = new Date(new Date().setDate(1)).toISOString().split('T')[0];
                endDate = new Date().toISOString().split('T')[0];
                break;
            case 'lastMonth':
                startDate = new Date(new Date().setMonth(new Date().getMonth() - 1, 1)).toISOString().split('T')[0];
                endDate = new Date(new Date().setMonth(new Date().getMonth(), 0)).toISOString().split('T')[0];
                break;
            case 'thisYear':
                startDate = new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1)).toISOString().split('T')[0];
                endDate = new Date().toISOString().split('T')[0];
                break;
            case 'lastYear':
                startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1, 0, 1)).toISOString().split('T')[0];
                endDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1, 11, 31)).toISOString().split('T')[0];
                break;
            case 'dateRange':
                startDate = new Date(searchElements.startDate).toISOString().split('T')[0];
                endDate = new Date(searchElements.endDate).toISOString().split('T')[0];
                break;
            default:
                startDate = '';
                endDate = '';
        }

        // Set the search elements with the adjusted dates
        return { startDate, endDate };
    };

    const searchPatients = async (e) => {
        // console.log(patients, 'patients');
        e.preventDefault();
        const { startDate, endDate } = await handleDateType();
        searchElements.startDate = startDate;
        searchElements.endDate = endDate;
        console.log(searchElements, 'searchElements');

        const filterByCode = patients.filter((patient) => patient.code === Number(searchElements.code));

        const filterByDtae = patients.filter((patient) => {
            if (!patient || !startDate || !endDate) {
                return false;
            }

            const patientDate = new Date(patient.createdAt);
            const searchStartDate = new Date(startDate);
            const searchEndDate = new Date(endDate);

            return patientDate >= searchStartDate && patientDate <= searchEndDate;
        })

        console.log(filterByDtae, 'filterByDtae');

        if (filterByCode.length > 0) {
            setSearchResult(filterByCode);
            console.log(filterByCode, 'filterByCode');
        } else if (filterByDtae.length > 0 && searchElements.name !== '') {
            const searchByName = filterByDtae.filter((patient) => patient.name.toLowerCase().includes(searchElements.name.toLowerCase()));
            setSearchResult(searchByName);
            console.log(searchByName, 'searchByNameAndDate');
        } else if (searchElements.name !== '') {
            const searchByName = patients.filter((patient) => patient.name.toLowerCase().includes(searchElements.name.toLowerCase()));
            setSearchResult(searchByName);
            console.log(searchByName, 'searchByName');
        } else if (filterByDtae.length > 0) {
            setSearchResult(filterByDtae);
            console.log(filterByDtae, 'filterByDtae');
        } else {
            toast.error('No results found for the search criteria');
        }
    };


    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchElements({ ...searchElements, [name]: value });
    };

    const handleDateTypeChange = (e) => {
        setDateType(e.target.value);
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


    return (
        <Box component={Paper} p={2} sx={{ width: '100%', bgcolor: 'background.paper', }} >
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={2} sx={{ width: '100%', mb: 2 }}>
                {/* <Button variant='contained' startIcon={<Add />} onClick={() => setIsModalOpen(true)}>
                    Add Patient
                </Button> */}
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
            <form onSubmit={searchPatients} style={{ width: '100%', border: '1px solid #ccc', marginBottom: '20px', padding: '10px' }} >
                <Box alignContent={'center'} display='flex' justifyContent='space-between' alignItems='center' marginBottom={2}>
                    <TextField
                        label='By Name'
                        variant='outlined'
                        name='name'
                        value={searchElements.name}
                        onChange={handleSearchChange}
                        style={{ flex: 1, marginRight: '1rem' }}
                    />
                    <TextField
                        label='By Code'
                        variant='outlined'
                        name='code'
                        value={searchElements.code}
                        onChange={handleSearchChange}
                        style={{ flex: 1, marginRight: '1rem' }}
                    />
                    <FormControl style={{ flex: 1, marginRight: '1rem' }}>
                        <InputLabel>Search By Date</InputLabel>
                        <Select
                            value={dateType}
                            onChange={handleDateTypeChange}
                            label='Date Type'
                        >
                            <MenuItem value='today'>Today</MenuItem>
                            <MenuItem value='yesterday'>Yesterday</MenuItem>
                            <MenuItem value='beforeYasterday'>Before Yesterday</MenuItem>
                            <MenuItem value='thisWeek'>This Week</MenuItem>
                            <MenuItem value='lastWeek'>Last Week</MenuItem>
                            <MenuItem value='thisMonth'>This Month</MenuItem>
                            <MenuItem value='lastMonth'>Last Month</MenuItem>
                            <MenuItem value='thisYear'>This Year</MenuItem>
                            <MenuItem value='lastYear'>Last Year</MenuItem>
                            <MenuItem value='dateRange'>Date Range</MenuItem>
                        </Select>
                    </FormControl>
                    {dateType === 'dateRange' && (
                        <>
                            <TextField
                                label='Start Date'
                                type='date'
                                variant='outlined'
                                value={searchElements.startDate}
                                onChange={(e) => setSearchElements({ ...searchElements, startDate: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                                style={{ flex: 1, marginRight: '1rem' }}
                            />
                            <TextField
                                label='End Date'
                                type='date'
                                variant='outlined'
                                value={searchElements.endDate}
                                onChange={(e) => setSearchElements({ ...searchElements, endDate: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                                style={{ flex: 1, marginRight: '1rem' }}
                            />
                        </>
                    )}
                    <Button variant='contained' color='primary' type='submit' startIcon={<Search />}>
                        Search
                    </Button>
                </Box>
            </form>
            <TableContainer  >
                <Table aria-label="simple table" size='small' >
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
                            <TableCell>First Visit</TableCell>
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
                                    <TableCell>{patient.createdAt?.slice(0, 10)}</TableCell>
                                    <TableCell>{patient.description}</TableCell>
                                    <TableCell align='right' sx={{ display: 'flex', gap: 1 }}>
                                        {/* <IconButton onClick={() => {
                                            setPatient(patient);
                                        }}>
                                            <Edit />
                                        </IconButton> */}
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
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component={Box}
                sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}
                count={patients.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

        </Box>
    );
};

export default Patient;
