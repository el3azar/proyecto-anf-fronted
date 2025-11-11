import React from 'react';
// 1. Importa el componente reutilizable de tu compañero
// (Ajusta la ruta si es necesario. Si 'pages' y 'shared' son hermanos, ../shared/ es correcto)
import DashboardCards from '../shared/DashboardCards';

// 2. IMPORTANTE: Importa los iconos desde 'react-bootstrap-icons'
// Estos son los que usa el componente de tu compañero.
import {
  BarChartLine,   // Para HU-001 (Análisis V/H)
  ArrowRepeat,      // Para HU-002 (Benchmark)
  ClipboardData,    // Para HU-003 (Externo)
  GraphUp,          // Para HU-004 (Evolución Ratios)
  BarChartSteps     // Para HU-006 (Evolución Cuentas)
} from 'react-bootstrap-icons';

const DashboardAnalisis = () => {
  
  // 3. Define los 5 reportes de tu módulo (basados en tus HUs)
  const items = [
    {
      label: 'Análisis Comparativo Interno',
      icon: BarChartLine,
      to: '/analisis/comparativo', // La ruta a tu reporte V/H
      descripcion: 'Análisis Vertical y Horizontal comparando dos años.' // (Opcional, si el componente lo soporta)
    },
    {
      label: 'Comparativa vs. Benchmark',
      icon: ArrowRepeat,
      to: '/analisis/benchmark',
      descripcion: 'Compara ratios contra el promedio interno del sector.'
    },
    {
      label: 'Comparativa vs. Ratios Externos',
      icon: ClipboardData,
      to: '/analisis/externo',
      descripcion: 'Compara ratios contra los parámetros externos del sistema.'
    },
    {
      label: 'Evolución de Ratios',
      icon: GraphUp,
      to: '/analisis/evolucion-ratios',
      descripcion: 'Gráficos de la evolución de ratios en 3 años.'
    },
    {
      label: 'Evolución de Cuentas',
      icon: BarChartSteps,
      to: '/analisis/evolucion-cuentas',
      descripcion: 'Gráfico de la variación de una cuenta específica.'
    }
  ];

  // 4. Renderiza el componente reutilizable pasándole tu título y tus items
  return (
    <section>
      <DashboardCards 
        title="Módulo de Análisis y Reportes" 
        items={items} 
      />
    </section>
  );
};

export default DashboardAnalisis;