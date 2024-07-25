import axios from 'axios';

const positionsUrl = 'http://localhost:5000/api/patients';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }
    return {};
}

const getPatients = async () => {
    try {
        const response = await axios.get(positionsUrl, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const getPatientById = async (id) => {
    try {
        const response = await axios.get(`${positionsUrl}/${id}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const createPatient = async (patient) => {
    try {
        const response = await axios.post(positionsUrl, patient, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const updatePatient = async (id, patient) => {
    try {
        const response = await axios.put(`${positionsUrl}/${id}`, patient, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const deletePatient = async (id) => {
    try {
        const response = await axios.delete(`${positionsUrl}/${id}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const getPatientByName = async (name) => {
    try {
        const response = await axios.get(`${positionsUrl}/name`, { name }, { headers: getHeaders() });
        console.log(response.data);
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const getPatientByCode = async (code) => {
    try {
        const response = await axios.get(`${positionsUrl}/code`, { code }, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

export {
    getPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientByName,
    getPatientByCode
};