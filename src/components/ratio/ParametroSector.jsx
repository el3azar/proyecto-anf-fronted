import React, { useState, useEffect } from 'react';
import SubMenu from '../shared/SubMenu';
import { sectoresSubMenuLinks } from '../../config/menuConfig';
import Tabla from '../shared/Tabla';
import { ParametroSectorFormModal } from './ParametroSectorFormModal';
import { Notifier } from '../../utils/Notifier';
import { createParametro, deleteParametro, getCategoriasParaSelect, getParametros, getSectoresParaSelect, updateParametro } from '../../services/ratio/parametroSector';


export const ParametroSector = () => {
  const [parametros, setParametros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParametro, setEditingParametro] = useState(null);

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const [parametrosData, categoriasData, sectoresData] = await Promise.all([
        getParametros(),
        getCategoriasParaSelect(),
        getSectoresParaSelect()
      ]);

      // 🔹 Mapeamos los datos para que sean planos
      const parametrosMapeados = parametrosData.map(p => ({
        ...p,
        nombreSector: p.sector?.nombre_sector || 'N/A',
        nombreCategoria: p.categoriaRatio?.nombre_categoria || 'N/A'
      }));

      setParametros(parametrosMapeados);
      setCategorias(categoriasData);
      setSectores(sectoresData);
    } catch (error) {
      Notifier.error('Error al cargar los datos iniciales.');
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, []);

  const columnas = [
    { Header: 'ID', accessor: 'idParametroSector' },
    { Header: 'Nombre Parámetro', accessor: 'nombreRatio' },
  { Header: 'Sector', accessor: 'nombreSector' },,
    { Header: 'Valor', accessor: 'valorReferencia' },
    { Header: 'Año', accessor: 'anioReferencia' },
    { Header: 'Fuente', accessor: 'fuente' },
  ];

  const handleNuevo = () => {
    setEditingParametro(null);
    setIsModalOpen(true);
  };

  const handleEditar = (parametro) => {
    // <<< CORRECCIÓN 2: Hacemos el mapeo de datos más seguro con optional chaining (?.)
    setEditingParametro({
      id: parametro.idParametroSector,
      nombreRatio: parametro.nombreRatio,
      valorReferencia: parametro.valorReferencia,
      fuente: parametro.fuente,
      anioReferencia: parametro.anioReferencia,
      // Usamos '?' para evitar errores si 'sector' o 'categoriaRatio' fueran nulos
      id_sector: parametro.sector?.id_sector,
      id_categoria_ratio: parametro.categoriaRatio?.id_categoria_ratio
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = async (formData, id) => {
    const payload = {
      ...formData,
      id_sector: parseInt(formData.id_sector, 10),
      id_categoria_ratio: parseInt(formData.id_categoria_ratio, 10)
    };
    delete payload.id; 

    const isEditing = !!id;
    const toastId = Notifier.loading(isEditing ? 'Actualizando...' : 'Guardando...');

    try {
      if (isEditing) {
        await updateParametro(id, payload);
      } else {
        await createParametro(payload);
      }
      Notifier.success(`Parámetro ${isEditing ? 'actualizado' : 'creado'}.`);
      handleCloseModal();
      const data = await getParametros();
      setParametros(data);
    } catch (error) {
      Notifier.error(`Error al ${isEditing ? 'actualizar' : 'crear'}.`);
    } finally {
      Notifier.dismiss(toastId);
    }
  };
  
  const handleEliminar = async (parametro) => {
    const result = await Notifier.confirm({ title: `¿Eliminar "${parametro.nombreRatio}"?` });
    if (result.isConfirmed) {
      const toastId = Notifier.loading('Eliminando...');
      try {
        await deleteParametro(parametro.idParametroSector);
        Notifier.success('Parámetro eliminado.');
        const data = await getParametros();
        setParametros(data);
      } catch (error) {
        Notifier.error('No se pudo eliminar el parámetro.');
      } finally {
        Notifier.dismiss(toastId);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <SubMenu links={sectoresSubMenuLinks} />
      
      <div style={{ marginTop: '2rem' }}>
        {loading ? <p>Cargando datos...</p> : (
          <Tabla
            titulo="Gestión de Parámetros por Sector"
            textoBotonNuevo="Nuevo Parámetro"
            columnas={columnas}
            datos={parametros}
            enEditar={handleEditar}
            enEliminar={handleEliminar}
            onNuevoClick={handleNuevo}
          />
        )}
      </div>

      <ParametroSectorFormModal
        show={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editingParametro}
        categorias={categorias}
        sectores={sectores}
      />
    </div>
  );
};