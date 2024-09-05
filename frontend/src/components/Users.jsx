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
  Paper,
  Tabs,
  Tab,
  Grid,
  Typography,
  Box,
} from '@mui/material';
import { Delete, Edit, Visibility, VisibilityOff } from '@mui/icons-material';
import useAuth from '../contexts/useAuth';
import '../styles/admin.css';

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        if (data.error) {
          toast.error(data.error);
        } else {
          const filteredUsers = data.users.filter((user) => user._id !== currentUser._id);
          setUsers(filteredUsers);
        }
      } catch (error) {
        toast.error("Error fetching users");
      }
    };

    fetchUsers();
  }, [currentUser._id]);

  useEffect(() => {
    filterUsers();
  }, [users, activeTab]);

  const handleDelete = async (id) => {
    try {
      const staffData = await getAllStaff();
      const userStaff = staffData.staff.find((staff) => staff.user === id);
      if (userStaff) {
        toast.error(`User ${users.find((user) => user._id === id)?.name} is in staff ${userStaff.name} and cannot be deleted`);
        return;
      }

      if (window.confirm(`Are you sure you want to delete ${users.find((user) => user._id === id)?.name}?`)) {
        const data = await deleteUser(id);
        const updatedUsers = users.filter((user) => user._id !== id);
        setUsers(updatedUsers);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error deleting user");
    }
  };

  const handleEdit = async (id, role) => {
    try {
      const data = await updateUserRole(id, role);
      const updatedUser = data.user;
      const updatedUsers = users.map((user) => (user._id === id ? updatedUser : user));
      setUsers(updatedUsers);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating role");
    }
  };

  const handleActivation = async (id) => {
    try {
      const data = await updateUserActivation(id);
      const updatedUser = data.user;
      const updatedUsers = users.map((user) => (user._id === id ? updatedUser : user));
      setUsers(updatedUsers);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating activation status");
    }
  };

  const filterUsers = () => {
    if (activeTab === 'all') {
      setFilter(users);
    } else if (activeTab === 'active') {
      setFilter(users.filter((user) => user.isActive));
    } else if (activeTab === 'inactive') {
      setFilter(users.filter((user) => !user.isActive));
    } else if (['user', 'staff', 'admin'].includes(activeTab)) {
      setFilter(users.filter((user) => user.role === activeTab));
    }
  };

  return (
    <Box component={Paper} sx={{ p: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            sx={{
              backgroundColor: '#f5f5f5', // Background color for the Tabs component
              borderRadius: 2, // Border radius for rounded corners
              '& .MuiTab-root': {
                textTransform: 'none', // Disable uppercase transformation
                fontWeight: 'bold',
                color: '#333', // Text color for the tabs
                '&.Mui-selected': {
                  color: '#1976d2', // Text color for selected tab
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1976d2', // Color of the indicator line
              },
            }}
          >
            <Tab label="All" value='all' />
            <Tab label="Users" value='user' />
            <Tab label="Staff" value='staff' />
            <Tab label="Admins" value='admin' />
            <Tab label="Inactive" value='inactive' />
            <Tab label="Active" value='active' />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          <TableContainer sx={{ mt: 2 }}>
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
                {filter.map((user) => (
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default Users;
