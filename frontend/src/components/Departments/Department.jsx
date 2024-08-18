import { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TextField,
    IconButton,
    Typography,
    Box,
    FormControl,
    Container,
    Toolbar,
    Pagination,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentById
} from '../../services/departmentService';
import '../../styles/department.css';

const Department = ({ open }) => {
    const [departments, setDepartments] = useState([]);
    const [department, setDepartment] = useState({ name: '', description: '' });
    const [isEdit, setIsEdit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [departmentsPerPage, setDepartmentsPerPage] = useState(5);

    useEffect(() => {
        getAllDepartments().then((data) => {
            if (data.error) {
                toast.error(data.error);
            } else {
                setDepartments(data.departments);
            }
        });
    }, []);

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        if (isEdit) {
            const data = await updateDepartment(department._id, department);
            if (data.error) {
                toast.error(data.error);
            } else {
                const index = departments.findIndex((d) => d._id === department._id);
                departments[index] = data.department;
                setDepartments([...departments]);
                toast.success('Department updated successfully');
            }
        } else {
            const data = await createDepartment(department);
            if (data.error) {
                toast.error(data.error);
            } else {
                setDepartments([...departments, data.department]);
                toast.success('Department created successfully');
            }
        }
        setDepartment({ name: '', description: '' });
        setIsEdit(false);
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        const data = await deleteDepartment(id);
        if (data.error) {
            toast.error(data.error);
        } else {
            setDepartments(departments.filter((d) => d._id !== id));
            toast.success('Department deleted successfully');
        }
    };

    const handleEdit = async (id) => {
        const data = await getDepartmentById(id);
        if (data.error) {
            toast.error(data.error);
        } else {
            setDepartment(data.department);
            setIsEdit(true);
            setIsModalOpen(true);
        }
    };

    const indexOfLastDepartment = currentPage * departmentsPerPage;
    const indexOfFirstDepartment = indexOfLastDepartment - departmentsPerPage;
    const currentDepartments = departments.slice(indexOfFirstDepartment, indexOfLastDepartment);

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <Container >
            <Toolbar>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                        setDepartment({ name: '', description: '' });
                        setIsEdit(false);
                        setIsModalOpen(true);
                    }}
                >
                    Add Department
                </Button>
            </Toolbar>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentDepartments.length > 0 ? currentDepartments.map((department, index) => (
                            <TableRow key={department._id}>
                                <TableCell>{indexOfFirstDepartment + index + 1}</TableCell>
                                <TableCell>{department.name}</TableCell>
                                <TableCell>{department.description}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(department._id)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(department._id)} color="secondary">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan={4}>No departments found</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination
                count={Math.ceil(departments.length / departmentsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{ mt: 2 }}
            />
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper sx={{ p: 4, maxWidth: 500, margin: 'auto', mt: 4 }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {isEdit ? 'Edit Department' : 'Add Department'}
                    </Typography>
                    <Box component="form" onSubmit={handleCreateOrUpdate} sx={{ mt: 2 }}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Name"
                                variant="outlined"
                                value={department.name}
                                onChange={(e) => setDepartment({ ...department, name: e.target.value })}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Description"
                                variant="outlined"
                                multiline
                                rows={4}
                                value={department.description}
                                onChange={(e) => setDepartment({ ...department, description: e.target.value })}
                                required
                            />
                        </FormControl>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button variant="contained" color="secondary" onClick={() => setIsModalOpen(false)}>
                                Close
                            </Button>
                            <Button variant="contained" color="primary" type="submit" sx={{ ml: 2 }}>
                                {isEdit ? 'Update' : 'Create'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Modal>
        </Container>
    );
};

export default Department;
