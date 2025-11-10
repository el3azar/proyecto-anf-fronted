import axios from 'axios';

// Configura la URL base de tu API.
// Es una buena práctica tener esto en un archivo de configuración o .env
const API_URL = 'http://localhost:8080/api/v1/tipos-ratio';

// Función para obtener todos los tipos de ratio
export const getTiposRatio = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los tipos de ratio:", error);
    throw error; // Lanza el error para que el componente que llama pueda manejarlo
  }
};

// Función para crear un nuevo tipo de ratio
export const createTipoRatio = async (tipoRatioData) => {
  try {
    const response = await axios.post(API_URL, tipoRatioData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el tipo de ratio:", error);
    throw error;
  }
};

// Función para actualizar un tipo de ratio existente
export const updateTipoRatio = async (id, tipoRatioData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, tipoRatioData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el tipo de ratio con ID ${id}:`, error);
    throw error;
  }
};

// Función para eliminar un tipo de ratio
export const deleteTipoRatio = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el tipo de ratio con ID ${id}:`, error);
    throw error;
  }
};