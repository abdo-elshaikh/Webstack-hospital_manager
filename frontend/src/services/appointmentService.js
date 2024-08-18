import axios from 'axios';

const URL = 'http://localhost:5000/api/appointments';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }
    return {};
}

const getAppointments = async () => {
    try {
        const response = await axios.get(URL, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.message };
    }
}

const getAppointmentById = async (id) => {
    try {
        const response = await axios.get(`${URL}/${id}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const createAppointment = async (appointment) => {
    try {
        const response = await axios.post(URL, { appointment }, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const updateAppointment = async (id, appointment) => {
    try {
        const response = await axios.put(`${URL}/${id}`, appointment, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const deleteAppointment = async (id) => {
    try {
        const response = await axios.delete(`${URL}/${id}`, { headers: getHeaders() });
        console.log(response.data);
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const changeAppointmentStatus = async (id, status, update_by) => {
    try {
        const response = await axios.put(`${URL}/status/${id}`, { status, update_by }, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const getAppointmentsByPatient = async (patientId) => {
    try {
        const response = await axios.get(`${URL}/patient/${patientId}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

export {
    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    changeAppointmentStatus,
    getAppointmentsByPatient
};