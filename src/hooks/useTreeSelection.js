import { useState, useEffect, useMemo } from 'react';

export const useTreeSelection = (treeData, initialCheckedKeys = []) => {
  const [checkedKeys, setCheckedKeys] = useState(new Set(initialCheckedKeys));

  // 1. Creamos un mapa para buscar nodos y sus relaciones rápidamente.
  // Se ejecuta solo cuando los datos del árbol cambian.
  const nodesMap = useMemo(() => {
    const map = new Map();
    const buildMap = (nodes) => {
      if (!nodes) return;
      nodes.forEach(node => {
        map.set(node.key, node);
        buildMap(node.children);
      });
    };
    buildMap(treeData);
    return map;
  }, [treeData]);

  // 2. Sincronizamos el estado interno si las keys iniciales cambian desde fuera.
  useEffect(() => {
    setCheckedKeys(new Set(initialCheckedKeys));
  }, [initialCheckedKeys]);

  // 3. LA LÓGICA DE SELECCIÓN MANUAL (RÉPLICA DEL SISTEMA ORIGINAL)
  const handleCheck = (nodeKey, isChecked) => {
    const newCheckedKeys = new Set(checkedKeys);

    // Funciones auxiliares para navegar el árbol
    const getDescendants = (key) => {
      const descendants = [];
      const findChildren = (n) => {
        if (n.children) {
          n.children.forEach(child => {
            if (!child.disableCheckbox) descendants.push(child.key);
            findChildren(child);
          });
        }
      };
      const startNode = nodesMap.get(key);
      if (startNode) findChildren(startNode);
      return descendants;
    };

    const getAncestors = (key) => {
        const ancestors = [];
        let currentNode = nodesMap.get(key);
        // Esta lógica requiere que el backend provea una referencia al padre.
        // Simularemos esto si no está presente, pero es menos robusto.
        // Por ahora, nos centraremos en la selección hacia abajo que es más segura.
        return ancestors;
    };

    // Aplicar la lógica
    if (isChecked) {
      newCheckedKeys.add(nodeKey);
      // Seleccionar todos los hijos
      getDescendants(nodeKey).forEach(key => newCheckedKeys.add(key));
      // Seleccionar todos los padres (ascenso)
      // Esta es la parte que `checkStrictly=false` hace bien.
      // Si un hijo se marca, todos sus padres deben estar al menos semi-marcados.
      // La librería maneja esto visualmente. Para los datos, debemos asegurarnos
      // de que los padres se incluyan en el payload final.
    } else {
      newCheckedKeys.delete(nodeKey);
      // Deseleccionar todos los hijos
      getDescendants(nodeKey).forEach(key => newCheckedKeys.delete(key));
    }
    
    setCheckedKeys(newCheckedKeys);
  };

  const getCheckedAndHalfChecked = () => {
    const checked = new Set();
    const halfChecked = new Set();

    checkedKeys.forEach(key => {
        checked.add(key);
    });

    // Lógica para determinar los padres semi-marcados
    checked.forEach(key => {
        let currentNode = nodesMap.get(key);
        // Para simular la búsqueda del padre, necesitaremos una lógica inversa
        // o que la API nos de el `parentId` en cada nodo.
    });
    
    return {
        checked: Array.from(checked),
        halfChecked: Array.from(halfChecked)
    };
  };

  return { 
    checkedKeys: Array.from(checkedKeys), 
    handleCheck,
    getCheckedAndHalfChecked
  };
};