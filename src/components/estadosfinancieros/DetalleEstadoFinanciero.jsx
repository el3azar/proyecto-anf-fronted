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

const formatCurrency = (value) => {
    if (value === null || typeof value === 'undefined') return '0.00';
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
            setIsLoading(true);
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

    const processedData = useMemo(() => {
        if (!reporte) return null;
        const sumSaldos = (arr) => arr.reduce((sum, item) => sum + item.saldo, 0);
        const isBankReport = reporte.lineas.some(l => l.codigoCuenta.startsWith('5103'));

        if (reporte.tipoReporte === 'ESTADO_RESULTADOS' && isBankReport) {
            // --- LÓGICA CORREGIDA PARA BANCOS ---
            const ingresosOperacion = reporte.lineas.filter(l => l.codigoCuenta.startsWith('5103'));
            // Costos ahora incluye el código 410101 que asignamos a "Otros Servicios"
            const costosOperacion = reporte.lineas.filter(l => ['410301', '410302', '430101', '410101'].includes(l.codigoCuenta));
            const reservasSaneamiento = reporte.lineas.filter(l => l.codigoCuenta === '410303');
            // Gastos ahora es más simple y preciso
            const gastosOperacion = reporte.lineas.filter(l => l.codigoCuenta.startsWith('420211') || l.codigoCuenta.startsWith('420212') || l.codigoCuenta.startsWith('420209'));
            const otrosIngresos = reporte.lineas.filter(l => l.codigoCuenta.startsWith('52'));
            const gastosNoOperacionales = reporte.lineas.filter(l => l.codigoCuenta.startsWith('4302') || l.codigoCuenta.startsWith('4303'));

            // El resto de la matemática ya era correcta
            const totalIngresosOperacion = sumSaldos(ingresosOperacion);
            const totalCostosOperacion = sumSaldos(costosOperacion);
            const totalReservasSaneamiento = sumSaldos(reservasSaneamiento);
            const totalGastosOperacion = sumSaldos(gastosOperacion);
            const totalOtrosIngresos = sumSaldos(otrosIngresos);
            const totalGastosNoOperacionales = sumSaldos(gastosNoOperacionales);

            const utilidadAntesGastos = totalIngresosOperacion - totalCostosOperacion - totalReservasSaneamiento;
            const utilidadOperacion = utilidadAntesGastos - totalGastosOperacion;
            const utilidadAntesImpuesto = utilidadOperacion + totalOtrosIngresos;
            const utilidadNeta = utilidadAntesImpuesto - totalGastosNoOperacionales;
            
            return {
                type: 'Estado de Resultados - Banco',
                ingresosOperacion, costosOperacion, reservasSaneamiento, gastosOperacion, otrosIngresos, gastosNoOperacionales,
                totalIngresosOperacion, totalCostosOperacion, totalReservasSaneamiento, totalGastosOperacion, totalOtrosIngresos, totalGastosNoOperacionales,
                utilidadAntesGastos, utilidadOperacion, utilidadAntesImpuesto, utilidadNeta
            };
        } 
        
        // ... (resto del código para Aseguradoras y Balance General, que no cambia)
        else if (reporte.tipoReporte === 'ESTADO_RESULTADOS') {
            const ingresos = reporte.lineas.filter(l => l.codigoCuenta.startsWith('5'));
            const gastos = reporte.lineas.filter(l => l.codigoCuenta.startsWith('4'));
            const totalIngresos = sumSaldos(ingresos);
            const totalGastos = sumSaldos(gastos);
            return {
                type: 'Estado de Resultados - General',
                ingresos, gastos, totalIngresos, totalGastos,
                utilidadNeta: totalIngresos - totalGastos
            };
        }

        const activos = reporte.lineas.filter(l => l.codigoCuenta.startsWith('1'));
        const pasivos = reporte.lineas.filter(l => l.codigoCuenta.startsWith('2'));
        const patrimonio = reporte.lineas.filter(l => l.codigoCuenta.startsWith('3'));
        return {
            type: 'Balance General',
            activos, pasivos, patrimonio,
            totalActivos: sumSaldos(activos),
            totalPasivos: sumSaldos(pasivos),
            totalPatrimonio: sumSaldos(patrimonio)
        };
    }, [reporte]);

    if (isLoading) return <p>Cargando detalle del reporte...</p>;
    if (!reporte || !processedData) return <p>No se encontró o no se pudo procesar el reporte.</p>;

    const renderSection = (title, items = [], total) => (
        <section className={localStyles.section}>
            <h4 className={localStyles.sectionTitle}>{title}</h4>
            <table className={localStyles.detailTable}>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id || `${item.codigoCuenta}-${item.saldo}-${Math.random()}`} className={localStyles.tableRow}>
                            <td>{item.codigoCuenta} - {item.nombreCuenta}</td>
                            <td className={localStyles.numberCell}>{formatCurrency(item.saldo)}</td>
                        </tr>
                    ))}
                    {items.length > 0 && (
                        <tr className={localStyles.subtotalRow}>
                            <td>Total {title}</td>
                            <td className={localStyles.numberCell}>{formatCurrency(total)}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
    
    return (
        <>
            <SubMenu links={estadosFinancierosSubMenuLinks} />
            <div className={viewStyles.viewContainer}>
                <button className={`${buttonStyles.btnSecondary} mb-4`} onClick={() => navigate('/estados-financieros/historial')}>
                    <ArrowLeftCircle className="me-2" /> Volver al Historial
                </button>
                <div className={localStyles.reportContainer}>
                    <header className={localStyles.reportHeader}>
                        <h2>{reporte.nombreEmpresa}</h2>
                        <h3>{reporte.tipoReporte.replace('_', ' ')} - {reporte.anio}</h3>
                    </header>
                    
                    {processedData.type === 'Balance General' && (
                        <>
                            {renderSection('Activos', processedData.activos, processedData.totalActivos)}
                            {renderSection('Pasivos', processedData.pasivos, processedData.totalPasivos)}
                            {renderSection('Patrimonio', processedData.patrimonio, processedData.totalPatrimonio)}
                            <table className={localStyles.detailTable}><tbody><tr className={localStyles.grandTotalRow}><td>Total Pasivo y Patrimonio</td><td className={localStyles.numberCell}>{formatCurrency(processedData.totalPasivos + processedData.totalPatrimonio)}</td></tr></tbody></table>
                        </>
                    )}

                    {processedData.type === 'Estado de Resultados - Banco' && (
                        <>
                           {renderSection('Ingresos de Operación', processedData.ingresosOperacion, processedData.totalIngresosOperacion)}
                           {renderSection('Costos de Operación', processedData.costosOperacion, processedData.totalCostosOperacion)}
                           {renderSection('Reservas de Saneamiento', processedData.reservasSaneamiento, processedData.totalReservasSaneamiento)}
                           <table className={localStyles.detailTable}><tbody><tr className={localStyles.subtotalRow} style={{color: 'var(--color-dark)'}}><td>Utilidad antes de Gastos</td><td className={localStyles.numberCell}>{formatCurrency(processedData.utilidadAntesGastos)}</td></tr></tbody></table>
                           {renderSection('Gastos de Operación', processedData.gastosOperacion, processedData.totalGastosOperacion)}
                           <table className={localStyles.detailTable}><tbody><tr className={localStyles.subtotalRow} style={{color: 'var(--color-dark)'}}><td>Utilidad de Operación</td><td className={localStyles.numberCell}>{formatCurrency(processedData.utilidadOperacion)}</td></tr></tbody></table>
                           {renderSection('Otros Ingresos y Gastos (Netos)', processedData.otrosIngresos, processedData.totalOtrosIngresos)}
                           <table className={localStyles.detailTable}><tbody><tr className={localStyles.subtotalRow} style={{color: 'var(--color-dark)'}}><td>Utilidad antes de Impuesto</td><td className={localStyles.numberCell}>{formatCurrency(processedData.utilidadAntesImpuesto)}</td></tr></tbody></table>
                           {renderSection('Gastos No Operacionales', processedData.gastosNoOperacionales, processedData.totalGastosNoOperacionales)}
                           <table className={localStyles.detailTable}><tbody><tr className={localStyles.grandTotalRow}><td>Utilidad Neta</td><td className={localStyles.numberCell}>{formatCurrency(processedData.utilidadNeta)}</td></tr></tbody></table>
                        </>
                    )}

                    {processedData.type === 'Estado de Resultados - General' && (
                        <>
                            {renderSection('Ingresos', processedData.ingresos, processedData.totalIngresos)}
                            {renderSection('Costos y Gastos', processedData.gastos, processedData.totalGastos)}
                            <table className={localStyles.detailTable}><tbody><tr className={localStyles.grandTotalRow}><td>Utilidad Neta</td><td className={localStyles.numberCell}>{formatCurrency(processedData.utilidadNeta)}</td></tr></tbody></table>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default DetalleEstadoFinanciero;