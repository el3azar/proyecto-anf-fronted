// src/components/estadosfinancieros/HistorialEstadosFinancieros.jsx (CORREGIDO)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Importamos FaEye junto a FaTrash
import { FaTrash, FaEye } from 'react-icons/fa';
import SubMenu from '../shared/SubMenu';
import { estadosFinancierosSubMenuLinks } from '../../config/menuConfig';
import { getAllEstadosFinancieros, deleteEstadoFinanciero } from '../../services/estadosfinancieros/estadoFinancieroService';
import { Notifier } from '../../utils/Notifier';

import viewStyles from '../../styles/shared/View.module.css';
import buttonStyles from '../../styles/shared/Button.module.css';

const HistorialEstadosFinancieros = () => {
    const [reportes, setReportes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // La lógica de fetchReportes, handleVerDetalle y handleDelete no cambia...
    useEffect(() => {
        const fetchReportes = async () => {
            try {
                const response = await getAllEstadosFinancieros();
                setReportes(response.data);
            } catch (err) {
                Notifier.error('No se pudo cargar el historial de reportes.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchReportes();
    }, []);

    const handleVerDetalle = (id) => {
        navigate(`/estados-financieros/detalle/${id}`);
    };

    const handleDelete = async (reporte) => {
        const result = await Notifier.confirm({
            title: `¿Eliminar reporte de "${reporte.nombreEmpresa}" (${reporte.anio})?`,
            text: "Esta acción es permanente y no se puede deshacer.",
        });

        if (result.isConfirmed) {
            const toastId = Notifier.loading("Eliminando reporte...");
            try {
                await deleteEstadoFinanciero(reporte.id);
                Notifier.dismiss(toastId);
                Notifier.success("Reporte eliminado exitosamente.");
                setReportes(reportes.filter(r => r.id !== reporte.id));
            } catch (error) {
                Notifier.dismiss(toastId);
                Notifier.error(error.response?.data?.message || "No se pudo eliminar el reporte.");
            }
        }
    };

    return (
        <>
            <SubMenu links={estadosFinancierosSubMenuLinks} />
            <div className={viewStyles.viewContainer}>
                <h1 className={"text-center mb-4"}>Historial de Estados Financieros</h1>
                {isLoading ? ( <p>Cargando historial...</p> ) : (
                    <div className="table-responsive">
                        <table className={viewStyles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Empresa</th>
                                    <th>Año</th>
                                    <th>Tipo de Reporte</th>
                                    <th className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportes.length > 0 ? (
                                    reportes.map((reporte) => (
                                        <tr key={reporte.id}>
                                            <td>{reporte.id}</td>
                                            <td>{reporte.nombreEmpresa}</td>
                                            <td>{reporte.anio}</td>
                                            <td>{reporte.tipoReporte.replace('_', ' ')}</td>

                                            {/* --- INICIO DE LA SECCIÓN MODIFICADA --- */}
                                            {/* 2. Aplicamos la nueva clase a la celda <td> */}
                                            <td className={viewStyles.actionsCell}>
                                                
                                                {/* 3. Reemplazamos el botón de texto por un botón de ícono */}
                                                <button
                                                    className={`${buttonStyles.btnIcon} ${buttonStyles.btnIconEdit}`}
                                                    onClick={() => handleVerDetalle(reporte.id)}
                                                    title="Ver Detalle"
                                                >
                                                    <FaEye />
                                                </button>
                                                
                                                <button
                                                    className={`${buttonStyles.btnIcon} ${buttonStyles.btnIconDelete}`}
                                                    onClick={() => handleDelete(reporte)}
                                                    title="Eliminar reporte"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                            {/* --- FIN DE LA SECCIÓN MODIFICADA --- */}

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">No hay reportes cargados todavía.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default HistorialEstadosFinancieros;