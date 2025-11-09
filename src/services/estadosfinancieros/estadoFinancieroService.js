import axios from 'axios';

// Usamos la misma URL base que tus otros servicios
const API_URL = 'http://localhost:8080/api/v1/estados-financieros';

/**
 * Sube un archivo de estado financiero en formato Excel.
 * @param {File} file - El archivo Excel seleccionado por el usuario.
 * @returns {Promise} La promesa de la petición de Axios.
 */
export const uploadEstadoFinanciero = (file) => {
    const formData = new FormData();
    // La clave 'file' debe coincidir con el @RequestParam("file") en el Controller de Spring Boot
    formData.append('file', file);

    // Asumimos un token de autenticación si es necesario en el futuro.
    // Por ahora, se omite si tu API no lo requiere para este endpoint.
    return axios.post(`${API_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            // 'Authorization': `Bearer ${getToken()}` // Descomentar cuando JWT esté activo
        }
    });
};

/**
 * Obtiene la lista de todos los estados financieros cargados.
 * @returns {Promise<Array>} Una promesa que resuelve a un array de estados financieros.
 */
export const getAllEstadosFinancieros = () => {
    return axios.get(API_URL, {
        headers: {
            // 'Authorization': `Bearer ${getToken()}` // Descomentar cuando JWT esté activo
        }
    });
};

/**
 * Obtiene un estado financiero específico por su ID.
 * @param {number} id - El ID del estado financiero.
 * @returns {Promise<Object>} Una promesa que resuelve al objeto del estado financiero.
 */
export const getEstadoFinancieroById = (id) => {
    return axios.get(`${API_URL}/${id}`, {
        headers: {
            // 'Authorization': `Bearer ${getToken()}` // Descomentar cuando JWT esté activo
        }
    });
};

/**
 * Elimina un estado financiero por su ID.
 * @param {number} id - El ID del estado financiero a eliminar.
 * @returns {Promise} La promesa de la petición de Axios.
 */
export const deleteEstadoFinanciero = (id) => {
    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            // 'Authorization': `Bearer ${getToken()}` // Descomentar cuando JWT esté activo
        }
    });
};