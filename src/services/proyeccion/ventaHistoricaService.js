import axios from 'axios';

// Ruta base del módulo según la guía de la API
const API_URL = 'http://localhost:8080/api/v1/ventas-historicas';

/**
 * Obtiene todos los registros de ventas históricas para una empresa.
 * GET /empresa/{empresaId}
 */
export const getVentasPorEmpresa = (empresaId) => {
  return axios.get(`${API_URL}/empresa/${empresaId}`);
};

/**
 * Crea uno o más registros de venta manualmente.
 * POST /
 */
export const createVentasManual = (payload) => { // Recibe el objeto VentasRequestDTO
  return axios.post(API_URL, payload);
};

/**
 * Carga masiva de ventas desde un archivo Excel.
 * POST /upload
 */
export const uploadVentasExcel = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Actualiza un único registro de venta.
 * PUT /{ventaId}
 */
export const updateVenta = (ventaId, ventaData) => {
  return axios.put(`${API_URL}/${ventaId}`, ventaData);
};

/**
 * Elimina un único registro de venta.
 * DELETE /{ventaId}
 */
export const deleteVenta = (ventaId) => {
  return axios.delete(`${API_URL}/${ventaId}`);
};

/**
 * Obtiene TODAS las ventas de una empresa (para obtener los años disponibles).
 * GET /empresa/{empresaId}
 */
export const getAllVentasPorEmpresa = (empresaId) => {
  return axios.get(`${API_URL}/empresa/${empresaId}`);
};

/**
 * ¡NUEVO! Obtiene las ventas de una empresa para un año específico.
 * GET /empresa/{empresaId}/anio/{anio}
 */
export const getVentasPorEmpresaYAnio = (empresaId, anio) => {
  return axios.get(`${API_URL}/empresa/${empresaId}/anio/${anio}`);
};