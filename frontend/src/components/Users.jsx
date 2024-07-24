import { getUsers, deleteUser, getUserById, updateUser, updateUserActivation } from '../services/AdminService'
import { useState, useEffect } from 'react';
import { Modal, Button, Table, Alert, Dropdown, DropdownButton, DropdownItem } from 'react-bootstrap';
import { toast } from 'react-toastify';
import '../styles/admin.css';
import { Link } from 'react-router-dom';

const Users = () => {
    const [users, setUsers] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        getUsers().then((data) => {
            if (data.error) {
                toast.error(data.error);
            } else {
                const users = data.users.filter((user) => user._id != currentUser._id)
                setUsers(users);
            }
        });
    }, []);

    const handleDelete = async (id) => {
        // alert befor delete user if ok delete other wise cancel
        if (window.confirm(`Are you sure you want to delete ${users.find((user) => user._id === id).name
            }?`)) {
            deleteUser(id).then((data) => {
                if (data.error) {
                    toast.error(data.error);
                } else {
                    const newUsers = users.filter((user) => user._id !== id);
                    setUsers(newUsers);
                    toast.success(data.message);
                }
            });
        }
    }

    const handleEdit = async (id, role) => {
        updateUser(id, role).then((data) => {
            if (data.error) {
                toast.error(data.error);
            } else {
                const index = users.findIndex((u) => u._id === id);
                users[index] = data.user;
                setUsers([...users]);
                toast.success(data.message);
            }
        })
    }

    const handleActivation = async (id) => {
        updateUserActivation(id).then((data) => {
            if (data.error) {
                toast.error(data.error);
            } else {
                const index = users.findIndex((u) => u._id === id);
                users[index].isActive = data.user.isActive;
                setUsers([...users]);
                toast.success(data.message);
            }
        });

    }

    return (
        <>
            <h2 className="text-center">Users</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Active</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <select className="form-select" value={user.role} onChange={(e) => handleEdit(user._id, e.target.value)}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="staff">Staff</option>
                                </select>
                            </td>
                            <td>{user.isActive ? "Active" : "Not Active"}</td>
                            <td>
                                <DropdownButton id="dropdown-basic-button" title="Action">
                                    <Dropdown.Item onClick={() => handleActivation(user._id)}>{user.isActive ? "Deactivate" : "Activate"}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleDelete(user._id)}>Delete</Dropdown.Item>
                                </DropdownButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}
export default Users;
