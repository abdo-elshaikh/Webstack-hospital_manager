import axios from 'axios';

const positionsUrl = 'http://localhost:5000/api/positions';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }
    return {};
}

const getPositions = async () => {
    try {
        const response = await axios.get(positionsUrl, { headers: getHeaders() });
        // console.log(response.data)
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}
const getPositionById = async (id) => {
    try {
        const response = await axios.get(`${positionsUrl}/${id}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}
const createPosition = async (position) => {
    try {
        const response = await axios.post(positionsUrl, position, { headers: getHeaders() });
        // console.log(response.data)
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}
const updatePosition = async (id, position) => {
    try {
        const response = await axios.put(`${positionsUrl}/${id}`, position, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}
const deletePosition = async (id) => {
    try {
        const response = await axios.delete(`${positionsUrl}/${id}`, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

export {
    getPositions,
    getPositionById,
    createPosition,
    updatePosition,
    deletePosition
};
