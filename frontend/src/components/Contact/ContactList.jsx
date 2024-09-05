import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllContacts } from "../../services/contactService";
import {
    Box, Button, Container, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Typography, TablePagination,
    TableSortLabel, FormControl, InputLabel, Select, MenuItem, TextField
} from "@mui/material";
import { toast } from "react-toastify";

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [searchResult, setSearchResult] = useState(contacts);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContacts = async () => {
            const data = await getAllContacts();
            setContacts(data.contacts);
            setSearchResult(data.contacts);
            setTotalItems(data.contacts.length);
        };
        fetchContacts();
    }, []);

    const handleSortRequest = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
        setPage(0);
    };

    const handleDateFilterChange = (event) => {
        setDateFilter(event.target.value);
        setPage(0);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const readContact = async (contact) => {
        navigate(`/admin/contact/${contact._id}`, { state: { contact } });
    };

    const handleSearch = () => {
        if (statusFilter || dateFilter) {
            const filteredContacts = contacts.filter((contact) => {
                const contactDate = new Date(contact.date).toISOString();
                const contactStatus = contact.status;
                const contactDateFilter = dateFilter ? new Date(dateFilter).toISOString() : null;
                const contactStatusFilter = statusFilter ? statusFilter : null;
                return (
                    (contactDateFilter ? contactDateFilter <= contactDate : true) &&
                    (contactStatusFilter ? contactStatusFilter === contactStatus : true)
                );
            });
            setSearchResult(filteredContacts);
            setTotalItems(filteredContacts.length);
        } else {
            setSearchResult(contacts);
            setTotalItems(contacts.length);
            toast.info('No filters applied. Showing all contacts.');
        }
    };


    return (
        <Box >
            <Box sx={{ display: 'grid', 
                gridTemplateColumns: '2fr 2fr 1fr 1fr', 
                justifyContent: 'space-between', 
                gap: 2, mb: 2, bgcolor: '#fff', p: 2 , 
                borderRadius: 1, boxShadow: 2, border: '1px solid #e0e0e0'}}>
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        label="Status"
                        variant="standard"
                    >
                        <MenuItem value="all"><em>All</em></MenuItem>
                        <MenuItem value="received">Received</MenuItem>
                        <MenuItem value="read">Read</MenuItem>
                        <MenuItem value="archived">Archived</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    id="date"
                    label="Date"
                    type="date"
                    variant="standard"
                    value={dateFilter}
                    onChange={handleDateFilterChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleSearch}
                >
                    Search
                </Button>
                <Button
                    variant="outlined"
                    color="success"
                    onClick={() => { setSearchResult(contacts); setTotalItems(contacts.length); setOrder('asc'); setOrderBy('name'); }}
                >
                    Reset
                </Button>

            </Box>

            <TableContainer component={Paper}>
                <Table size="small" aria-label="contacts table">
                    <TableHead >
                        <TableRow>
                            <TableCell sortDirection={orderBy === 'name' ? order : false}>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleSortRequest('name')}
                                    sx={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}

                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sortDirection={orderBy === 'email' ? order : false}>
                                <TableSortLabel
                                    active={orderBy === 'email'}
                                    direction={orderBy === 'email' ? order : 'asc'}
                                    onClick={() => handleSortRequest('email')}
                                >
                                    Email
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                                <TableSortLabel
                                    active={orderBy === 'date'}
                                    direction={orderBy === 'date' ? order : 'asc'}
                                    onClick={() => handleSortRequest('date')}
                                >
                                    Date
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sortDirection={orderBy === 'status' ? order : false}>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'asc'}
                                    onClick={() => handleSortRequest('status')}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {searchResult.map((contact) => (
                            <TableRow key={contact._id}>
                                <TableCell>{contact.name}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{new Date(contact.date).toLocaleDateString()}</TableCell>
                                <TableCell>{contact.status}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={contact.status === 'archived'}
                                        onClick={() => readContact(contact)}
                                    >
                                        Read
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={totalItems}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                sx={{
                    mt: 2,
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    '& .MuiTablePagination-actions': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-input': {
                        color: '#333',
                        fontWeight: 'bold',
                    },
                    '& .MuiTablePagination-toolbar': {
                        justifyContent: 'space-between',
                    },
                    '& .MuiTablePagination-displayedRows': {
                        color: '#1976d2',
                    },
                }}
            />

        </Box>
    );
};

export default ContactList;
