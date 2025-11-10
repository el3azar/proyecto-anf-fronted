import React, { useState, useEffect } from 'react';
import SubMenu from '../shared/SubMenu';
import { sectoresSubMenuLinks } from '../../config/menuConfig';
import Tabla from '../shared/Tabla';
import { CategoriaRatioFormModal } from './CategoriaRatioFormModal';
import { Notifier } from '../../utils/Notifier';
import { createCategoriaRatio, deleteCategoriaRatio, getCategoriasRatio, updateCategoriaRatio } from '../../services/ratio/CategoriaRatio';


export const CategoriaRatio = () => {
  const [categoriasRatio, setCategoriasRatio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const data = await getCategoriasRatio();
      setCategoriasRatio(data);
    } catch (error) {
      Notifier.error('No se pudieron cargar las categorías.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const columnas = [
    // <<< CORRECCIÓN 1: Usar el accessor correcto de la API
    { Header: 'ID', accessor: 'idCategoriaRatio' },
    { Header: 'Nombre de la Categoría', accessor: 'nombreTipo' },
    { Header: 'Descripción', accessor: 'descripcion' },
  ];

  const handleNuevaCategoria = () => {
    setEditingCategoria(null);
    setIsModalOpen(true);
  };

  const handleEditar = (categoria) => {
    setEditingCategoria({
      // <<< CORRECCIÓN 2: Mapear desde la propiedad correcta
      id: categoria.idCategoriaRatio,
      nombre: categoria.nombreTipo, 
      descripcion: categoria.descripcion,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (formData, id) => {
    const payload = {
      nombreTipo: formData.nombre,
      descripcion: formData.descripcion,
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
      fetchCategorias();
    } catch (error) {
      Notifier.dismiss(loadingToastId);
      Notifier.error(`Error al ${isEditing ? 'actualizar' : 'crear'}.`);
    }
  };

  const handleEliminar = async (categoria) => {
    const result = await Notifier.confirm({
      title: `¿Eliminar "${categoria.nombreTipo}"?`,
      text: "Esta acción no se puede deshacer.",
    });

    if (result.isConfirmed) {
      const loadingToastId = Notifier.loading("Eliminando...");
      try {
        // <<< CORRECCIÓN 3: Pasar el ID correcto a la función de eliminar
        await deleteCategoriaRatio(categoria.idCategoriaRatio);
        Notifier.dismiss(loadingToastId);
        Notifier.success("Categoría eliminada.");
        fetchCategorias();
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
          <p>Cargando categorías...</p>
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
      />
    </div>
  );
};