import { useState, useEffect } from 'react';
import { getAllStaff, createStaff, updateStaff, deleteStaff } from '../../services/staffService';
import { getUsers } from '../../services/AdminService';
import { getAllDepartments } from '../../services/departmentService';
import { getPositions } from '../../services/positionService';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';
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
        if (editingStaff) {
            // console.log(staff);
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
    };

    const handleEdit = (id) => {
        const staffMember = staffList.find((s) => s._id === id);
        setStaff({ ...staffMember, userId: staffMember.user._id, departmentId: staffMember.department._id, positionId: staffMember.position._id });
        setEditingStaff(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const data = await deleteStaff(id);
        if (data.message) {
            toast.error(data.message);
        } else {
            const filteredStaffList = staffList.filter((s) => s._id !== id);
            setStaffList(filteredStaffList);
            toast.success('Staff deleted successfully');
        }
    };

    const availableUsers = editingStaff ? users : users.filter(user => !staffList.some(staff => staff.user._id === user._id));

    return (
        <div className="staff-container">
            <h1>Staff Management</h1>
            <button onClick={() => {
                setStaff({ userId: '', departmentId: '', positionId: '', status: false, contact: '', salary: '' });
                setEditingStaff(false);
                setIsModalOpen(true);
            }}>Create Staff</button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h1>{editingStaff ? 'Edit Staff' : 'Create Staff'}</h1>
                <form onSubmit={handleCreateOrUpdate} className="staff-form">
                    <select name="userId" value={staff.userId} onChange={handleInputChange} required>
                        <option value="">Select User</option>
                        {availableUsers.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    <select name="departmentId" value={staff.departmentId} onChange={handleInputChange} required>
                        <option value="">Select Department</option>
                        {departments.map((department) => (
                            <option key={department._id} value={department._id}>
                                {department.name}
                            </option>
                        ))}
                    </select>
                    <select name="positionId" value={staff.positionId} onChange={handleInputChange} required>
                        <option value="">Select Position</option>
                        {positions.map((position) => (
                            <option key={position._id} value={position._id}>
                                {position.name}
                            </option>
                        ))}
                    </select>
                    <label>
                        Status
                        <input
                            type="checkbox"
                            name="status"
                            checked={staff.status}
                            onChange={handleInputChange}
                        />
                    </label>
                    <input
                        type="text"
                        name="contact"
                        value={staff.contact}
                        placeholder="Contact"
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="number"
                        name="salary"
                        value={staff.salary}
                        placeholder="Salary"
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">{editingStaff ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                </form>
            </Modal>
            <div className="staff-list">
                <h2>Staff List</h2>
                {staffList.map((s) => (
                    <div key={s._id} className="staff-item">
                        <p>User: {s.user.name}</p>
                        <p>Department: {s.department.name}</p>
                        <p>Position: {s.position.name}</p>
                        <p>Status: {s.status ? 'Active' : 'Not Active'}</p>
                        <p>Contact: {s.contact}</p>
                        <p>Salary: {s.salary}</p>
                        <button onClick={() => handleEdit(s._id)}>Edit</button>
                        <button onClick={() => handleDelete(s._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Staff;
