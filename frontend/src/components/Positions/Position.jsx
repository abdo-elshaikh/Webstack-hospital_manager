import { useState, useEffect } from 'react';
import { getPositions, createPosition, updatePosition, deletePosition } from '../../services/positionService';
import Modal from '../../components/Modal';
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
        <div className="department-container">
            <div className="department-header">
                <h1>Positions Manager</h1>
                <button onClick={() => setIsModalOpen(true)}>Add New Position</button>
            </div>
            <Modal isOpen={IsModalOpen} onClose={() => {
                setPosition({ name: '', description: '' });
                setIsEditing(false);
                setIsModalOpen(false);
            }}>
                <h2>{isEditing ? 'Edit Position' : 'Add New Position'}</h2>
                <form onSubmit={handleCreateOrUpdate} className='staff-form'>
                    <div className="form-group">
                        <label>Position</label>
                        <input
                            type="text"
                            value={position.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input
                            type="text"
                            value={position.description}
                            onChange={(e) => setPosition({ ...position, description: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {isEditing ? 'Update' : 'Create'}
                    </button>
                    <button type='button' onClick={
                        () => {
                            setPosition({ name: '', description: '' });
                            setIsEditing(false);
                        }
                    } className='btn'>
                        Create New
                    </button>
                    <button type='button' onClick={() => setIsModalOpen(false)}>Cancel</button>
                </form>
            </Modal>
            <hr />
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {positions.map((pos) => (
                        <tr key={pos._id}>
                            <td>{pos.name}</td>
                            <td>{pos.description}</td>
                            <td>
                                <button onClick={() => handleEdit(pos._id)}>Edit</button>
                                <button onClick={() => handleDelete(pos._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
}
export default Position;