import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/users';


const register = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/`, userData);
        console.log(response.data)
        return response.data;
    } catch (error) {
        return {error: error.message};
    }
};

const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
        const { token, user } = response.data;
        if (token && user) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
        }
        return response.data;
    } catch (error) {
        return {error: error.message};
    }
};

const logout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return { error: 'Token not found' };
    }
    try {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return {message: 'Logged Out ..'};
    } catch (error) {
        return {error: error.message};
    }
};

const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/forgotpassword`, { email });
        console.log(response.data);
        return response.data;
    } catch (error) {
        return {error: error.message};
    }
};

const resetPassword = async (token, password) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/resetpassword/${token}`, { password });
        return response.data;
    } catch (error) {
        return {error: error.message};
    }
};

const getCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return { error: 'Token not found' };
    }
    try {
        const response = await axios.get(`${API_BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return {error: error.message};
    }
};

export { register, login, logout, getCurrentUser, forgotPassword, resetPassword };
