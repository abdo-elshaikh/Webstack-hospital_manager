import { useState, useEffect } from 'react';
import { getAllStaff, createStaff, updateStaff, deleteStaff } from '../../services/staffService';
import { getUsers } from '../../services/AdminService';
import { getAllDepartments } from '../../services/departmentService';
import { getPositions } from '../../services/positionService';
import { toast } from 'react-toastify';
import { Modal, Button, Form, Table, Container } from 'react-bootstrap';
import '../../styles/staff.css';

const Staff = () => {
    const [staffList, setStaffList] = useState([]);
    const [staff, setStaff] = useState({ userId: '', departmentId: '', positionId: '', status: false, contact: '', salary: '' });
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [editingStaff, setEditingStaff] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const availableUsers = editingStaff ? users : users.filter(user => !staffList.some(staff => staff.user === user));

    return (
        <Container>
            <h1>Staff Management</h1>
            <Button onClick={() => {
                setStaff({ userId: '', departmentId: '', positionId: '', status: false, contact: '', salary: '' });
                setEditingStaff(false);
                setIsModalOpen(true);
            }} className="mb-3">Create Staff</Button>

            <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingStaff ? 'Edit Staff' : 'Create Staff'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateOrUpdate} className="staff-form">
                        <Form.Group controlId="formUser">
                            <Form.Label>User</Form.Label>
                            <Form.Control as="select" name="userId" value={staff.userId} onChange={handleInputChange} required>
                                <option value="">Select User</option>
                                {availableUsers.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formDepartment">
                            <Form.Label>Department</Form.Label>
                            <Form.Control as="select" name="departmentId" value={staff.departmentId} onChange={handleInputChange} required>
                                <option value="">Select Department</option>
                                {departments.map((department) => (
                                    <option key={department._id} value={department._id}>
                                        {department.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formPosition">
                            <Form.Label>Position</Form.Label>
                            <Form.Control as="select" name="positionId" value={staff.positionId} onChange={handleInputChange} required>
                                <option value="">Select Position</option>
                                {positions.map((position) => (
                                    <option key={position._id} value={position._id}>
                                        {position.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Check
                                type="checkbox"
                                label="Status"
                                name="status"
                                checked={staff.status}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formContact">
                            <Form.Label>Contact</Form.Label>
                            <Form.Control
                                type="text"
                                name="contact"
                                value={staff.contact}
                                placeholder="Contact"
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formSalary">
                            <Form.Label>Salary</Form.Label>
                            <Form.Control
                                type="number"
                                name="salary"
                                value={staff.salary}
                                placeholder="Salary"
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {editingStaff ? 'Update' : 'Create'}
                        </Button>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <div className="staff-list">
                <h2>Staff List</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Department</th>
                            <th>Position</th>
                            <th>Status</th>
                            <th>Contact</th>
                            <th>Salary</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffList.map((staff) => (
                            <tr key={staff._id}>
                                <td>{staff.user?.name || 'N/A'}</td>
                                <td>{staff.department?.name || 'N/A'}</td>
                                <td>{staff.position?.name || 'N/A'}</td>
                                <td>{staff.status ? 'Active' : 'Inactive'}</td>
                                <td>{staff.contact}</td>
                                <td>{staff.salary}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleEdit(staff._id)}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDelete(staff._id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default Staff;
