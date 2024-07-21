// src/components/Department.js
import { useState, useEffect } from 'react';
import { getAllDepartments, createDepartment, updateDepartment, deleteDepartment, getDepartmentById } from "../../services/departmentService";
import Modal from '../../components/Modal';
import '../../styles/department.css';

const Department = () => {
    const [departments, setDepartments] = useState([]);
    const [department, setDepartment] = useState({ name: '', description: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [IsModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getAllDepartments().then((data) => {
            if (data.error) {
                setError(data.error);
                setMessage('')
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
                setError(data.error);
                setMessage('')
            } else {
                const index = departments.findIndex((d) => d._id === department._id);
                departments[index] = data.department;
                setDepartments([...departments]);
                setMessage('Department updated successfully');
                setError('')
            }
        } else {
            const data = await createDepartment(department);
            if (data.error) {
                setError(data.error);
                setMessage('')
            } else {
                setDepartments([...departments, data.department]);
                setError('')
                setMessage('Department created successfully');
            }
        }
        setDepartment({ name: '', description: '' });
        setIsEdit(false);
        setIsModalOpen(false)
    }

    const handleDelete = async (id) => {
        const data = await deleteDepartment(id);
        if (data.error) {
            setError(data.error);
        } else {
            setDepartments(departments.filter((d) => d._id !== id));
            setMessage('Department deleted successfully');
        }
    }

    const handleEdit = async (id) => {
        const data = await getDepartmentById(id);
        if (data.error) {
            setError(data.error);
        } else {
            setDepartment(data.department);
            setIsEdit(true);
            setIsModalOpen(true);
        }
    }

    return (
        <div className="department-container">
            <div className="department-header">
                <h1>Departments</h1>
                <button onClick={() => {
                    setDepartment({ name: '', description: '' });
                    setIsEdit(false);
                    setIsModalOpen(true);
                }}>Add New Department</button>
            </div>
            <Modal isOpen={IsModalOpen} onClose={() => {
                setDepartment({ name: '', description: '' });
                setIsEdit(false);
                setIsModalOpen(false);
            }}>
                <h2>{isEdit ? 'Edit Department' : 'Add New Department'}</h2>
                <form onSubmit={handleCreateOrUpdate} className='staff-form'>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={department.name}
                            onChange={(e) => setDepartment({ ...department, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input
                            type="text"
                            value={department.description}
                            onChange={(e) => setDepartment({ ...department, description: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {isEdit ? 'Update' : 'Create'}
                    </button>
                    <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                </form>
            </Modal>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
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
                    {departments.map((dept) => (
                        <tr key={dept._id}>
                            <td>{dept.name}</td>
                            <td>{dept.description}</td>
                            <td>
                                <button onClick={() => handleEdit(dept._id)}>Edit</button>
                                <button onClick={() => handleDelete(dept._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="3">
                            <button onClick={() => {
                                setDepartment({ name: '', description: '' });
                                isEdit(false);
                            }}>Add New Department</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Department;
