import { useState, useEffect } from 'react';
import { getPositions, createPosition, updatePosition, deletePosition } from '../../services/positionService';
import {
    Button,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    IconButton,
    Typography,
    Box,
    Container,
    Toolbar
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { toast } from 'react-toastify';
import '../../styles/department.css';

const Position = ({ open }) => {
    const [positions, setPositions] = useState([]);
    const [position, setPosition] = useState({ name: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchPositions();
    }, []);

    const fetchPositions = () => {
        getPositions().then((data) => {
            if (data.error) {
                toast.error(data.error);
            } else {
                setPositions(data.positions);
            }
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPosition({ ...position, [name]: value });
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        if (isEditing) {
            updatePosition(position._id, position).then((data) => {
                if (data.error) {
                    toast.error(data.error);
                } else {
                    setPositions(positions.map((p) => p._id === data.position._id ? data.position : p));
                    toast.success(data.message);
                }
            });
        } else {
            createPosition(position).then((data) => {
                if (data.error) {
                    toast.error(data.error);
                } else {
                    setPositions([...positions, data.position]);
                    toast.success(data.message);
                }
            });
        }
        setPosition({ name: '', description: '' });
        setIsEditing(false);
        setIsModalOpen(false);
    };

    const handleEdit = (id) => {
        const p = positions.find((p) => p._id === id);
        setPosition(p);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const data = await deletePosition(id);
        if (data.error) {
            toast.error(data.error);
        } else {
            setPositions(positions.filter((d) => d._id !== id));
            toast.success(data.message);
        }
    };

    return (
        <Box component={Paper} sx={{ p: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <Toolbar
                sx={{ border: '1px solid #e0e0e0', mb: 2, borderRadius: 1 }}
                bgcolor="background.default"
            >
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => {
                        setPosition({ name: '', description: '' });
                        setIsEditing(false);
                        setIsModalOpen(true);
                    }}
                >
                    Create Position
                </Button>
            </Toolbar>
            <TableContainer sx={{ mt: 3 }}>
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
                        {positions.map((pos, index) => (
                            <TableRow key={pos._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{pos.name}</TableCell>
                                <TableCell>{pos.description}</TableCell>
                                <TableCell>
                                    <IconButton sx={{ mr: 1 }} onClick={() => handleEdit(pos._id)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(pos._id)} color="secondary">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper sx={{ p: 4, maxWidth: 500, margin: 'auto', mt: 4 }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {isEditing ? 'Edit Position' : 'Create Position'}
                    </Typography>
                    <Box component="form" onSubmit={handleCreateOrUpdate} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Name"
                            variant="outlined"
                            name="name"
                            value={position.name}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Description"
                            variant="outlined"
                            name="description"
                            multiline
                            rows={4}
                            value={position.description}
                            onChange={handleInputChange}
                            required
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button variant="contained" color="secondary" onClick={() => setIsModalOpen(false)}>
                                Close
                            </Button>
                            <Button variant="contained" color="primary" type="submit" sx={{ ml: 2 }}>
                                {isEditing ? 'Update' : 'Create'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Modal>
        </Box>
    );
};

export default Position;
