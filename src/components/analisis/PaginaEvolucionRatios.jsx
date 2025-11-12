import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- 1. Importaciones de Estilo del Proyecto ---
import viewStyles from '../../styles/shared/View.module.css';
import buttonStyles from '../../styles/shared/Button.module.css';
import styles from '../../styles/analisis/EvolucionRatios.module.css'; 


import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Box
} from '@mui/material';

const lineColors = [
  '#207B25', 
  '#0088FE', 
  '#FF8042', 
  '#FFBB28', 
  '#8884d8'  
];


const ratiosDisponibles = [
  { value: 'LIQUIDEZ_CORRIENTE', label: 'Liquidez Corriente' },
  { value: 'PRUEBA_ACIDA', label: 'Prueba Ácida' },
  { value: 'ENDEUDAMIENTO', label: 'Nivel de Endeudamiento' },
  { value: 'ROE', label: 'ROE (Rentabilidad sobre Patrimonio)' },
  { value: 'ROA', label: 'ROA (Rentabilidad sobre Activos)' },
];

const PaginaEvolucionRatios = () => {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSel, setEmpresaSel] = useState('');
  const [ratiosSel, setRatiosSel] = useState([]);
  const [datosGraficos, setDatosGraficos] = useState([]);
  const [loading, setLoading] = useState(false);


  const handleGenerarGraficos = async () => {
    if (!empresaSel || ratiosSel.length === 0) {
      alert('Por favor, seleccione una empresa y al menos un ratio.');
      return;
    }
    setLoading(true);
    setDatosGraficos([]);
    
    const dataSimulada = [
      { anio: '2021', LIQUIDEZ_CORRIENTE: 1.5, ROE: 0.12, ENDEUDAMIENTO: 0.45, PRUEBA_ACIDA: 0.8, ROA: 0.05 },
      { anio: '2022', LIQUIDEZ_CORRIENTE: 1.7, ROE: 0.14, ENDEUDAMIENTO: 0.42, PRUEBA_ACIDA: 0.9, ROA: 0.07 },
      { anio: '2023', LIQUIDEZ_CORRIENTE: 1.6, ROE: 0.13, ENDEUDAMIENTO: 0.44, PRUEBA_ACIDA: 0.85, ROA: 0.06 },
    ];

    setDatosGraficos(dataSimulada);
    setLoading(false);
  };

  const handleRatioChange = (event) => {
    const { target: { value } } = event;
    setRatiosSel(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    // --- 4. Usa el Contenedor de Vista Estándar ---
    <div className={viewStyles.viewContainer}>
      <div className={viewStyles.viewHeader}>
        <h2 className={viewStyles.viewTitle}>
          Evolución de Ratios Financieros
        </h2>
      </div>
      
      {/* --- 5. Usa el FilterBar (CSS Modules) en lugar de Grid (MUI) --- */}
      <div className={styles.filterBar}>

        {/* Selector de Empresa (Traducido a HTML Estándar) */}
        <div className={styles.formControl}>
          <label htmlFor="empresa-select">Empresa</label>
          <select 
            id="empresa-select"
            value={empresaSel} 
            onChange={e => setEmpresaSel(e.target.value)}
          >
            <option value="">Seleccione una empresa</option>
            {/* {empresas.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.nombre}</option>
            ))} */}
            <option value={1}>Empresa Mapfre (Simulada)</option>
          </select>
        </div>
        
        {/* Selector de Ratios (Mantenemos MUI por complejidad) */}
        {/* Le damos 'flex-grow: 2' para que ocupe más espacio que los otros */}
        <div className={styles.formControl} style={{ flexGrow: 2 }}>
          <label>Ratios a Graficar</label>
          {/* Este FormControl es de MUI, pero se adapta al layout */}
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="ratio-label-id" sx={{fontSize: '0.9rem', top: '-2px'}}>
              Ratios a Graficar
            </InputLabel>
            <Select
              labelId="ratio-label-id"
              multiple
              value={ratiosSel}
              onChange={handleRatioChange}
              input={<OutlinedInput label="Ratios a Graficar" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, paddingTop: '5px' }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={ratiosDisponibles.find(r => r.value === value)?.label}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            >
              {ratiosDisponibles.map((ratio) => (
                <MenuItem key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Botón (Traducido a buttonStyles) */}
        <button
          className={buttonStyles.btnPrimary}
          onClick={handleGenerarGraficos}
          disabled={loading}
        >
          {loading ? "Generando..." : "Generar"}
        </button>
      </div>
      
      {/* --- 6. Área de Gráficos (Traducido a CSS Modules) --- */}
      {loading && <p>Calculando datos...</p>}
      
      {datosGraficos.length > 0 && (
        <div className={styles.graphArea}>
          {ratiosSel.map((ratioValue, index) => {
            const ratioLabel = ratiosDisponibles.find(r => r.value === ratioValue)?.label;
            return (
              <div className={styles.graphItem} key={ratioValue}>
                <h3 className={styles.graphTitle}>{ratioLabel}</h3>
                {/* ResponsiveContainer ahora tiene un contenedor padre (graphItem)
                    que define su tamaño, solucionando el problema de "angosto" */}
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={datosGraficos}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="anio" />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey={ratioValue} 
                            // --- 7. Asigna colores de la paleta ---
                        stroke={lineColors[index % lineColors.length]} 
                        strokeWidth={2}
                        name={ratioLabel} 
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
