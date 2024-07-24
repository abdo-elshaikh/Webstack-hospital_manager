import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/users';

const handleError = (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    return { error: message };
};

const manageLocalStorage = (action, key, value) => {
    if (action === 'set') {
        localStorage.setItem(key, value);
    } else if (action === 'remove') {
        localStorage.removeItem(key);
    }
};

const register = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/`, userData);
        console.log(response.data)
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
        const { token, user } = response.data;
        if (token && user) {
            manageLocalStorage('set', 'token', token);
            manageLocalStorage('set', 'user', JSON.stringify(user));
        }
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

const logout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return { error: 'Token not found' };
    }
    try {
        await axios.post(`${API_BASE_URL}/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        manageLocalStorage('remove', 'token');
        manageLocalStorage('remove', 'user');
        return { success: "loged out" };
    } catch (error) {
        return handleError(error);
    }
};

const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/forgotpassword`, { email });
        console.log(response.data);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

const resetPassword = async (token, password) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/resetpassword/${token}`, { password });
        return response.data;
    } catch (error) {
        return handleError(error);
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
        return response.data.user;
    } catch (error) {
        return handleError(error);
    }
};

export { register, login, logout, getCurrentUser, forgotPassword, resetPassword };
