// src/services/AdminService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

const getHeaders = () => {
    const token = localStorage.getItem('token');
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
        return response.data;
    } catch (error) {
        if (error.response) {
            return { error: error.response.data.message };
        } else if (error.request) {
            return { error: "Network error: no response received" };
        } else {
            return { error: "Error in setting up the request" };
        }
    }
};

const getUserById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/user/${id}`, { headers: getHeaders() });
        return response.data.user;
    } catch (error) {
        if (error.response) {
            return { error: error.response.data.message };
        } else if (error.request) {
            return { error: "Network error: no response received" };
        } else {
            return { error: "Error in setting up the request" };
        }
    }
};

const updateUser = async (id, role) => {
    try {
        const response = await axios.put(`${API_URL}/user/${id}`, { role }, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        if (error.response) {
            return { error: error.response.data.message };
        } else if (error.request) {
            return { error: "Network error: no response received" };
        } else {
            return { error: "Error in setting up the request" };
        }
    }
};

const updateUserActivation = async (id) => {
    try {
        const response = await axios.put(`${API_URL}/user/activation/${id}`, {}, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        if (error.response) {
            return { error: error.response.data.message };
        } else if (error.request) {
            return { error: "Network error: no response received" };
        } else {
            return { error: "Error in setting up the request" };
        }
    }
};

const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/user/${id}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        if (error.response) {
            return { error: error.response.data.message };
        } else if (error.request) {
            return { error: "Network error: no response received" };
        } else {
            return { error: "Error in setting up the request" };
        }
    }
};

export { getUsers, deleteUser, getUserById, updateUser, updateUserActivation };
