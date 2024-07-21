import axios from 'axios';

const departmentsUrl = 'http://localhost:5000/api/departments';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }
    return {};
};

const getAllDepartments = async () => {
    try {
        const response = await axios.get(departmentsUrl, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
};

const getDepartmentById = async (id) => {
    try {
        const response = await axios.get(`${departmentsUrl}/${id}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
};

const createDepartment = async (department) => {
    try {
        const response = await axios.post(departmentsUrl, department, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
};

const updateDepartment = async (id, department) => {
    try {
        const response = await axios.put(`${departmentsUrl}/${id}`, department, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
};

const deleteDepartment = async (id) => {
    try {
        const response = await axios.delete(`${departmentsUrl}/${id}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
};

export { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment };
