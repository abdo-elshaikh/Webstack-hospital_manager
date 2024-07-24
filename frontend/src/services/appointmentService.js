import axios from 'axios';

const positionsUrl = 'http://localhost:5000/api/appointments';

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
        const response = await axios.get(positionsUrl, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.message };
    }
}

const getAppointmentById = async (id) => {
    try {
        const response = await axios.get(`${positionsUrl}/${id}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const createAppointment = async (appointment) => {
    try {
        const response = await axios.post(positionsUrl, { appointment }, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const updateAppointment = async (id, appointment) => {
    try {
        const response = await axios.put(`${positionsUrl}/${id}`, appointment, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const deleteAppointment = async (id) => {
    try {
        const response = await axios.delete(`${positionsUrl}/${id}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const changeAppointmentStatus = async (id, status) => {
    try {
        const response = await axios.put(`${positionsUrl}/${id}/status`, { status }, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const getAppointmentsByPatient = async (patientId) => {
    try {
        const response = await axios.get(`${positionsUrl}/patient/${patientId}`, { headers: getHeaders() });
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