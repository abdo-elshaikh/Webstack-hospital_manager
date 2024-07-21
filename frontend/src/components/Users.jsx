import { getUsers, deleteUser, getUserById, updateUser, updateUserActivation } from '../services/AdminService'
import { useState, useEffect } from 'react';
import '../styles/admin.css';
import { Link } from 'react-router-dom';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const currentUser = JSON.parse(localStorage.getItem('user'));
    // console.log(currentUser._id)

    useEffect(() => {
        getUsers().then((data) => {
            if (data.error) {
                setError(data.error);
            } else {
                setUsers(data.users);
            }
        });
    }, []);

    const handleDelete = async (id) => {
        if (id === currentUser._id) {
            setError('Delete Current User Denay!');
            return;
        }
        const data = await deleteUser(id);
        if (data.error) {
            setError(data.error);
        } else {
            setUsers(users.filter((u) => u._id !== id));
            setMessage('User deleted successfully');
        }
    }

    const handleEdit = async (id, role) => {
        if (id === currentUser._id) {
            setError('Update Current User Denay!');
            return;
        }
        const data = await updateUser(id, role);
        if (data.error) {
            setError(data.error);
        } else {
            const index = users.findIndex((u) => u._id === id);
            users[index] = data.user;
            setUsers([...users]);
            setMessage('User updated successfully');
        }
    }

    const handleActivation = async (id) => {
        if (id === currentUser._id) {
            setError('Deactivate Current User Denay!');
            return;
        }
        const data = await updateUserActivation(id);
        if (data.error) {
            setError(data.error);
        } else {
            const index = users.findIndex((u) => u._id === id);
            users[index] = data.user;
            setUsers([...users]);
            setMessage('User updated successfully');
        }
    }

    return (
        <div className="admin-content">
            <h2>Users</h2>
            <p>Here you can manage users</p>
            {message && <div className="message">{message}</div>}
            {error && <div className="error">{error}</div>}
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.isActive ? 'Yes' : 'No'}</td>
                            <td>
                                <Link to={`/profile/${user._id}`}>View</Link>
                                <button onClick={() => handleDelete(user._id)}>Delete</button>
                                <button onClick={() => handleEdit(user._id, user.role)}>Update Role</button>
                                <button onClick={() => handleActivation(user._id)}>{user.isActive ? 'Deactivate' : 'Activate'}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default Users;
