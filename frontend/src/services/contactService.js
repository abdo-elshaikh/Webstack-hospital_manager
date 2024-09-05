import axios from "axios";

const API_BASE_URL = 'http://localhost:5000/api/contacts';

const getHeaders = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }
    return {};
}

const createContact = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/contact`, data);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        return { error: errorMessage };
    }
}

const getAllContacts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/all`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        return { error: errorMessage };
    }
}

const readContact = async (id, user) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/contact/read/${id}`, { user }, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        return { error: errorMessage };
    }
}

const archiveContact = async (id, user) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/contact/archive/${id}`, { user }, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        return { error: errorMessage };
    }
}

export { createContact, getAllContacts, readContact, archiveContact }
