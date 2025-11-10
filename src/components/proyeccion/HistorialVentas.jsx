import React, { useState, useEffect, useCallback } from 'react';
import SubMenu from '../shared/SubMenu';
import { proyeccionesSubMenuLinks } from '../../config/menuConfig';
import { getEmpresas } from '../../services/empresa/empresaService';
import { 
  getAllVentasPorEmpresa, 
  getVentasPorEmpresaYAnio, 
  createVentasManual, 
  updateVenta, 
  deleteVenta 
} from '../../services/proyeccion/ventaHistoricaService';
import { Notifier } from '../../utils/Notifier';
import { VentaFormModal } from './VentaFormModal';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import viewStyles from '../../styles/shared/View.module.css';
import buttonStyles from '../../styles/shared/Button.module.css';

export const HistorialVentas = () => {
    const [empresas, setEmpresas] = useState([]);
    const [selectedEmpresaId, setSelectedEmpresaId] = useState('');
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [ventas, setVentas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // State para el modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Si editingVenta es null, estamos en modo CREACIÓN. Si tiene datos, estamos en modo EDICIÓN.
    const [editingVenta, setEditingVenta] = useState(null); 

    // Cargar empresas al montar el componente
    useEffect(() => {
        getEmpresas().then(setEmpresas).catch(() => Notifier.error("Error al cargar empresas."));
    }, []);

    // Cuando el usuario selecciona una empresa, buscamos todos sus registros de ventas
    // para extraer los años únicos en los que hay datos.
    useEffect(() => {
        if (!selectedEmpresaId) {
            setAvailableYears([]);
            setVentas([]);
            setSelectedYear('');
            return;
        }
        // Llamamos al endpoint que trae TODAS las ventas para sacar los años
        getAllVentasPorEmpresa(selectedEmpresaId).then(response => {
            const years = [...new Set(response.data.map(v => new Date(v.fechaVenta).getFullYear()))];
            setAvailableYears(years.sort((a, b) => b - a)); // Ordenar de más reciente a más antiguo
        });
    }, [selectedEmpresaId]);

    // Función para obtener las ventas de un año específico.
    // Usamos useCallback para evitar que se re-cree en cada render, optimizando el rendimiento.
    const fetchVentasDelAnio = useCallback(() => {
        if (!selectedEmpresaId || !selectedYear) {
            setVentas([]);
            return;
        }
        setIsLoading(true);
        getVentasPorEmpresaYAnio(selectedEmpresaId, selectedYear)
            .then(response => {
                // Ordenamos los resultados por fecha para una mejor visualización
                const sortedVentas = response.data.sort((a, b) => new Date(a.fechaVenta) - new Date(b.fechaVenta));
                setVentas(sortedVentas);
            })
            .catch(() => Notifier.error("Error al cargar las ventas del año."))
            .finally(() => setIsLoading(false));
    }, [selectedEmpresaId, selectedYear]);

    // Este efecto se ejecuta cada vez que la función fetchVentasDelAnio cambia (es decir, cuando cambian sus dependencias)
    useEffect(() => {
        fetchVentasDelAnio();
    }, [fetchVentasDelAnio]);

    // Funciones para manejar la apertura de los modales
    const handleOpenCreateModal = () => {
        setEditingVenta(null); // Ponemos en null para indicar que es modo CREACIÓN
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (venta) => {
        setEditingVenta(venta); // Pasamos los datos para indicar que es modo EDICIÓN
        setIsModalOpen(true);
    };

    // Función UNIFICADA para guardar (tanto para crear como para editar)
    const handleSave = async (ventaId, data) => {
        const isCreateMode = !ventaId;
        const toastId = Notifier.loading(isCreateMode ? "Creando nuevo registro..." : "Actualizando registro...");

        try {
            if (isCreateMode) {
                // Para crear, construimos el payload que espera el endpoint
                const payload = {
                    empresaId: parseInt(selectedEmpresaId),
                    ventas: [data] // Enviamos un array con el único objeto de venta nuevo
                };
                await createVentasManual(payload);
                Notifier.dismiss(toastId);
                Notifier.success("Venta añadida correctamente.");
            } else {
                // Para actualizar, solo enviamos los datos de la venta
                await updateVenta(ventaId, data);
                Notifier.dismiss(toastId);
                Notifier.success("Venta actualizada.");
            }
            setIsModalOpen(false); // Cerramos el modal
            fetchVentasDelAnio(); // Volvemos a cargar los datos para ver los cambios en la tabla
        } catch (error) {
            Notifier.dismiss(toastId);
            Notifier.error("Ocurrió un error al guardar los datos.");
        }
    };
    
    // Función para eliminar un registro
    const handleDelete = async (venta) => {
        const result = await Notifier.confirm({ 
            title: `¿Eliminar venta del ${new Date(venta.fechaVenta).toLocaleDateString()}?`,
            text: "Esta acción no se puede deshacer."
        });
        if (result.isConfirmed) {
            const toastId = Notifier.loading("Eliminando...");
            try {
                await deleteVenta(venta.id);
                Notifier.dismiss(toastId);
                Notifier.success("Venta eliminada.");
                // Actualizamos la lista en el frontend para no tener que recargar desde la API
                setVentas(ventas.filter(v => v.id !== venta.id));
            } catch (error) {
                Notifier.dismiss(toastId);
                Notifier.error("Error al eliminar el registro.");
            }
        }
    };

    return (
        <>
            <SubMenu links={proyeccionesSubMenuLinks} />
            <div className={viewStyles.viewContainer}>
                <div className={`${viewStyles.viewHeader} justify-content-between`}>
                    <h1 className={viewStyles.viewTitle}>Historial de Ventas</h1>
                    {/* Botón "Nuevo Registro", que solo se activa si hay una empresa seleccionada */}
                    <button 
                        className={buttonStyles.btnPrimary} 
                        onClick={handleOpenCreateModal} 
                        disabled={!selectedEmpresaId}
                        title={!selectedEmpresaId ? "Seleccione una empresa para añadir un registro" : "Añadir nueva venta"}
                    >
                        <FaPlus className="me-2" />
                        Nuevo Registro
                    </button>
                </div>

                {/* Filtros de Empresa y Año */}
                <div className="row mb-4 align-items-end p-3 bg-light rounded-3 border">
                    <div className="col-md-5">
                        <label htmlFor="empresa-select" className="form-label fw-bold">Empresa</label>
                        <select id="empresa-select" className="form-select" value={selectedEmpresaId} onChange={e => setSelectedEmpresaId(e.target.value)}>
                            <option value="">-- Seleccione una Empresa --</option>
                            {empresas.map(e => <option key={e.empresaId} value={e.empresaId}>{e.nombreEmpresa}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="year-select" className="form-label fw-bold">Año</label>
                        <select id="year-select" className="form-select" value={selectedYear} onChange={e => setSelectedYear(e.target.value)} disabled={!selectedEmpresaId}>
                            <option value="">-- Seleccione un Año --</option>
                            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>

                {/* Tabla de Datos */}
                {isLoading ? <p>Cargando datos...</p> : (
                    <div className="table-responsive">
                        <table className={viewStyles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th className="text-end">Monto</th>
                                    <th>Observación</th>
                                    <th className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventas.length > 0 ? ventas.map(v => (
                                    <tr key={v.id}>
                                        <td>{v.id}</td>
                                        <td>{new Date(v.fechaVenta).toLocaleDateString()}</td>
                                        <td className="text-end">{v.montoVenta.toLocaleString('es-SV', { style: 'currency', currency: 'USD' })}</td>
                                        <td>{v.observacion || <span className="text-muted">N/A</span>}</td>
                                        <td className={viewStyles.actionsCell}>
                                            <button className={`${buttonStyles.btnIcon} ${buttonStyles.btnIconEdit}`} onClick={() => handleOpenEditModal(v)} title="Editar"><FaEdit /></button>
                                            <button className={`${buttonStyles.btnIcon} ${buttonStyles.btnIconDelete}`} onClick={() => handleDelete(v)} title="Eliminar"><FaTrash /></button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            {selectedEmpresaId ? "No hay ventas registradas para el año seleccionado." : "Por favor, seleccione una empresa para ver su historial."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* El modal se renderiza condicionalmente para mejorar el rendimiento */}
            {isModalOpen && (
                <VentaFormModal 
                    show={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSave}
                    initialData={editingVenta}
                    isCreateMode={!editingVenta}
                />
            )}
        </>
    );
};

export default HistorialVentas;