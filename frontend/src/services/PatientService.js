import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/patients';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getPatients = async () => {
  try {
    const response = await axios.get(BASE_URL, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || error.message);
  }
};

const getPatientById = async (id) => {
  try {
    const url = `${BASE_URL}/patient/${id}`;
    const response = await axios.get(url, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || error.message);
  }
};

const createPatient = async (patient) => {
  try {
    const response = await axios.post(BASE_URL, patient, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || error.message);
  }
};

const updatePatient = async (id, patient) => {
  try {
    const url = `${BASE_URL}/patient/${id}`;
    const response = await axios.put(url, patient, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || error.message);
  }
};

const deletePatient = async (id) => {
  try {
    const url = `${BASE_URL}/patient/${id}`;
    const response = await axios.delete(url, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || error.message);
  }
};

const getPatientByName = async (patientName) => {
  try {
    const url = `${BASE_URL}/name`;
    const response = await axios.get(url, { body: { name: patientName }, headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.statusText || 'An error occurred';
    return { error: errorMessage}
  }
};

const getPatientByCode = async (code) => {
  try {
    const url = `${BASE_URL}/code`;
    const response = await axios.get(url, { body: { code }, headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    return { error: errorMessage}
  }
};

const getMaxCode = async () => {
  try {
    const url = `${BASE_URL}/max-code`;
    const response = await axios.get(url, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    return { error: errorMessage}
  }
};

export {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientByName,
  getPatientByCode,
  getMaxCode,
};
