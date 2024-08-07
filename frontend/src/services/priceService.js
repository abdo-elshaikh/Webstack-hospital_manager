import axios from 'axios';

const serviceUrl = 'http://localhost:5000/api/services';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }
    return {};
}

const getservices = async () => {
    try {
        const response = await axios.get(serviceUrl, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const getServiceById = async (id) => {
    try {
        const response = await axios.get(`${serviceUrl}/${id}`, { headers: getHeaders() });
        return response.data.services;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const createService = async (service) => {
    try {
        const response = await axios.post(serviceUrl, service, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const updateService = async (id, service) => {
    try {
        const response = await axios.put(`${serviceUrl}/${id}`, service, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const deleteService = async (id) => {
    try {
        const response = await axios.delete(`${serviceUrl}/${id}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const getServicesByDepartment = async (id) => {
    try {
        const response = await axios.get(`${serviceUrl}/department/${id}`, { headers: getHeaders() });
        // console.log(response.data)
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }

}
export { getservices, getServiceById, createService, updateService, deleteService, getServicesByDepartment };
