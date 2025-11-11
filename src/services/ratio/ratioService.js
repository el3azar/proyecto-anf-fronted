import axios from 'axios';

// URL base para el endpoint de ratios
const API_URL = 'http://localhost:8080/api/v1/ratios';

/**
 * Obtiene los ratios desde la API, opcionalmente filtrados por nombre de empresa.
 * @param {string} [nombreEmpresa] - El nombre de la empresa para filtrar. Es opcional.
 */
export const getRatios = async (nombreEmpresa) => {
  try {
    // Construimos la URL. Si hay un nombre de empresa, lo añadimos como query param.
    const url = nombreEmpresa ? `${API_URL}?nombreEmpresa=${nombreEmpresa}` : API_URL;
    const response = await axios.get(url);
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

  /**
 * Llama al endpoint del backend para calcular los campos derivados de un ratio.
 * @param {number} id - El ID del ratio a calcular.
 * @returns {Promise<object>} - El objeto del ratio con los datos actualizados.
 */
export const calculateLiquidezRatio = async (id) => {
  try {
    // Usamos axios.put para llamar al endpoint PUT que creaste
    const response = await axios.put(`${API_URL}/${id}/calcular-liquidez`);
    return response.data; // El backend devuelve el ratio actualizado
  } catch (error) {
    console.error(`Error al calcular el ratio con ID ${id}:`, error);
    // Es importante relanzar el error para que el componente que llama pueda manejarlo
    throw error;
  }
};