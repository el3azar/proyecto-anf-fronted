import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/usuarios';

export const getUsuarios = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUsuario = async (usuarioData) => {
  try {
    const response = await axios.post(API_URL, usuarioData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUsuario = async (id, usuarioData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, usuarioData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUsuario = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw error;
  }
};
