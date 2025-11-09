import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/empresas';

export const getEmpresas = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createEmpresa = async (empresaData) => {
  try {
    const response = await axios.post(API_URL, empresaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateEmpresa = async (id, empresaData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, empresaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEmpresa = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw error;
  }
};