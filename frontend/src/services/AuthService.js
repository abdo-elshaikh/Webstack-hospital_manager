import axios from 'axios';

const API_URL_LOGIN = 'http://localhost:5000/api/users/login';
const API_URL_LOGOUT = 'http://localhost:5000/api/users/logout';
const API_URL_REGISTER = 'http://localhost:5000/api/users/';
const API_URL_USER = 'http://localhost:5000/api/users/profile';

const register = async (userData) => {
    try {
        const response = await axios.post(API_URL_REGISTER, userData);
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.response.data.error };
    }
}

const login = async (email, password) => {
    try {
        const response = await axios.post(API_URL_LOGIN, { email, password });
        if (response.data.token && response.data.user) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        console.log(response.data);
        return response.data;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

const logout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return { error: 'Token not found' };
    }
    const response = await axios.post(API_URL_LOGOUT, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
}

const forgotPassword = async (email) => {
    try {
        const response = await axios.post(API_URL_REGISTER + 'forgotpassword', { email });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.response.data.error };
    }
}

const resetPassword = async (email, newPassword) => {
    try {
        const response = await axios.put(API_URL_REGISTER + 'resetpassword', { email, newPassword });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.response.data.error };
    }
}

const getCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return { error: 'Token not found' };
    }
    const response = await axios.get(API_URL_USER, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data.user;
}

export { register, login, logout, getCurrentUser, forgotPassword, resetPassword };
