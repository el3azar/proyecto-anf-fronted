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
            setIsLoading(true); // Asegura que muestre 'cargando' en cada nueva carga
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

    // --- LÓGICA CONDICIONAL MEJORADA ---
    // Este hook ahora decide qué datos calcular basado en el tipo de reporte
    const processedData = useMemo(() => {
        if (!reporte) return null;

        const sumSaldos = (arr) => arr.reduce((sum, item) => sum + item.saldo, 0);

        if (reporte.tipoReporte === 'ESTADO_RESULTADOS') {
            const ingresos = reporte.lineas.filter(l => l.codigoCuenta.startsWith('5'));
            const gastos = reporte.lineas.filter(l => l.codigoCuenta.startsWith('4'));

            const totalIngresos = sumSaldos(ingresos);
            const totalGastos = sumSaldos(gastos);

            return {
                type: 'Estado de Resultados',
                ingresos,
                gastos,
                totalIngresos,
                totalGastos,
                utilidadNeta: totalIngresos - totalGastos
            };
        }

        // Por defecto, asumimos Balance General
        const activos = reporte.lineas.filter(l => l.codigoCuenta.startsWith('1'));
        const pasivos = reporte.lineas.filter(l => l.codigoCuenta.startsWith('2'));
        const patrimonio = reporte.lineas.filter(l => l.codigoCuenta.startsWith('3'));

        const totalActivos = sumSaldos(activos);
        const totalPasivos = sumSaldos(pasivos);
        const totalPatrimonio = sumSaldos(patrimonio);

        return {
            type: 'Balance General',
            activos,
            pasivos,
            patrimonio,
            totalActivos,
            totalPasivos,
            totalPatrimonio
        };

    }, [reporte]);

    if (isLoading) return <p>Cargando detalle del reporte...</p>;
    if (!reporte || !processedData) return <p>No se encontró o no se pudo procesar el reporte.</p>;

    // Función de ayuda para renderizar una sección (reutilizable)
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
                    
                    {/* --- RENDERIZADO CONDICIONAL --- */}
                    {/* Ahora, decidimos qué renderizar basado en los datos procesados */}
                    
                    {processedData.type === 'Balance General' && (
                        <>
                            {renderSection('Activos', processedData.activos, processedData.totalActivos)}
                            {renderSection('Pasivos', processedData.pasivos, processedData.totalPasivos)}
                            {renderSection('Patrimonio', processedData.patrimonio, processedData.totalPatrimonio)}

                            <table className={localStyles.detailTable}>
                                <tbody>
                                    <tr className={localStyles.grandTotalRow}>
                                        <td>Total Pasivo y Patrimonio</td>
                                        <td className={localStyles.numberCell}>{formatCurrency(processedData.totalPasivos + processedData.totalPatrimonio)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    )}

                    {processedData.type === 'Estado de Resultados' && (
                        <>
                            {renderSection('Ingresos', processedData.ingresos, processedData.totalIngresos)}
                            {renderSection('Costos y Gastos', processedData.gastos, processedData.totalGastos)}

                            <table className={localStyles.detailTable}>
                                <tbody>
                                    <tr className={localStyles.grandTotalRow}>
                                        <td>Utilidad Neta</td>
                                        <td className={localStyles.numberCell}>{formatCurrency(processedData.utilidadNeta)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default DetalleEstadoFinanciero;