import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/users';

const getHeaders = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }
    return {};
}

const resetActivation = async (userId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/reactivate/${userId}`);
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || error.message };
    }
}

const register = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/`, userData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        return { error: errorMessage };
    }
};

const login = async (data) => {
    const { email, password } = data;

    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || error.message };
    }
};

const logout = async () => {
    try {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        console.log('Logout successful');
        return { message: 'Logout successful' };
    } catch (error) {
        return { error: error.response?.data?.message || error.message };
    }
};

const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || error.message };
    }
};

const resetPassword = async (token, password) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/reset-password/${token}`, { password });
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || error.message };
    }
};

const getCurrentUser = async (id) => {
    
    try {
        const response = await axios.get(`${API_BASE_URL}/current-user/${id}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || error.message };
    }
};

const updateUser = async (id, formData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/current-user/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
            }
        });
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || error.message };
    }
};

export { register, login, logout, getCurrentUser, forgotPassword, resetPassword, updateUser, resetActivation };
