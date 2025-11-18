import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// --- Servicios ---
import { getEvolucionRatios, getTiposRatio } from '../../services/ratio/analisisService';
import { getEmpresas } from '../../services/empresa/empresaService';

// --- Estilos del Proyecto ---
import viewStyles from '../../styles/shared/View.module.css';
import buttonStyles from '../../styles/shared/Button.module.css';
import styles from '../../styles/analisis/EvolucionRatios.module.css';

// --- Material UI ---
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Box
} from '@mui/material';

// --- Colores de líneas ---
const lineColors = ['#207B25', '#0088FE', '#FF8042', '#FFBB28', '#8884d8'];

const PaginaEvolucionRatios = () => {
  // --- Estados ---
  const [empresas, setEmpresas] = useState([]);
  const [empresaSel, setEmpresaSel] = useState("");

  const [ratiosDisponibles, setRatiosDisponibles] = useState([]);
  const [ratiosSel, setRatiosSel] = useState([]); // <-- Ahora será [5, 6] (números)

  const [datosGraficos, setDatosGraficos] = useState([]);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Cargar Empresas y Tipos Ratio
  // -----------------------------
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const emp = await getEmpresas();
        setEmpresas(emp);

        const ratios = await getTiposRatio();
        setRatiosDisponibles(ratios);

      } catch (error) {
        console.error(error);
        alert("Error cargando información inicial.");
      }
    };

    cargarDatos();
  }, []);

  // -----------------------------
  // Ejecutar generación de datos
  // -----------------------------
  const handleGenerarGraficos = async () => {
    if (!empresaSel || ratiosSel.length === 0) {
      alert("Seleccione una empresa y al menos un ratio.");
      return;
    }

    setLoading(true);
    setDatosGraficos([]);

    try {
      // 'ratiosSel' ahora es [5, 6, 7] (números), que coincide
      // con lo que espera el backend (Instrucción #2)
      const response = await getEvolucionRatios(empresaSel, ratiosSel);
      setDatosGraficos(response);

    } catch (error) {
      console.error(error);
      alert("Error obteniendo datos de análisis.");
    }

    setLoading(false);
  };

  // -----------------------------
  // Selección de Ratios (MUI)
  // -----------------------------
  
  const handleRatioChange = (event) => {
    const { value } = event.target;
    // Convertir SIEMPRE a números
    setRatiosSel(
      typeof value === "string"
        ? value.split(",").map(v => Number(v)) // Convierte ["5","6"] a [5, 6]
        : value.map(v => Number(v))           // Convierte ["5","6"] a [5, 6]
    );
  };

  return (
    <div className={viewStyles.viewContainer}>

      <div className={viewStyles.viewHeader}>
        <h2 className={viewStyles.viewTitle}>Evolución de Ratios Financieros</h2>
      </div>

      {/* ------------------ FILTROS ------------------ */}
      <div className={styles.filterBar}>

        {/* Selector Empresa */}
        <div className={styles.formControl}>
          <label>Empresa</label>
          <select
            value={empresaSel}
            onChange={(e) => setEmpresaSel(e.target.value)}
          >
            <option value="">Seleccione una empresa</option>
            {empresas.map((e) => (
              <option key={e.empresaId} value={e.empresaId}>
                {e.nombreEmpresa}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Ratios - MUI */}
        <div className={styles.formControl} style={{ flexGrow: 2 }}>
          <label>Ratios a Graficar</label>
          <FormControl fullWidth size="small">
            <InputLabel id="ratios-label">Ratios</InputLabel>
            <Select
              labelId="ratios-label"
              multiple
              value={ratiosSel}
              onChange={handleRatioChange}
              input={<OutlinedInput label="Ratios" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => ( // 'id' ahora es un NÚMERO
                    <Chip
                      key={id}
                      // Esta comparación (número === número) AHORA SÍ FUNCIONA
                      label={ratiosDisponibles.find(r => r.id_tipo_ratio === id)?.nombre_ratio}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            >
              {ratiosDisponibles.map((r) => (
                // El 'value' es un número (id_tipo_ratio)
                <MenuItem key={r.id_tipo_ratio} value={r.id_tipo_ratio}>
                  {r.nombre_ratio}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Botón Generar */}
        <button
          className={buttonStyles.btnPrimary}
          onClick={handleGenerarGraficos}
          disabled={loading}
        >
          {loading ? "Generando..." : "Generar"}
        </button>
      </div>

      {/* ------------------ GRÁFICOS ------------------ */}
      {loading && <p>Calculando datos…</p>}

      {datosGraficos.length > 0 && (
        <div className={styles.graphArea}>
          {ratiosSel.map((ratioId, index) => { // 'ratioId' es un NÚMERO (ej. 5)
            
            // Esta comparación (número === número) AHORA SÍ FUNCIONA
            const ratioInfo = ratiosDisponibles.find(r => r.id_tipo_ratio === ratioId);

            return (
              <div className={styles.graphItem} key={ratioId}>
                <h3 className={styles.graphTitle}>{ratioInfo?.nombre_ratio}</h3>

                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={datosGraficos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="anio" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend />

                    <Line
                      type="monotone"
                      // Convierte el ID (ej. 5) a STRING (ej. "5")
                      // Esto coincide con el JSON del backend {"anio": 2023, "5": 1.45}
                      dataKey={String(ratioId)} 
                      stroke={lineColors[index % lineColors.length]}
                      strokeWidth={2}
                      name={ratioInfo?.nombre_ratio}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaginaEvolucionRatios;