// src/components/ratio/CategoriaRatio.js

import React, { useState, useEffect } from 'react';
import SubMenu from '../shared/SubMenu';
import { sectoresSubMenuLinks } from '../../config/menuConfig';
import Tabla from '../shared/Tabla';
import { CategoriaRatioFormModal } from './CategoriaRatioFormModal';
import { Notifier } from '../../utils/Notifier';
import { createCategoriaRatio, deleteCategoriaRatio, getCategoriasRatio, updateCategoriaRatio } from '../../services/ratio/CategoriaRatio';
// --- INICIO DE MODIFICACIONES ---
import { getTiposRatio } from '../../services/ratio/TipoRatio'; // 1. Importar el nuevo servicio
// --- FIN DE MODIFICACIONES ---

export const CategoriaRatio = () => {
  const [categoriasRatio, setCategoriasRatio] = useState([]);
  const [tiposRatio, setTiposRatio] = useState([]); // 2. Nuevo estado para los tipos de ratio
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);

  // 3. Función para cargar ambos conjuntos de datos
  const fetchData = async () => {
    try {
      setLoading(true);
      // Usamos Promise.all para cargar en paralelo
      const [categoriasData, tiposData] = await Promise.all([
        getCategoriasRatio(),
        getTiposRatio()
      ]);
      setCategoriasRatio(categoriasData);
      setTiposRatio(tiposData);
    } catch (error) {
      Notifier.error('No se pudieron cargar los datos necesarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columnas = [
    { Header: 'ID', accessor: 'idCategoriaRatio' },
    { Header: 'Nombre de la Categoría', accessor: 'nombreTipo' },
    // 4. Nueva columna para mostrar el nombre del tipo de ratio
    { Header: 'Descripción', accessor: 'descripcion' },
  ];

  const handleNuevaCategoria = () => {
    setEditingCategoria(null);
    setIsModalOpen(true);
  };

  const handleEditar = (categoria) => {
    setEditingCategoria({
      // 5. Mapear todos los datos necesarios para el formulario, incluyendo el ID del tipo
      id: categoria.idCategoriaRatio,
      nombre: categoria.nombreTipo, 
      descripcion: categoria.descripcion,
      idTipoRatio: categoria.idTipoRatio, // Tu API ya debería devolver este campo
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (formData, id) => {
    // 6. Construir el payload con el nuevo campo 'idTipoRatio'
    const payload = {
      nombreTipo: formData.nombre,
      descripcion: formData.descripcion,
      // El valor del select viene como string, lo convertimos a número
      idTipoRatio: parseInt(formData.idTipoRatio, 10),
    };

    const isEditing = !!id;
    const loadingToastId = Notifier.loading(isEditing ? "Actualizando..." : "Guardando...");

    try {
      if (isEditing) {
        await updateCategoriaRatio(id, payload);
      } else {
        await createCategoriaRatio(payload);
      }
      Notifier.dismiss(loadingToastId);
      Notifier.success(`¡Categoría ${isEditing ? 'actualizada' : 'creada'} exitosamente!`);
      handleCloseModal();
      fetchData(); // Volvemos a cargar todo para refrescar la tabla
    } catch (error) {
      Notifier.dismiss(loadingToastId);
      Notifier.error(`Error al ${isEditing ? 'actualizar' : 'crear'}.`);
    }
  };

  const handleEliminar = async (categoria) => {
    // ... (Esta función no necesita cambios)
    const result = await Notifier.confirm({
      title: `¿Eliminar "${categoria.nombreTipo}"?`,
      text: "Esta acción no se puede deshacer.",
    });

    if (result.isConfirmed) {
      const loadingToastId = Notifier.loading("Eliminando...");
      try {
        await deleteCategoriaRatio(categoria.idCategoriaRatio);
        Notifier.dismiss(loadingToastId);
        Notifier.success("Categoría eliminada.");
        fetchData();
      } catch (error) {
        Notifier.dismiss(loadingToastId);
        Notifier.error("No se pudo eliminar la categoría.");
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <SubMenu links={sectoresSubMenuLinks} />
      
      <div style={{ marginTop: '2rem' }}>
        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <Tabla
            titulo="Gestión de Categorías"
            textoBotonNuevo="Nueva Categoría"
            columnas={columnas}
            datos={categoriasRatio}
            enEditar={handleEditar}
            enEliminar={handleEliminar}
            onNuevoClick={handleNuevaCategoria}
          />
        )}
      </div>

      <CategoriaRatioFormModal
        show={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editingCategoria}
        // 7. Pasar la lista de tipos de ratio al modal
        tiposRatio={tiposRatio}
      />
    </div>
  );
};