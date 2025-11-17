import React, { useState, useEffect } from 'react';
// --- NUEVO: Importamos los componentes para el gráfico de pastel ---
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import Select from 'react-select';


import viewStyles from '../../styles/shared/View.module.css';
import buttonStyles from '../../styles/shared/Button.module.css';
import styles from '../../styles/analisis/EvolucionRatios.module.css';
import { getEmpresas } from '../../services/empresa/empresaService';
import { getCuentasTree, getSaldosCuenta } from '../../services/ratio/analisisService';

// --- NUEVO: Ampliamos la paleta de colores para el pie chart ---
const COLORS = ['#207B25', '#0088FE', '#FF8042', '#FFBB28', '#8884d8'];

const EvolucionCuenta = () => {
  const [empresas, setEmpresas] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [empresaSel, setEmpresaSel] = useState(null);
  const [cuentaSel, setCuentaSel] = useState(null);
  const [datosGrafico, setDatosGrafico] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ... (toda la lógica de useEffects y handleGenerarGrafico se mantiene igual)
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const data = await getEmpresas();
        const formattedEmpresas = data.map(emp => ({
          value: emp.nombreEmpresa,
          label: emp.nombreEmpresa
        }));
        setEmpresas(formattedEmpresas);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEmpresas();
  }, []);

  useEffect(() => {
    const flattenCuentas = (cuentasNode, flatList = []) => {
      cuentasNode.forEach(cuenta => {
        if (cuenta.esMovimiento) {
          flatList.push({
            value: cuenta.nombreCuenta,
            label: `${cuenta.codigoCuenta} - ${cuenta.nombreCuenta}`
          });
        }
        if (cuenta.children && cuenta.children.length > 0) {
          flattenCuentas(cuenta.children, flatList);
        }
      });
      return flatList;
    };

    const fetchCuentas = async () => {
      try {
        const data = await getCuentasTree();
        const cuentasAplanadas = flattenCuentas(data);
        setCuentas(cuentasAplanadas);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCuentas();
  }, []);

  const handleGenerarGrafico = async () => {
    if (!empresaSel || !cuentaSel) {
      alert('Por favor, seleccione una empresa y una cuenta.');
      return;
    }
    setLoading(true);
    setDatosGrafico([]);
    setError('');

    try {
      const data = await getSaldosCuenta(empresaSel.value, cuentaSel.value);
      const datosOrdenados = data.sort((a, b) => a.anio - b.anio);
      setDatosGrafico(datosOrdenados);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- NUEVO: Función para renderizar las etiquetas de porcentaje en el gráfico de pastel ---
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };


  return (
    <div className={viewStyles.viewContainer}>
      <div className={viewStyles.viewHeader}>
        <h2 className={viewStyles.viewTitle}>Evolución y Proporción de Saldos por Cuenta</h2>
      </div>

      {/* --- El formulario de filtros no cambia --- */}
      <div className={styles.filterBar}>
        <div className={styles.formControl} style={{ flexGrow: 2 }}>
          <label htmlFor="empresa-select">Empresa</label>
          <Select id="empresa-select" options={empresas} value={empresaSel} onChange={setEmpresaSel} placeholder="Seleccione o busque una empresa" isClearable />
        </div>
        <div className={styles.formControl} style={{ flexGrow: 3 }}>
          <label htmlFor="cuenta-select">Cuenta a Graficar</label>
          <Select id="cuenta-select" options={cuentas} value={cuentaSel} onChange={setCuentaSel} placeholder="Escriba para buscar una cuenta..." isClearable noOptionsMessage={() => "No se encontraron cuentas"} />
        </div>
        <button className={buttonStyles.btnPrimary} onClick={handleGenerarGrafico} disabled={loading}>
          {loading ? "Generando..." : "Generar"}
        </button>
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Cargando datos del gráfico...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>}
      
      {/* --- NUEVO: Área de Gráficos Modificada para mostrar ambos gráficos --- */}
      {datosGrafico.length > 0 && (
        <div className={styles.graphArea}>

          {/* --- GRÁFICO 1: Gráfico de Líneas (Existente) --- */}
          <div className={styles.graphItem}>
            <h3 className={styles.graphTitle}>
              Evolución de: {cuentaSel.value}
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="anio" />
                <YAxis />
                <Tooltip formatter={(value) => new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' }).format(value)} />
                <Legend />
                <Line type="monotone" dataKey="saldo" stroke={COLORS[0]} strokeWidth={2} name="Saldo" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* --- GRÁFICO 2: Gráfico de Pastel (Nuevo) --- */}
          <div className={styles.graphItem}>
            <h3 className={styles.graphTitle}>Proporción por Año</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosGrafico}
                  // Mapeamos los datos: 'anio' para el nombre, 'saldo' para el valor
                  dataKey="saldo"
                  nameKey="anio"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {/* Asignamos un color a cada sección del pastel */}
                  {datosGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' }).format(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvolucionCuenta;