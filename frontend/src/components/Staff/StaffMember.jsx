import { useState, useEffect } from 'react';
import { getAllStaff, createStaff, updateStaff, deleteStaff } from '../../services/staffService';
import { getUsers } from '../../services/AdminService';
import { getAllDepartments } from '../../services/departmentService';
import { getPositions } from '../../services/positionService';
import { toast } from 'react-toastify';
import {
    Modal,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Container,
    Switch,
    TablePagination,
    Typography,
} from '@mui/material';
import '../../styles/staff.css';

const Staff = ({ open }) => {
    const [staffList, setStaffList] = useState([]);
    const [staff, setStaff] = useState({ userId: '', departmentId: '', positionId: '', status: false, contact: '', salary: '' });
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [editingStaff, setEditingStaff] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [staffData, usersData, departmentsData, positionsData] = await Promise.all([
                getAllStaff(),
                getUsers(),
                getAllDepartments(),
                getPositions()
            ]);
            setStaffList(staffData.staff || []);
            setUsers(usersData.users || []);
            setDepartments(departmentsData.departments || []);
            setPositions(positionsData.positions || []);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setStaff({ ...staff, [name]: type === 'checkbox' ? checked : value });
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        if (!staff.userId || !staff.departmentId || !staff.positionId || !staff.contact || !staff.salary) {
            toast.error('All fields are required');
            return;
        }
        try {
            if (editingStaff) {
                const data = await updateStaff(staff._id, staff);
                if (data.message) {
                    toast.error(data.message);
                } else {
                    const updatedStaffList = staffList.map((s) =>
                        s._id === staff._id ? data.staff : s
                    );
                    setStaffList(updatedStaffList);
                    toast.success('Staff updated successfully');
                }
            } else {
                const data = await createStaff(staff);
                if (data.message) {
                    toast.error(data.message);
                } else {
                    setStaffList([...staffList, data.staff]);
                    toast.success('Staff created successfully');
                }
            }
            setStaff({ userId: '', departmentId: '', positionId: '', status: false, contact: '', salary: '' });
            setEditingStaff(false);
            setIsModalOpen(false);
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };

    const handleEdit = (id) => {
        const staffMember = staffList.find((s) => s._id === id);
        setStaff({ ...staffMember, userId: staffMember.user._id, departmentId: staffMember.department._id, positionId: staffMember.position._id });
        setEditingStaff(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const data = await deleteStaff(id);
            if (data.message) {
                toast.error(data.message);
            } else {
                const filteredStaffList = staffList.filter((s) => s._id !== id);
                setStaffList(filteredStaffList);
                toast.success('Staff deleted successfully');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };

    const availableUsers = editingStaff ? users : users.filter(user => !staffList.some(staff => staff.user._id === user._id));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Container maxWidth="lg" >
            <Button variant="contained" color="primary" onClick={() => {
                setStaff({ userId: '', departmentId: '', positionId: '', status: false, contact: '', salary: '' });
                setEditingStaff(false);
                setIsModalOpen(true);
            }} className="mb-3">
                Create Staff
            </Button>

            <Modal sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Paper className="modal-content" sx={{ p: 4 }} component="form" >
                    <Typography variant="h6" component="h2">
                        {editingStaff ? 'Edit Staff' : 'Create Staff'}
                    </Typography>
                    <form onSubmit={handleCreateOrUpdate}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>User</InputLabel>
                            <Select name="userId" value={staff.userId} onChange={handleInputChange} required>
                                <MenuItem value="">
                                    <em>Select User</em>
                                </MenuItem>
                                {availableUsers.map((user) => (
                                    <MenuItem key={user._id} value={user._id}>
                                        {user.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Department</InputLabel>
                            <Select name="departmentId" value={staff.departmentId} onChange={handleInputChange} required>
                                <MenuItem value="">
                                    <em>Select Department</em>
                                </MenuItem>
                                {departments.map((department) => (
                                    <MenuItem key={department._id} value={department._id}>
                                        {department.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Position</InputLabel>
                            <Select name="positionId" value={staff.positionId} onChange={handleInputChange} required>
                                <MenuItem value="">
                                    <em>Select Position</em>
                                </MenuItem>
                                {positions.map((position) => (
                                    <MenuItem key={position._id} value={position._id}>
                                        {position.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <Typography>Status</Typography>
                            <Switch
                                checked={staff.status}
                                onChange={handleInputChange}
                                name="status"
                                color="primary"
                            />
                        </FormControl>
                        <TextField
                            label="Contact"
                            name="contact"
                            value={staff.contact}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Salary"
                            name="salary"
                            type="number"
                            value={staff.salary}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <Button variant="contained" color="primary" type="submit">
                            {editingStaff ? 'Update' : 'Create'}
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                    </form>
                </Paper>
            </Modal>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Position</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Salary</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {staffList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((staff) => (
                            <TableRow key={staff._id}>
                                <TableCell>{staff.user?.name || 'N/A'}</TableCell>
                                <TableCell>{staff.department?.name || 'N/A'}</TableCell>
                                <TableCell>{staff.position?.name || 'N/A'}</TableCell>
                                <TableCell>{staff.status ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{staff.contact}</TableCell>
                                <TableCell>{staff.salary}</TableCell>
                                <TableCell align="right" sx={{ display: 'flex', gap: 1 }}>
                                    <Button variant="outlined" color="primary" onClick={() => handleEdit(staff._id)}>
                                        Edit
                                    </Button>
                                    <Button variant="outlined" color="secondary" onClick={() => handleDelete(staff._id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={staffList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Rows per page:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
                sx={{ mt: 2 }}
                hideFooter
                size="small"
                color="primary"
                label="Table Pagination"
                variant="outlined"
                shape="rounded"
                showFirstButton
                showLastButton
                backIconButtonProps={{ color: 'primary' }}
                nextIconButtonProps={{ color: 'primary' }}
                SelectProps={{ color: 'primary' }}
                
            />
        </Container>
    );
};

export default Staff;
