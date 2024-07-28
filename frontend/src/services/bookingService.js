import axios from 'axios';

const bookUrl = 'http://localhost:5000/api/bookings'
const getHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }
    return {};
};

const getAllBooks = async () => {
    try {
        const response = await axios.get(bookUrl, { headers: getHeaders() });
        console.log(response.data);
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const bookAppointment = async (appointment) => {
    try {
        const response = await axios.post(bookUrl, { appointment }, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: "Error in Server: " + error.response.data.message };
    }
}

const getBookingByUser = async (user) => {
    try {
        const response = await axios.get(`${bookUrl}/user`, user, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

const getBookingBetweenDate = async (firstDate, lastDate) => {
    try {
        const response = await axios.post(`${bookUrl}/date`, { firstDate, lastDate }, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message || error.message };
    }
}

export { bookAppointment, getAllBooks, getBookingByUser, getBookingBetweenDate };
