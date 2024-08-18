import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUserRole, updateUserActivation } from '../services/AdminService';
import { getAllStaff } from '../services/staffService';
import { toast } from 'react-toastify';
import {
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Button,
  IconButton,
  Paper
} from '@mui/material';
import { Delete, Edit, Visibility, VisibilityOff } from '@mui/icons-material';
import '../styles/admin.css';

const Users = ({ currentUser, open }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      getUsers().then((data) => {
        const users = data.users.filter(user => user._id !== currentUser._id);
        setUsers(users);
      }).catch((error) => {
        toast.error(error.response.data.error);
      });
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    getAllStaff().then((data) => {
      const userStaff = data.staff.find((staff) => staff.user === id);
      if (userStaff) {
        toast.error(`User ${users.find((user) => user._id === id)?.name} is in staff ${userStaff.name} and cannot be deleted`);
        return;
      }
    });

    if (window.confirm(`Are you sure you want to delete ${users.find((user) => user._id === id)?.name}?`)) {
      deleteUser(id).then((data) => {
        const updatedUsers = users.filter((user) => user._id !== id);
        setUsers(updatedUsers);
        toast.success(data.message);
      }).catch((error) => {
        toast.error(error.response.data.error);
      });
    }
  };

  const handleEdit = async (id, role) => {
    updateUserRole(id, role).then((data) => {
      const updatedUser = data.user;
      const updatedUsers = users.map((user) => (user._id === id ? updatedUser : user));
      setUsers(updatedUsers);
      toast.success(data.message);
    }).catch((error) => {
      toast.error(error.response.data.error);
    });
  };

  const handleActivation = async (id) => {
    updateUserActivation(id).then((data) => {
      const updatedUser = data.user;
      const updatedUsers = users.map((user) => (user._id === id ? updatedUser : user));
      setUsers(updatedUsers);
      toast.success(data.message);
    }).catch((error) => {
      toast.error(error.response.data.error);
    });
  };

  return (
    <Container >
      <TableContainer  sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleEdit(user._id, e.target.value)}
                    variant="outlined"
                    fullWidth
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="staff">Staff</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{user.isActive ? "Active" : "Not Active"}</TableCell>
                <TableCell sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'wrap', height: '100%' }}>
                  <IconButton onClick={() => handleActivation(user._id)}>
                    {user.isActive ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Users;
