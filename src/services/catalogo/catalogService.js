import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

/**
 * Endpoint 1: Obtiene la estructura de árbol completa del catálogo maestro.
 * GET /cuentas-maestro/tree
 */
export const getMasterTree = async () => {
  try {
    const response = await axios.get(`${API_URL}/cuentas-maestro/tree`);
    // La API ya devuelve los datos en el formato de árbol que necesitamos.
    // Solo renombramos 'cuentaId' a 'key' y 'nombreCuenta' a 'title' para rc-tree.
    return mapApiTreeToRcTree(response.data);
  } catch (error) {
    console.error("Error al obtener el árbol maestro:", error);
    throw error;
  }
};

/**
 * Endpoint 2: Activa una lista de cuentas maestras para una empresa.
 * POST /catalogo-empresa/activar
 */
export const activarCuentas = async (payload) => { // { empresaId, cuentaIds }
  try {
    await axios.post(`${API_URL}/catalogo-empresa/activar`, payload);
  } catch (error) {
    console.error("Error al activar cuentas:", error);
    throw error;
  }
};

/**
 * Endpoint 3: Obtiene la lista plana de cuentas activas para una empresa.
 * GET /catalogo-empresa/empresa/{empresaId}
 */
export const getCatalogoActivoPorEmpresa = async (empresaId) => {
  try {
    const response = await axios.get(`${API_URL}/catalogo-empresa/empresa/${empresaId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el catálogo para la empresa ${empresaId}:`, error);
    throw error;
  }
};

/**
 * Endpoint 4: Desactiva una lista de cuentas del catálogo de una empresa.
 * POST /catalogo-empresa/desactivar
 */
export const desactivarCuentas = async (payload) => { // { catalogoIds }
  try {
    await axios.post(`${API_URL}/catalogo-empresa/desactivar`, payload);
  } catch (error) {
    console.error("Error al desactivar cuentas:", error);
    throw error;
  }
};

// --- NUEVA FUNCIÓN AÑADIDA ---
// Esta función convierte la lista plana de cuentas activas en un árbol
// que rc-tree puede usar, similar a como lo hacía tu sistema original.
export const mapCompanyCatalogToTree = (flatCatalog) => {
  const nodes = {};
  const tree = [];

  // Primera pasada: Crear un nodo para cada cuenta y mapearlos por su cuentaId
  flatCatalog.forEach(item => {
    nodes[item.cuentaId] = {
      key: item.idCatalogo, // La KEY para desactivar es idCatalogo
      title: `${item.codigoCuenta} - ${item.nombreCuenta}`,
      children: [],
      // Guardamos la data original por si se necesita
      originalData: item,
    };
  });

  // Segunda pasada: Construir la jerarquía
  flatCatalog.forEach(item => {
    // Para encontrar al padre, buscamos el código de cuenta de nivel superior.
    // Ejemplo: el padre de "110101" es "1101".
    const parentCode = item.codigoCuenta.substring(0, item.codigoCuenta.length - 2);
    
    // Buscamos en todo el catálogo un item cuyo código coincida con el del padre
    const parentItem = flatCatalog.find(p => p.codigoCuenta === parentCode);

    if (parentItem && nodes[parentItem.cuentaId]) {
      // Si encontramos un padre, añadimos el nodo actual como su hijo
      nodes[parentItem.cuentaId].children.push(nodes[item.cuentaId]);
    } else {
      // Si no tiene padre (es un nodo raíz en esta selección), lo añadimos al árbol principal
      tree.push(nodes[item.cuentaId]);
    }
  });

  // Limpiamos los arrays de 'children' vacíos para que rc-tree no muestre un expansor
  const cleanEmptyChildren = (nodesToClean) => {
    nodesToClean.forEach(node => {
      if (node.children && node.children.length > 0) {
        cleanEmptyChildren(node.children);
      } else {
        delete node.children;
      }
    });
  };
  
  cleanEmptyChildren(tree);

  return tree;
};

// --- Función de Utilidad ---
// Mapea recursivamente la estructura del backend al formato que espera rc-tree
function mapApiTreeToRcTree(nodes) {
  if (!nodes) return [];
  return nodes.map(node => ({
    key: node.cuentaId,
    title: `${node.codigoCuenta} - ${node.nombreCuenta}`,
    children: mapApiTreeToRcTree(node.children),
    isLeaf: !node.children || node.children.length === 0,
    // --- LÍNEA ELIMINADA ---
    // Se elimina la siguiente línea para que TODOS los nodos tengan un checkbox funcional:
    // disableCheckbox: !node.esMovimiento, 
  }));
}