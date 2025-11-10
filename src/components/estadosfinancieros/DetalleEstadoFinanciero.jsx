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
    // ===== INICIO DEL CÓDIGO CORREGIDO PARA DetalleEstadoFinanciero.jsx =====

const processedData = useMemo(() => {
    if (!reporte) return null;

    const sumSaldos = (arr) => arr.reduce((sum, item) => sum + item.saldo, 0);

    if (reporte.tipoReporte === 'ESTADO_RESULTADOS') {
        // 1. FILTROS CORREGIDOS Y SIMPLIFICADOS
        // Ingresos de Operación son todas las cuentas de Ingresos de Seguros
        const ingresosOperacion = reporte.lineas.filter(l => l.codigoCuenta.startsWith('5102'));
        
        // Costos de Operación son todas las cuentas de Costos de Seguros
        const costosOperacion = reporte.lineas.filter(l => l.codigoCuenta.startsWith('4102') || l.codigoCuenta.startsWith('4103'));
        
        // Gastos de Operación son los de Admin (42...) y Financieros (4301...)
        const gastosOperacion = reporte.lineas.filter(l => l.codigoCuenta.startsWith('42') || l.codigoCuenta.startsWith('4301'));
        
        // Otros Ingresos y el Impuesto se mantienen separados
        const otrosIngresos = reporte.lineas.filter(l => l.codigoCuenta.startsWith('5204'));
        const impuestoRenta = reporte.lineas.filter(l => l.codigoCuenta.startsWith('4302'));

        // 2. Cálculo de totales (esta parte no cambia)
        const totalIngresosOp = sumSaldos(ingresosOperacion);
        const totalCostosOp = sumSaldos(costosOperacion);
        const totalGastosOp = sumSaldos(gastosOperacion);
        const totalOtrosIngresos = sumSaldos(otrosIngresos);
        const totalImpuesto = sumSaldos(impuestoRenta);

        // 3. Replicamos la matemática del PDF (esta parte no cambia)
        const utilidadAntesGastos = totalIngresosOp - totalCostosOp;
        const utilidadOperacion = utilidadAntesGastos - totalGastosOp;
        const utilidadAntesImpuesto = utilidadOperacion + totalOtrosIngresos;
        const utilidadNeta = utilidadAntesImpuesto - totalImpuesto;

        // 4. Devolvemos el objeto para la UI (esta parte no cambia)
        return {
            type: 'Estado de Resultados',
            ingresosOperacion,
            costosOperacion,
            gastosOperacion,
            otrosIngresos,
            impuestoRenta,
            totalIngresosOp,
            totalCostosOp,
            totalGastosOp,
            totalOtrosIngresos,
            totalImpuesto,
            utilidadAntesGastos,
            utilidadOperacion,
            utilidadAntesImpuesto,
            utilidadNeta
        };
    }
    
    // La lógica del Balance General se mantiene igual...
    const activos = reporte.lineas.filter(l => l.codigoCuenta.startsWith('1'));
    const pasivos = reporte.lineas.filter(l => l.codigoCuenta.startsWith('2'));
    const patrimonio = reporte.lineas.filter(l => l.codigoCuenta.startsWith('3'));
    const totalActivos = sumSaldos(activos);
    const totalPasivos = sumSaldos(pasivos);
    const totalPatrimonio = sumSaldos(patrimonio);
    return {
        type: 'Balance General',
        activos, pasivos, patrimonio,
        totalActivos, totalPasivos, totalPatrimonio
    };

}, [reporte]);

// ===== FIN DEL CÓDIGO CORREGIDO =====

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

                  {/* --- INICIO DEL BLOQUE CORREGIDO PARA ESTADO DE RESULTADOS --- */}
                    {processedData.type === 'Estado de Resultados' && (
                        <>
                            {/* Mostramos cada bloque que calculamos */}
                            {renderSection('Ingresos de Operación', processedData.ingresosOperacion, processedData.totalIngresosOp)}
                            {renderSection('Costos de Operación', processedData.costosOperacion, processedData.totalCostosOp)}

                            {/* Añadimos el primer subtotal intermedio */}
                            <table className={localStyles.detailTable}>
                                <tbody>
                                    <tr className={localStyles.subtotalRow} style={{ fontWeight: 'bold' }}>
                                        <td>Utilidad antes de gastos</td>
                                        <td className={localStyles.numberCell}>{formatCurrency(processedData.utilidadAntesGastos)}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {renderSection('Gastos de Operación', processedData.gastosOperacion, processedData.totalGastosOp)}

                            {/* Añadimos el segundo subtotal intermedio */}
                            <table className={localStyles.detailTable}>
                                <tbody>
                                    <tr className={localStyles.subtotalRow} style={{ fontWeight: 'bold' }}>
                                        <td>Utilidad de operación</td>
                                        <td className={localStyles.numberCell}>{formatCurrency(processedData.utilidadOperacion)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            {/* Mostramos los últimos bloques */}
                            {renderSection('Otros Ingresos (neto)', processedData.otrosIngresos, processedData.totalOtrosIngresos)}
                            {renderSection('Impuesto sobre la Renta', processedData.impuestoRenta, processedData.totalImpuesto)}
                            
                            {/* Y finalmente, el total general */}
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
                    {/* --- FIN DEL BLOQUE CORREGIDO --- */}
                </div>
            </div>
        </>
    );
};

export default DetalleEstadoFinanciero;