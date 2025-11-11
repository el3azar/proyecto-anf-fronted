// src/components/ratio/Ratio.js

import React, { useState, useEffect } from 'react';
import SubMenu from '../shared/SubMenu';
import { sectoresSubMenuLinks } from '../../config/menuConfig';
import Tabla from '../shared/Tabla';
import { Notifier } from '../../utils/Notifier';

// --- Servicios a utilizar ---
import { getRatios, createRatio, updateRatio, deleteRatio } from '../../services/ratio/ratioService';

// --- El Modal ---
import { RatioFormModal } from './RatioFormModal';
import { getCategoriasRatio } from '../../services/ratio/CategoriaRatio';
import { getParametros } from '../../services/ratio/parametroSector';
import { getEmpresas } from '../../services/empresa/empresaService';

export const Ratio = () => {
  // --- Estados para los datos ---
  const [ratios, setRatios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [parametros, setParametros] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  
  // --- Estados para la UI ---
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRatio, setEditingRatio] = useState(null);

  // --- Carga de datos inicial ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const [ratiosData, categoriasData, parametrosData, empresasData] = await Promise.all([
        getRatios(),
        getCategoriasRatio(),
        getParametros(),
        getEmpresas(),
      ]);
      setRatios(ratiosData);
      setCategorias(categoriasData);
      setParametros(parametrosData);
      setEmpresas(empresasData);
    } catch (error) {
      Notifier.error('No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Definición de las columnas para la tabla ---
  const columnas = [
    { 
      Header: 'ID', 
      accessor: 'id_ratio' 
    },
    {
      Header: 'EMPRESA',
      accessor: row => row.empresa ? row.empresa.nombre_empresa : 'N/A',
    },
    {
      Header: 'CATEGORÍA',
      accessor: row => row.categoriaRatio ? row.categoriaRatio.nombre_categoria : 'N/A',
    },
    {
      Header: 'PARÁMETRO',
      accessor: row => row.parametroSector ? row.parametroSector.nombreRatio : 'N/A',
    },
    { 
      Header: 'AÑO', 
      accessor: 'anio_ratio' 
    },
    { 
      Header: 'PERÍODO', 
      accessor: 'periodo_ratio' 
    }
  ];

  // --- Manejadores de eventos del Modal ---
  const handleNuevoRatio = () => {
    setEditingRatio(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRatio(null);
  };

  const handleEditar = (ratio) => {
    setEditingRatio({
      id_ratio: ratio.id_ratio,
      empresa_id: ratio.empresa.empresaId, 
      id_categoria_ratio: ratio.categoriaRatio.idCategoriaRatio, 
      id_parametro_sector: ratio.parametroSector.idParametroSector,
      anio_ratio: ratio.anio_ratio,
      periodo_ratio: ratio.periodo_ratio,
    });
    setIsModalOpen(true);
  };

  // =============================================================
  // --- ✅ INICIO: LÓGICA PARA VER Y CALCULAR ---
  // =============================================================
  
  /**
   * Manejador para el botón "Ver".
   * TODO: Implementar la lógica deseada (ej: abrir un modal de solo lectura).
   */
  const handleVer = (ratio) => {
    console.log("Ver detalles del ratio:", ratio);
    // Aquí podrías, por ejemplo, abrir otro modal con la información detallada del ratio.
    Notifier.info(`Viendo detalles del ratio con ID: ${ratio.id_ratio}`);
  };

  /**
   * Manejador para el botón "Calcular".
   * TODO: Implementar la lógica deseada (ej: navegar a una página de cálculo).
   */
  const handleCalcular = (ratio) => {
    console.log("Calcular ratio:", ratio);
    // Aquí podrías, por ejemplo, navegar a una nueva ruta para realizar cálculos.
    // history.push(`/sectores/calculo-ratio/${ratio.id_ratio}`);
    Notifier.success(`Iniciando cálculo para el ratio con ID: ${ratio.id_ratio}`);
  };

  // =============================================================
  // --- ✅ FIN: LÓGICA PARA VER Y CALCULAR ---
  // =============================================================


  const handleSave = async (formData, id) => {
    const isEditing = !!id;
    const payload = {
      anio_ratio: parseInt(formData.anio_ratio, 10),
      periodo_ratio: formData.periodo_ratio,
      empresa_id: parseInt(formData.empresa_id, 10),
      id_categoria_ratio: parseInt(formData.id_categoria_ratio, 10),
      id_parametro_sector: parseInt(formData.id_parametro_sector, 10),
    };

    const loadingToastId = Notifier.loading(isEditing ? "Actualizando ratio..." : "Guardando nuevo ratio...");

    try {
      if (isEditing) {
        await updateRatio(id, payload);
      } else {
        await createRatio(payload);
      }
      Notifier.dismiss(loadingToastId);
      Notifier.success(`¡Ratio ${isEditing ? 'actualizado' : 'creado'} exitosamente!`);
      
      handleCloseModal();
      fetchData();
    } catch (error) {
      Notifier.dismiss(loadingToastId);
      Notifier.error(`Error al ${isEditing ? 'actualizar' : 'crear'} el ratio.`);
      console.error("Error en handleSave:", error);
    }
  };

  const handleEliminar = async (ratio) => {
    const result = await Notifier.confirm({
      title: `¿Estás seguro de eliminar el ratio?`,
      text: `Se eliminará el registro del año ${ratio.anio_ratio} para la empresa ${ratio.nombreEmpresa}. Esta acción no se puede deshacer.`,
    });

    if (result.isConfirmed) {
      const loadingToastId = Notifier.loading("Eliminando...");
      try {
        await deleteRatio(ratio.id_ratio);
        Notifier.dismiss(loadingToastId);
        Notifier.success("Ratio eliminado correctamente.");
        fetchData();
      } catch (error) {
        Notifier.dismiss(loadingToastId);
        Notifier.error("No se pudo eliminar el ratio. Inténtalo de nuevo.");
        console.error("Error en handleEliminar:", error);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <SubMenu links={sectoresSubMenuLinks} />

      <div style={{ marginTop: '2rem' }}>
        {loading ? (
          <p>Cargando ratios...</p>
        ) : (
          <Tabla
            titulo="Gestión de Ratios"
            textoBotonNuevo="Nuevo Ratio"
            columnas={columnas}
            datos={ratios}
            onNuevoClick={handleNuevoRatio}
            enEditar={handleEditar}
            enEliminar={handleEliminar}
            // --- ✅ SE PASAN LAS NUEVAS FUNCIONES COMO PROPS ---
            enVer={handleVer}
            enCalcular={handleCalcular}
          />
        )}
      </div>

      <RatioFormModal
        show={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editingRatio}
        categorias={categorias}
        parametros={parametros}
        empresas={empresas}
      />
    </div>
  );
};