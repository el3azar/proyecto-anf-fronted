
const API_BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Función genérica para manejar las peticiones fetch.
 * Centraliza la validación de la respuesta y el parseo del JSON.
 * @param {string} url - La URL a la que se hará la petición.
 * @param {object} options - Opciones para la petición fetch (GET, POST, etc.).
 * @returns {Promise<any>} - La data en formato JSON.
 * @throws {Error} - Lanza un error si la respuesta de la red no es 'ok'.
 */
const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    // Intenta obtener un mensaje de error del cuerpo de la respuesta si es posible
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || `Error en la petición: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

/**
 * Obtiene la lista de todas las empresas.
 */
export const getEmpresas = () => {
  return apiFetch(`${API_BASE_URL}/empresas`);
};

/**
 * Obtiene la estructura de árbol del catálogo de cuentas.
 */
export const getCuentasTree = () => {
  return apiFetch(`${API_BASE_URL}/cuentas-maestro/tree`);
};

export const getTiposRatio = () => {
  return apiFetch(`${API_BASE_URL}/tipos-ratio`);
};


/**
 * Obtiene los saldos anuales de una cuenta específica para una empresa.
 * @param {string} nombreEmpresa - El nombre de la empresa.
 * @param {string} nombreCuenta - El nombre de la cuenta.
 */
export const getSaldosCuenta = (nombreEmpresa, nombreCuenta) => {
  // Usamos URLSearchParams para construir la query string de forma segura
  const params = new URLSearchParams({ nombreEmpresa, nombreCuenta });
  const url = `${API_BASE_URL}/estados-financieros/saldos-cuenta-por-nombre?${params.toString()}`;
  return apiFetch(url);
};

/**
 * Obtiene la evolución de ratios para una empresa dada.
 * @param {number} empresaId
 * @param {Array<string>} ratios
 */
export const getEvolucionRatios = (empresaId, ratios) => {
  const params = new URLSearchParams({
    empresaId,
    ratios: ratios.join(','),
  });

  return apiFetch(`${API_BASE_URL}/analisis/evolucion-ratios?${params.toString()}`);
};