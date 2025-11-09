import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEstadoFinancieroById } from '../../services/estadosfinancieros/estadoFinancieroService';
import { Notifier } from '../../utils/Notifier';
import { ArrowLeftCircle } from 'react-bootstrap-icons';
import SubMenu from '../shared/SubMenu';
import { estadosFinancierosSubMenuLinks } from '../../config/menuConfig';

import viewStyles from '../../styles/shared/View.module.css';
import buttonStyles from '../../styles/shared/Button.module.css';
import localStyles from '../../styles/estadosfinancieros/DetalleEstadoFinanciero.module.css';

// Función para formatear números como moneda
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const DetalleEstadoFinanciero = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reporte, setReporte] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReporte = async () => {
            try {
                const response = await getEstadoFinancieroById(id);
                setReporte(response.data);
            } catch (error) {
                Notifier.error('No se pudo cargar el detalle del reporte.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchReporte();
    }, [id]);

    // Usamos useMemo para agrupar y calcular totales solo cuando el reporte cambia
    const { activos, pasivos, patrimonio, totalActivos, totalPasivos, totalPatrimonio } = useMemo(() => {
        if (!reporte) return { activos: [], pasivos: [], patrimonio: [], totalActivos: 0, totalPasivos: 0, totalPatrimonio: 0 };

        const activos = reporte.lineas.filter(l => l.codigoCuenta.startsWith('1'));
        const pasivos = reporte.lineas.filter(l => l.codigoCuenta.startsWith('2'));
        const patrimonio = reporte.lineas.filter(l => l.codigoCuenta.startsWith('3'));

        const sumSaldos = (arr) => arr.reduce((sum, item) => sum + item.saldo, 0);

        return {
            activos, pasivos, patrimonio,
            totalActivos: sumSaldos(activos),
            totalPasivos: sumSaldos(pasivos),
            totalPatrimonio: sumSaldos(patrimonio),
        };
    }, [reporte]);

    if (isLoading) return <p>Cargando detalle del reporte...</p>;
    if (!reporte) return <p>No se encontró el reporte.</p>;

    // Función de ayuda para renderizar una sección de la tabla
    const renderSection = (title, items, total) => (
        <section className={localStyles.section}>
            <h4 className={localStyles.sectionTitle}>{title}</h4>
            <table className={localStyles.detailTable}>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id} className={localStyles.tableRow}>
                            <td>{item.codigoCuenta} - {item.nombreCuenta}</td>
                            <td className={localStyles.numberCell}>{formatCurrency(item.saldo)}</td>
                        </tr>
                    ))}
                    <tr className={localStyles.subtotalRow}>
                        <td>Total {title}</td>
                        <td className={localStyles.numberCell}>{formatCurrency(total)}</td>
                    </tr>
                </tbody>
            </table>
        </section>
    );

    return (
        <>
            <SubMenu links={estadosFinancierosSubMenuLinks} />
            <div className={viewStyles.viewContainer}>
                <button className={`${buttonStyles.btnSecondary} mb-4`} onClick={() => navigate('/estados-financieros/historial')}>
                    <ArrowLeftCircle className="me-2" />
                    Volver al Historial
                </button>

                <div className={localStyles.reportContainer}>
                    <header className={localStyles.reportHeader}>
                        <h2>{reporte.nombreEmpresa}</h2>
                        <h3>{reporte.tipoReporte.replace('_', ' ')} - {reporte.anio}</h3>
                    </header>
                    
                    {renderSection('Activos', activos, totalActivos)}
                    {renderSection('Pasivos', pasivos, totalPasivos)}
                    {renderSection('Patrimonio', patrimonio, totalPatrimonio)}

                    <table className={localStyles.detailTable}>
                        <tbody>
                            <tr className={localStyles.grandTotalRow}>
                                <td>Total Pasivo y Patrimonio</td>
                                <td className={localStyles.numberCell}>{formatCurrency(totalPasivos + totalPatrimonio)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default DetalleEstadoFinanciero;