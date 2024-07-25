import { useState, useEffect } from 'react';
import { getPositions, createPosition, updatePosition, deletePosition } from '../../services/positionService';
import { Modal, Button, Table, Alert, Dropdown, DropdownButton, DropdownItem, Toast, Form, FormControl, FormGroup, FormLabel, FormSelect, ToastHeader } from 'react-bootstrap';
import { toast } from 'react-toastify';
import '../../styles/department.css';

const Position = () => {
    const [positions, setPositions] = useState([]);
    const [position, setPosition] = useState({ name: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [IsModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getPositions().then((data) => {
            if (data.error) {
                toast.error(data.error);
            } else {
                setPositions(data.positions);
            }
        });
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPosition({ ...position, [name]: value });
    }

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        if (isEditing) {
            const data = await updatePosition(position._id, position);
            if (data.error) {
                toast.error(data.error);
            } else {
                const index = positions.findIndex((d) => d._id === position._id);
                positions[index] = data.position;
                setPositions([...positions]);
                toast.success(data.message);
            }
        } else {
            const data = await createPosition(position);
            if (data.error) {
                toast.error(data.error);
            } else {
                setPositions([...positions, data.position]);
                toast.success(data.message);
            }
        }
        setPosition({ name: '', description: '' });
        setIsEditing(false);
        setIsModalOpen(false);
    }
    const handleEdit = (id) => {
        const pos = positions.find((p) => p._id === id);
        setPosition(pos);
        setIsEditing(true);
        setIsModalOpen(true);
    }
    const handleDelete = async (id) => {
        const data = await deletePosition(id);
        if (data.error) {
            toast.error(data.error);
        } else {
            setPositions(positions.filter((d) => d._id !== id));
            toast.success(data.message);
        }
    }
    return (
        <div>
            <Button onClick={() => setIsModalOpen(true)}>Create Position</Button>
            <Modal show={IsModalOpen} onHide={() => setIsModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Position' : 'Create Position'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup>
                            <FormLabel>Name</FormLabel>
                            <FormControl
                                type='text'
                                name='name'
                                value={position.name}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Description</FormLabel>
                            <FormControl
                                as='textarea'
                                name='description'
                                value={position.description}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCreateOrUpdate}>{isEditing ? 'Edit' : 'Create'}</Button>
                </Modal.Footer>
            </Modal>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {positions.map((pos, index) => (
                        <tr key={pos._id}>
                            <td>{index + 1}</td>
                            <td>{pos.name}</td>
                            <td>{pos.description}</td>
                            <td>
                                <Button onClick={() => handleEdit(pos._id)}>Edit</Button>
                                <Button onClick={() => handleDelete(pos._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
export default Position;