import React, { useState, useEffect, useMemo } from 'react';
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';
import { FaFolder, FaFolderOpen, FaFileAlt } from 'react-icons/fa';

import { getEmpresas } from '../../services/empresa/empresaService';
import { getMasterTree, getCatalogoActivoPorEmpresa, activarCuentas, desactivarCuentas, mapCompanyCatalogToTree } from '../../services/catalogo/catalogService';
import { Notifier } from '../../utils/Notifier';

import styles from '../../styles/catalogo/Catalog.module.css';
import buttonStyles from '../../styles/shared/Button.module.css';

export const CatalogoCuentas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState('');
  
  const [masterTreeData, setMasterTreeData] = useState([]);
  const [companyTreeData, setCompanyTreeData] = useState([]);
  
  const [activeAccountIds, setActiveAccountIds] = useState(new Set());
  
  const [checkedMasterInfo, setCheckedMasterInfo] = useState({ checked: [], halfChecked: [] });
  // --- CORREGIDO ---
  // checkedCompanyKeys ahora almacenará un array simple de números
  const [checkedCompanyKeys, setCheckedCompanyKeys] = useState([]); 

  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadEmpresas = async () => setEmpresas(await getEmpresas());
    loadEmpresas().catch(() => Notifier.error("No se pudieron cargar las empresas."));
  }, []);

  const fetchDataForCompany = async () => {
    if (!selectedEmpresaId) {
      setMasterTreeData([]); setCompanyTreeData([]);
      setActiveAccountIds(new Set());
      setCheckedMasterInfo({ checked: [], halfChecked: [] });
      setCheckedCompanyKeys([]);
      return;
    }
    setIsLoading(true);
    try {
      const [masterTree, activeCatalog] = await Promise.all([
        getMasterTree(),
        getCatalogoActivoPorEmpresa(selectedEmpresaId)
      ]);
      
      const activeIds = new Set(activeCatalog.map(item => item.cuentaId));
      setActiveAccountIds(activeIds);
      
      setMasterTreeData(masterTree);
      setCompanyTreeData(mapCompanyCatalogToTree(activeCatalog));
      
      setCheckedCompanyKeys([]);
    } catch (error) {
      Notifier.error("Error al cargar los catálogos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDataForCompany(); }, [selectedEmpresaId]);

  const masterTreeWithDisabled = useMemo(() => {
    const addDisabledProp = (nodes) => {
      return nodes.map(node => ({
        ...node,
        disableCheckbox: activeAccountIds.has(node.key),
        children: node.children ? addDisabledProp(node.children) : [],
      }));
    };
    return addDisabledProp(masterTreeData);
  }, [masterTreeData, activeAccountIds]);
  
  const masterInitialCheckedKeys = useMemo(() => {
    return Array.from(activeAccountIds);
  }, [activeAccountIds]);

  const handleActivate = async () => {
    const currentlyChecked = new Set(checkedMasterInfo.checked);
    const keysToActivate = Array.from(currentlyChecked).filter(key => !activeAccountIds.has(key));
    const halfKeysToActivate = checkedMasterInfo.halfChecked.filter(key => !activeAccountIds.has(key));
    const allKeysToActivate = [...new Set([...keysToActivate, ...halfKeysToActivate])];
    
    if (allKeysToActivate.length === 0) {
      Notifier.warning("No hay nuevas cuentas seleccionadas para activar.");
      return;
    }
    setIsProcessing(true);
    try {
      await activarCuentas({ empresaId: parseInt(selectedEmpresaId), cuentaIds: allKeysToActivate });
      Notifier.success("Cuentas activadas correctamente.");
      await fetchDataForCompany();
    } catch (error) {
      Notifier.error(error.response?.data?.message || "No se pudieron activar las cuentas.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeactivate = async () => {
    if (checkedCompanyKeys.length === 0) {
      Notifier.warning("Seleccione al menos una cuenta para desactivar.");
      return;
    }
    setIsProcessing(true);
    try {
      const payload = { catalogoIds: checkedCompanyKeys };
      console.log("Enviando este payload DEFINITIVO a /desactivar:", JSON.stringify(payload));
      await desactivarCuentas(payload);
      Notifier.success("Cuentas desactivadas correctamente.");
      await fetchDataForCompany();
    } catch (error) {
      Notifier.error(error.response?.data?.message || "No se pudieron desactivar las cuentas.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.viewWrapper}>
      <div className={styles.empresaSelector}>
        <label htmlFor="empresa-select">Seleccione una Empresa:</label>
        <select id="empresa-select" className="form-select" value={selectedEmpresaId}
          onChange={e => setSelectedEmpresaId(e.target.value)} disabled={isProcessing}>
          <option value="">-- Elija una empresa --</option>
          {empresas.map(emp => (<option key={emp.empresaId} value={emp.empresaId}>{emp.nombreEmpresa}</option>))}
        </select>
      </div>

      <div className={styles.panelsContainer}>
        {/* Panel Izquierdo */}
        <div className={styles.panel}>
          <h3>Catálogo Maestro</h3>
          <div className={styles.scrollableContainer}>
            {isLoading ? <p>Cargando árbol...</p> : 
              <Tree
                checkable
                checkStrictly={false}
                key={`master-tree-${selectedEmpresaId}`}
                defaultCheckedKeys={masterInitialCheckedKeys}
                onCheck={(keys, info) => setCheckedMasterInfo({ checked: keys, halfChecked: info.halfCheckedKeys })}
                treeData={masterTreeWithDisabled}
                defaultExpandAll
                disabled={!selectedEmpresaId || isProcessing}
                icon={({ isLeaf, expanded }) => isLeaf ? <FaFileAlt style={{ color: '#6c757d' }} /> : (expanded ? <FaFolderOpen style={{ color: '#f0ad4e' }} /> : <FaFolder style={{ color: '#f0ad4e' }} />)}
                showLine
              />
            }
          </div>
          <button className={buttonStyles.btnPrimary} onClick={handleActivate} disabled={!selectedEmpresaId || isProcessing}>
            Activar Seleccionadas
          </button>
        </div>

        {/* Panel Derecho */}
        <div className={styles.panel}>
          <h3>Cuentas Activas en la Empresa</h3>
          <div className={styles.scrollableContainer}>
            {isLoading ? <p>Cargando árbol...</p> :
              <Tree
                checkable
                checkStrictly={true}
                checkedKeys={checkedCompanyKeys}
                onCheck={(keysOrInfo) => {
                  // Verificamos si 'keysOrInfo' es un objeto (como el que vimos en el log) o un array.
                  // Si es un objeto, extraemos la propiedad 'checked'.
                  // Si ya es un array, lo usamos directamente.
                  const newCheckedKeys = Array.isArray(keysOrInfo) ? keysOrInfo : keysOrInfo.checked;
                  setCheckedCompanyKeys(newCheckedKeys);
                }}
                treeData={companyTreeData}
                defaultExpandAll
                disabled={!selectedEmpresaId || isProcessing}
                icon={({ isLeaf, expanded }) => isLeaf ? <FaFileAlt style={{ color: '#6c757d' }} /> : (expanded ? <FaFolderOpen style={{ color: '#f0ad4e' }} /> : <FaFolder style={{ color: '#f0ad4e' }} />)}
                showLine
              />
            }
          </div>
          <button className={buttonStyles.btnSecondary} onClick={handleDeactivate} disabled={!selectedEmpresaId || isProcessing}>
            Desactivar Seleccionadas
          </button>
        </div>
      </div>
    </div>
  );
};