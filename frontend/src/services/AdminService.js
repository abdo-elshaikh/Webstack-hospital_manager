// src/services/AdminService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

const getHeaders = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }
    return {};
}

const getUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`, { headers: getHeaders() });
        // console.log(response.data);
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || error.message };
    }
};

const getUserById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/user/${id}`, { headers: getHeaders() });
        return response.data.user;
    } catch (error) {
        return { error: error.response?.data?.message || error.message };
    }
};


const updateUserRole = async (id, role) => {
    try {
        const response = await axios.put(`${API_URL}/user/${id}`, { role }, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || error.message };
    }
};

const updateUserActivation = async (id) => {
    try {
        const response = await axios.put(`${API_URL}/user/activation/${id}`);
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || error.message };
    }
};

const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/user/${id}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || error.message };
    }
};



export { getUsers, deleteUser, getUserById, updateUserActivation, updateUserRole };
