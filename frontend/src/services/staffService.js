import axios from 'axios';

const staffUrl = 'http://localhost:5000/api/staff';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }
    return {};
}

const getAllStaff = async () => {
    try {
        const response = await axios.get(staffUrl, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response?.data.message || error.message };
    }
}

const getStaffById = async (id) => {
    try {
        const response = await axios.get(`${staffUrl}/${id}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response?.data.message || error.message };
    }
}

const createStaff = async (staff) => {
    try {
        const response = await axios.post(staffUrl, staff, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response?.data.message || error.message };
    }
}

const updateStaff = async (id, staff) => {
    try {
        const response = await axios.put(`${staffUrl}/${id}`, staff, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response?.data.message || error.message };
    }
}

const deleteStaff = async (id) => {
    try {
        const response = await axios.delete(`${staffUrl}/${id}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response?.data.message || error.message };
    }
}

const getStaffByPosition = async (positionId) => {
    try {
        const response = await axios.get(`${staffUrl}/position/${positionId}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response?.data.message || error.message };
    }
}

const getStaffByDepartment = async (id) => {
    try {
        const response = await axios.get(`${staffUrl}/department/${id}`, { headers: getHeaders() });
        console.log(response.data);
        return response.data;
    } catch (error) {
        return { error: error.response?.data.message || error.message };
    }
}

export { getAllStaff, getStaffById, createStaff, updateStaff, deleteStaff, getStaffByPosition, getStaffByDepartment };
