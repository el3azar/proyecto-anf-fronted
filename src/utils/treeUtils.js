/**
 * Convierte una lista plana de cuentas en una estructura de árbol anidada
 * que la librería rc-tree puede entender.
 * @param {Array} accounts - La lista plana de cuentas desde la API.
 * @param {number|null} parentId - El ID del padre para la recursión.
 * @returns {Array} - Un array de nodos de árbol.
 */
export const buildTree = (accounts, parentId = null) => {
  const treeNodes = [];

  // Filtra las cuentas que son hijas directas del parentId actual
  const children = accounts.filter(account => {
    // La API puede enviar 'cuentaPadre' como null o un objeto con un 'cuentaId'
    const accountParentId = account.cuentaPadre ? account.cuentaPadre.cuentaId : null;
    return accountParentId === parentId;
  });

  for (const child of children) {
    // Llama recursivamente para encontrar los hijos de este nodo
    const childNodes = buildTree(accounts, child.cuentaId);
    
    // Crea el nodo en el formato que rc-tree necesita
    const treeNode = {
      key: child.cuentaId, // El ID de la cuenta maestra
      title: `${child.codigoCuenta} - ${child.nombreCuenta}`,
      children: childNodes.length > 0 ? childNodes : null,
      // Guardamos los datos originales para usarlos después
      originalData: child 
    };
    treeNodes.push(treeNode);
  }

  // Ordena los nodos por el código de cuenta para una visualización correcta
  return treeNodes.sort((a, b) => a.originalData.codigoCuenta.localeCompare(b.originalData.codigoCuenta));
};


/**
 * Construye el árbol para el catálogo de la empresa. Es similar a buildTree,
 * pero la 'key' debe ser el 'idCatalogo' para la desactivación.
 * @param {Array} companyCatalog - La lista de CatalogoResponseDTO.
 * @returns {Array} - Un array de nodos de árbol.
 */
export const buildCompanyTree = (companyCatalog) => {
    const accounts = companyCatalog.map(item => ({
        cuentaId: item.cuentaId,
        codigoCuenta: item.codigoCuenta,
        nombreCuenta: item.nombreCuenta,
        // Asumimos que el backend no nos da la estructura de árbol, la reconstruimos
        // Si el backend no envía el padre, esta lógica es una aproximación simple.
        // Una mejor solución a futuro es que la API envíe la estructura de padres.
        cuentaPadre: { cuentaId: inferParentIdFromCode(item.codigoCuenta) }
    }));

    return buildTree(accounts);
};

// Función auxiliar para inferir el ID del padre a partir del código.
// Esta es una suposición y depende de que tu catálogo maestro esté disponible
// para hacer una búsqueda real. Por ahora, es una simulación.
function inferParentIdFromCode(code) {
    // Lógica simple: si el código es "110101", el padre podría ser "1101".
    // Esto es muy dependiente de tu estructura de códigos.
    return null; // Simplificado por ahora
}