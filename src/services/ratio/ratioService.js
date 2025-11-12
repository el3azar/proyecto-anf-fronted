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
// --- Funciones de Cálculo ---

/**
 * Llama al endpoint del backend para calcular un ratio de Liquidez.
 * @param {number} id - El ID del ratio a calcular.
 */
export const calculateLiquidezRatio = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/calcular-liquidez`);
    return response.data;
  } catch (error) {
    console.error(`Error al calcular el ratio de liquidez con ID ${id}:`, error);
    throw error;
  }
};

// ✅ AÑADE LAS NUEVAS FUNCIONES DE CÁLCULO AQUÍ

/**
 * Llama al endpoint para calcular un ratio de Capital de Trabajo.
 * @param {number} id - El ID del ratio a calcular.
 */
export const calculateCapitalTrabajoRatio = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/calcular-capital-trabajo`);
    return response.data;
  } catch (error) {
    console.error(`Error al calcular el ratio de capital de trabajo con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Llama al endpoint para calcular un ratio de Razón de Efectivo.
 * @param {number} id - El ID del ratio a calcular.
 */
export const calculateEfectivoRatio = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/calcular-efectivo`);
    return response.data;
  } catch (error) {
    console.error(`Error al calcular el ratio de efectivo con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Llama al endpoint para calcular un ratio de Rotación de Cuentas por Cobrar.
 * @param {number} id - El ID del ratio a calcular.
 */
export const calculateRotacionCuentasPorCobrarRatio = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/calcular-rotacion-cuentas-cobrar`);
    return response.data;
  } catch (error) {
    console.error(`Error al calcular el ratio de rotación de cuentas por cobrar con ID ${id}:`, error);
    throw error;
  }
};


/**
 * Llama al endpoint para calcular un ratio de Período Medio de Cobranza.
 * @param {number} id - El ID del ratio a calcular.
 */
export const calculatePeriodoCobranzaRatio = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/calcular-periodo-cobranza`);
    return response.data;
  } catch (error) {
    console.error(`Error al calcular el período medio de cobranza con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Llama al endpoint para calcular la Rotación de Activos Totales.
 * @param {number} id - El ID del ratio a calcular.
 */
export const calculateRotacionActivosTotalesRatio = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/calcular-rotacion-activos-totales`);
    return response.data;
  } catch (error) {
    console.error(`Error al calcular la rotación de activos totales con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Llama al endpoint para calcular la Rotación de Activos Fijos.
 * @param {number} id - El ID del ratio a calcular.
 */
export const calculateRotacionActivosFijosRatio = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/calcular-rotacion-activos-fijos`);
    return response.data;
  } catch (error) {
    console.error(`Error al calcular la rotación de activos fijos con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Llama al endpoint para calcular el Margen Bruto.
 * @param {number} id - El ID del ratio a calcular.
 */
export const calculateMargenBrutoRatio = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/calcular-margen-bruto`);
    return response.data;
  } catch (error) {
    console.error(`Error al calcular el margen bruto con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Llama al endpoint para calcular el Margen Operativo.
 * @param {number} id - El ID del ratio a calcular.
 */
export const calculateMargenOperativoRatio = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/calcular-margen-operativo`);
    return response.data;
  } catch (error) {
    console.error(`Error al calcular el margen operativo con ID ${id}:`, error);
    throw error;
  }
};