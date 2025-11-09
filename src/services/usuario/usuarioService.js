import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/usuarios';

// Por ahora solo necesitamos obtener todos los usuarios para el selector
export const getUsuarios = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};