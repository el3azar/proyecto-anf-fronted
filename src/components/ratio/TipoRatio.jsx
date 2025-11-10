import React, { useState, useEffect } from 'react';
import SubMenu from '../shared/SubMenu';
import { sectoresSubMenuLinks } from '../../config/menuConfig';
import Tabla from '../shared/Tabla'; 
import { TipoRatioFormModal } from './TipoRatioFormModal'; 

// --- 1. IMPORTA LAS FUNCIONES DEL SERVICIO Y EL NOTIFICADOR ---

import { Notifier } from '../../utils/Notifier'; // Asumo que tienes un notificador como en ejemplos anteriores
import { createTipoRatio, deleteTipoRatio, getTiposRatio, updateTipoRatio } from '../../services/ratio/TipoRatio';

export const TipoRatio = () => {
  // --- 2. ESTADOS PARA MANEJAR LOS DATOS, CARGA Y MODAL ---
  const [tiposRatio, setTiposRatio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRatio, setEditingRatio] = useState(null); 

  // --- 3. FUNCIÓN PARA OBTENER DATOS DE LA API ---
  const fetchTiposRatio = async () => {
    try {
      setLoading(true);
      const data = await getTiposRatio();
      setTiposRatio(data);
    } catch (error) {
      Notifier.error('No se pudieron cargar los tipos de ratio.');
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta una vez cuando el componente se monta
  useEffect(() => {
    fetchTiposRatio();
  }, []);

  // --- 4. CONFIGURACIÓN DE COLUMNAS PARA LA TABLA (CON ACCESORES DE LA API) ---
  const columnas = [
    { Header: 'ID', accessor: 'id_tipo_ratio' },
    { Header: 'Código', accessor: 'codigo_ratio' },
    { Header: 'Nombre', accessor: 'nombre_ratio' },
    { Header: 'Descripción', accessor: 'descripcion' },
    { Header: 'Unidad', accessor: 'unidad_ratio' },
  ];

  // --- 5. FUNCIONES PARA MANEJAR EL MODAL ---
  const handleNuevoRatio = () => {
    setEditingRatio(null);
    setIsModalOpen(true);
  };

  const handleEditar = (ratio) => {
    // Mapeamos los datos de la API a los que espera el formulario
    const dataForModal = {
      id: ratio.id_tipo_ratio,
      codigo: ratio.codigo_ratio,
      nombre: ratio.nombre_ratio,
      descripcion: ratio.descripcion,
      unidad: ratio.unidad_ratio
    };
    setEditingRatio(dataForModal);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // --- 6. FUNCIÓN DE GUARDADO (CREAR/EDITAR) CONECTADA A LA API ---
  const handleSave = async (formData, id) => {
    // Mapeamos los datos del formulario al formato que espera la API
    const payload = {
      codigo_ratio: formData.codigo,
      nombre_ratio: formData.nombre,
      descripcion: formData.descripcion,
      unidad_ratio: formData.unidad,
      id_categoria_ratio: 1 // Hardcodeado como en el ejemplo JSON
    };

    const isEditing = !!id;
    const loadingToastId = Notifier.loading(isEditing ? "Actualizando..." : "Guardando...");

    try {
      if (isEditing) {
        await updateTipoRatio(id, payload);
      } else {
        await createTipoRatio(payload);
      }
      Notifier.dismiss(loadingToastId);
      Notifier.success(`¡Tipo de ratio ${isEditing ? 'actualizado' : 'creado'} exitosamente!`);
      handleCloseModal();
      fetchTiposRatio(); // Recarga los datos de la tabla
    } catch (error) {
      Notifier.dismiss(loadingToastId);
      Notifier.error(`Error al ${isEditing ? 'actualizar' : 'crear'}.`);
    }
  };
  
  // --- 7. FUNCIÓN DE ELIMINAR CONECTADA A LA API ---
  const handleEliminar = async (ratio) => {
    const result = await Notifier.confirm({
        title: `¿Eliminar "${ratio.nombre_ratio}"?`,
        text: "Esta acción no se puede deshacer.",
    });

    if (result.isConfirmed) {
        const loadingToastId = Notifier.loading("Eliminando...");
        try {
            await deleteTipoRatio(ratio.id_tipo_ratio);
            Notifier.dismiss(loadingToastId);
            Notifier.success("Tipo de ratio eliminado.");
            fetchTiposRatio(); // Recarga los datos
        } catch (error) {
            Notifier.dismiss(loadingToastId);
            Notifier.error("No se pudo eliminar el tipo de ratio.");
        }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <SubMenu links={sectoresSubMenuLinks} />
      <div style={{ marginTop: '1rem' }}>
         {loading ? (
            <p>Cargando datos...</p>
         ) : (
            <Tabla
              titulo="Gestión de Tipos de Ratio"
              textoBotonNuevo="Nuevo Tipo"
              columnas={columnas}
              datos={tiposRatio}
              enEditar={handleEditar}
              enEliminar={handleEliminar}
              onNuevoClick={handleNuevoRatio}
              // enVer no está implementado aún
            />
         )}
      </div>
       <TipoRatioFormModal
        show={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editingRatio}
      />
    </div>
  );
};