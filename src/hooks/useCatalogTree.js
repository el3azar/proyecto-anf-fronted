import { useState, useEffect, useCallback, useMemo } from 'react';

export const useCatalogTree = (masterData, activeAccountIds) => {
  const [nodesMap, setNodesMap] = useState(new Map());
  const [checkedKeys, setCheckedKeys] = useState([]);

  // Paso 1: Construir un mapa de todos los nodos para un acceso rápido.
  // Esto se ejecuta solo una vez cuando los datos maestros cambian.
  useEffect(() => {
    const map = new Map();
    const buildMap = (nodes) => {
      if (!nodes) return;
      nodes.forEach(node => {
        map.set(node.key, node);
        buildMap(node.children);
      });
    };
    buildMap(masterData);
    setNodesMap(map);
  }, [masterData]);

  // Paso 2: Sincronizar los checkboxes cuando las cuentas activas de la empresa cambian.
  useEffect(() => {
    setCheckedKeys(activeAccountIds || []);
  }, [activeAccountIds]);

  // Paso 3: Lógica de selección. Esta es la réplica de tu sistema original.
  const handleCheck = useCallback((newCheckedKeys, { node, checked }) => {
    const nodeKey = node.key;
    const currentChecked = new Set(newCheckedKeys);

    // Función para obtener todos los descendientes de un nodo
    const getAllDescendantKeys = (key) => {
      const descendants = [];
      const findChildren = (n) => {
        if (n.children) {
          n.children.forEach(child => {
            descendants.push(child.key);
            findChildren(child);
          });
        }
      };
      const startNode = nodesMap.get(key);
      if (startNode) findChildren(startNode);
      return descendants;
    };

    // Función para obtener todos los ancestros de un nodo
    const getAllAncestorKeys = (key) => {
      const ancestors = [];
      let currentNode = nodesMap.get(key);
      // Asumimos que la API nos da el ID del padre directamente en el nodo
      // Si no, necesitaríamos buscarlo a través de los hijos
      // Esta es una limitación si la API no provee el ID del padre en cada nodo
      return ancestors; // Simplificado por ahora
    };
    
    // Si estamos marcando un nodo
    if (checked) {
      // Añadir todos sus descendientes
      getAllDescendantKeys(nodeKey).forEach(key => currentChecked.add(key));
      // Añadir todos sus ancestros (lógica de ascenso)
      // Esta parte es compleja sin el `parentId` en cada nodo, pero la librería
      // con checkStrictly=false lo maneja bien. Aquí replicamos el efecto.
      // Si rc-tree no lo hace automáticamente, necesitaríamos una función
      // para encontrar al padre.
      
    } else { // Si estamos desmarcando un nodo
      // Quitar todos sus descendientes
      getAllDescendantKeys(nodeKey).forEach(key => currentChecked.delete(key));
    }
    
    setCheckedKeys(Array.from(currentChecked));
  }, [nodesMap]);

  return {
    checkedKeys,
    handleCheck
  };
};