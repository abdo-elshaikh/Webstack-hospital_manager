// src/components/Department.js
import { useState, useEffect } from 'react';
import { getAllDepartments, createDepartment, updateDepartment, deleteDepartment, getDepartmentById } from "../../services/departmentService";
import { Modal, Button, Table, Alert, Dropdown, DropdownButton, DropdownItem, Toast, Form, FormControl, FormGroup, FormLabel, FormSelect } from 'react-bootstrap';
import { toast } from 'react-toastify';
import '../../styles/department.css';

const Department = () => {
    const [departments, setDepartments] = useState([]);
    const [department, setDepartment] = useState({ name: '', description: '' });
    const [isEdit, setIsEdit] = useState(false);
    const [IsModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getAllDepartments().then((data) => {
            if (data.error) {
                setError(data.error);
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
    }

    const handleDelete = async (id) => {
        const data = await deleteDepartment(id);
        if (data.error) {
            toast.error(data.error);
        } else {
            setDepartments(departments.filter((d) => d._id !== id));
            toast.success('Department deleted successfully');
        }
    }

    const handleEdit = async (id) => {
        const data = await getDepartmentById(id);
        if (data.error) {
            toast.error(data.error);
        } else {
            setDepartment(data.department);
            setIsEdit(true);
            setIsModalOpen(true);
        }
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-between">
                <h1>Departments</h1>
                <Button onClick={() => {
                    setDepartment({ name: '', description: '' });
                    setIsEdit(false);
                    setIsModalOpen(true);
                }}>Add Department</Button>
            </div>
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
                    {departments.map((department, index) => (
                        <tr key={department._id}>
                            <td>{index + 1}</td>
                            <td>{department.name}</td>
                            <td>{department.description}</td>
                            <td>
                                <DropdownButton id="dropdown-basic-button" title="Actions">
                                    <DropdownItem onClick={() => handleEdit(department._id)}>Edit</DropdownItem>
                                    <DropdownItem onClick={() => handleDelete(department._id)}>Delete</DropdownItem>
                                </DropdownButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={IsModalOpen} onHide={() => setIsModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Edit Department' : 'Add Department'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup>
                            <FormLabel>Name</FormLabel>
                            <FormControl type="text" value={department.name} onChange={(e) => setDepartment({ ...department, name: e.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Description</FormLabel>
                            <FormControl as="textarea" value={department.description} onChange={(e) => setDepartment({ ...department, description: e.target.value })} />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
                    <Button variant="primary" onClick={handleCreateOrUpdate}>{isEdit ? 'Update' : 'Create'}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Department;
