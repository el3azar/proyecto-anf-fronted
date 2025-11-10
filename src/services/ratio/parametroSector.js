import axios from 'axios';

// URLs de los endpoints
const API_PARAMETROS_URL = 'http://localhost:8080/api/v1/parametros-sector';
const API_CATEGORIAS_URL = 'http://localhost:8080/api/v1/categorias-ratio';
const API_SECTORES_URL = 'http://localhost:8080/api/v1/sectores';

// --- Funciones para el CRUD de Parámetros ---

export const getParametros = async () => {
    try {
        const response = await axios.get(API_PARAMETROS_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los parámetros:", error);
        throw error;
    }
};

export const createParametro = async (parametroData) => {
    try {
        const response = await axios.post(API_PARAMETROS_URL, parametroData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el parámetro:", error);
        throw error;
    }
};

export const updateParametro = async (id, parametroData) => {
    try {
        const response = await axios.put(`${API_PARAMETROS_URL}/${id}`, parametroData);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar el parámetro con ID ${id}:`, error);
        throw error;
    }
};

export const deleteParametro = async (id) => {
    try {
        const response = await axios.delete(`${API_PARAMETROS_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar el parámetro con ID ${id}:`, error);
        throw error;
    }
};


// --- Funciones para obtener los datos de los Selectores ---

export const getCategoriasParaSelect = async () => {
    try {
        const response = await axios.get(API_CATEGORIAS_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        throw error;
    }
};

export const getSectoresParaSelect = async () => {
    try {
        const response = await axios.get(API_SECTORES_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los sectores:", error);
        throw error;
    }
};