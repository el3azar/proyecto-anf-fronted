import axios from 'axios';

// URL base para el endpoint de ratios
const API_URL = 'http://localhost:8080/api/v1/ratios';

/**
 * Obtiene todos los ratios desde la API.
 */
export const getRatios = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los ratios:", error);
    throw error;
  }
};

/**
 * Crea un nuevo ratio.
 * @param {object} ratioData - Datos del ratio a crear.
 */
export const createRatio = async (ratioData) => {
  try {
    const response = await axios.post(API_URL, ratioData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el ratio:", error);
    throw error;
  }
};

/**
 * Actualiza un ratio existente por su ID.
 * @param {number} id - El ID del ratio a actualizar.
 * @param {object} ratioData - Los nuevos datos para el ratio.
 */
export const updateRatio = async (id, ratioData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, ratioData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el ratio con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un ratio por su ID.
 * @param {number} id - El ID del ratio a eliminar.
 */
export const deleteRatio = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el ratio con ID ${id}:`, error);
    throw error;
  }
};