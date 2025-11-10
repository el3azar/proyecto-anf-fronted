import axios from 'axios';

// URL base para el endpoint de categorías de ratio
const API_URL = 'http://localhost:8080/api/v1/categorias-ratio';

/**
 * Obtiene todas las categorías de ratio desde la API.
 */
export const getCategoriasRatio = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las categorías de ratio:", error);
    throw error;
  }
};

/**
 * Crea una nueva categoría de ratio.
 * @param {object} categoriaData - Datos de la categoría a crear.
 */
export const createCategoriaRatio = async (categoriaData) => {
  try {
    const response = await axios.post(API_URL, categoriaData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la categoría de ratio:", error);
    throw error;
  }
};

/**
 * Actualiza una categoría de ratio existente por su ID.
 * @param {number} id - El ID de la categoría a actualizar.
 * @param {object} categoriaData - Los nuevos datos para la categoría.
 */
export const updateCategoriaRatio = async (id, categoriaData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, categoriaData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la categoría con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina una categoría de ratio por su ID.
 * @param {number} id - El ID de la categoría a eliminar.
 */
export const deleteCategoriaRatio = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar la categoría con ID ${id}:`, error);
    throw error;
  }
};