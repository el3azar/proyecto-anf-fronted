import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBuilding } from 'react-icons/fa'; // Iconos actualizados
import { getEmpresas, createEmpresa, updateEmpresa, deleteEmpresa } from '../../services/empresa/empresaService';
import { Notifier } from '../../utils/Notifier';
import { EmpresaFormModal } from './EmpresaFormModal';
import viewStyles from '../../styles/shared/View.module.css';
import buttonStyles from '../../styles/shared/Button.module.css';

export const Empresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState(null);
  
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmpresas = async () => {
    try { 
      setLoading(true); 
      setEmpresas(await getEmpresas()); 
    } 
    catch (error) { Notifier.error('No se pudieron cargar las empresas.'); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEmpresas(); }, []);

  // Lógica de filtrado por búsqueda (se ejecuta solo cuando cambia la lista o el término de búsqueda)
  const empresasFiltradas = useMemo(() => {
    if (!searchTerm) {
      return empresas; // Si no hay búsqueda, devuelve todas
    }
    return empresas.filter(empresa => 
      empresa.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [empresas, searchTerm]);

  const handleOpenCreateModal = () => { setEditingEmpresa(null); setIsModalOpen(true); };
  const handleOpenEditModal = (empresa) => { setEditingEmpresa(empresa); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingEmpresa(null); };

  const handleSave = async (data, id) => {
    const isEditing = !!id;
    const toastId = Notifier.loading(isEditing ? "Actualizando..." : "Guardando...");
    try {
      if (isEditing) { await updateEmpresa(id, data); } 
      else { await createEmpresa(data); }
      Notifier.dismiss(toastId);
      Notifier.success(`¡Empresa ${isEditing ? 'actualizada' : 'creada'}!`);
      handleCloseModal();
      fetchEmpresas();
    } catch (err) {
      Notifier.dismiss(toastId);
      Notifier.error(err.response?.data?.message || `Error al ${isEditing ? 'actualizar' : 'crear'}.`);
    }
  };

  const handleDelete = async (empresa) => {
    const result = await Notifier.confirm({ title: `¿Eliminar "${empresa.nombreEmpresa}"?`, text: "Esta acción no se puede deshacer." });
    if (result.isConfirmed) {
      const toastId = Notifier.loading("Eliminando...");
      try {
        await deleteEmpresa(empresa.empresaId);
        Notifier.dismiss(toastId); Notifier.success("Empresa eliminada.");
        fetchEmpresas();
      } catch (error) {
        Notifier.dismiss(toastId); Notifier.error("No se pudo eliminar la empresa.");
      }
    }
  };

  return (
    <div className={viewStyles.viewContainer}>
      {/* --- HEADER MEJORADO --- */}
      <div className={viewStyles.viewHeader}>
        <div>
          <h2 className={viewStyles.viewTitle}>Gestión de Empresas</h2>
          <p className={viewStyles.viewSubtitle}>Crea, edita y gestiona las empresas del sistema.</p>
        </div>
        <button className={buttonStyles.btnPrimary} onClick={handleOpenCreateModal}>
          <FaPlus className="me-2" />Nueva Empresa
        </button>
      </div>

      {/* --- BARRA DE BÚSQUEDA --- */}
      <div className={viewStyles.searchWrapper}>
        <label htmlFor="search-input" className={viewStyles.searchIconLabel}>
          <FaSearch />
        </label>
        <input 
          id="search-input"
          type="text"
          placeholder="Buscar por nombre de empresa..."
          className={viewStyles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? <p className="text-center">Cargando...</p> : (
        <div className="table-responsive">
          {/* Lógica condicional para mostrar tabla o estado vacío */}
          {empresasFiltradas.length > 0 ? (
            <table className={viewStyles.table}>
              <thead>
                <tr>
                  <th>ID</th><th>Nombre</th><th>NIT</th><th>Sector</th><th>Usuario ID</th><th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empresasFiltradas.map((e) => (
                  <tr key={e.empresaId}>
                    <td>{e.empresaId}</td><td>{e.nombreEmpresa}</td><td>{e.empresaNit || 'N/A'}</td><td>{e.nombreSector}</td><td>{e.usuarioId}</td>
                    <td className="text-end">
                      <button className={`${buttonStyles.btnIcon} ${buttonStyles.btnIconEdit} me-2`} onClick={() => handleOpenEditModal(e)}><FaEdit /></button>
                      <button className={`${buttonStyles.btnIcon} ${buttonStyles.btnIconDelete}`} onClick={() => handleDelete(e)}><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // --- NUEVO ESTADO VACÍO ---
            <div className={viewStyles.emptyState}>
              <FaBuilding size={50} className={viewStyles.emptyStateIcon} />
              <h3 className={viewStyles.emptyStateTitle}>
                {searchTerm ? 'No se encontraron empresas' : 'Aún no hay empresas registradas'}
              </h3>
              <p className={viewStyles.emptyStateText}>
                {searchTerm 
                  ? `Intenta con otro término de búsqueda.`
                  : '¡Crea la primera para empezar a trabajar!'}
              </p>
            </div>
          )}
        </div>
      )}
      
      <EmpresaFormModal show={isModalOpen} onClose={handleCloseModal} onSave={handleSave} initialData={editingEmpresa} />
    </div>
  );
};