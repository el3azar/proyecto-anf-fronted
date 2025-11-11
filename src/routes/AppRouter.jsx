import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout y Componentes de Ruta
import MainLayout from '../components/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Componentes que actúan como páginas
import Login from '../components/Login';
import DashboardGeneral from '../components/DashboardGeneral';

import { Empresas } from '../components/empresa/Empresas';
import { Sectores } from '../components/empresa/Sectores';
import { Usuarios } from '../components/usuario/Usuarios';
import { CatalogoCuentas } from '../components/catalogo/CatalogoCuentas';
import CargarEstadoFinanciero from '../components/estadosfinancieros/CargarEstadoFinanciero';
import HistorialEstadosFinancieros from '../components/estadosfinancieros/HistorialEstadosFinancieros';
import DetalleEstadoFinanciero from '../components/estadosfinancieros/DetalleEstadoFinanciero';
import { CategoriaRatio } from '../components/ratio/CategoriaRatio';
import { TipoRatio } from '../components/ratio/TipoRatio';
import { ParametroSector } from '../components/ratio/ParametroSector';
import { Ratio } from '../components/ratio/Ratio';
import { Proyecciones } from '../components/proyeccion/Proyecciones'; // Usamos el componente contenedor
import HistorialVentas from '../components/proyeccion/HistorialVentas'; // Importamos el nuevo componente de historial
import AnalisisHV from '../components/analisis/AnalisisHV';
import DashboardAnalisis from '../components/analisis/DashboardAnalisis';

export default function AppRouter() {
  return (
    <BrowserRouter>
      {/* Notificaciones globales con tu nueva paleta */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--color-darkest)',
            color: 'var(--text-light)',
            border: '1px solid var(--color-primary)',
          },
          success: {
            iconTheme: { primary: 'var(--color-accent)', secondary: '#FFF' },
          },
          error: {
            style: { border: '1px solid #D32F2F' },
            iconTheme: { primary: '#D32F2F', secondary: '#FFF' },
          }
        }}
      />

      <Routes>
        {/* Ruta pública para el Login */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas que requieren autenticación */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardGeneral />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/catalogo-cuentas" element={<CatalogoCuentas />} />

            <Route path="/analisis" element={<DashboardAnalisis/>} />
            <Route path="/analisis/comparativo" element={<AnalisisHV />} />


            <Route path="/proyecciones/cargar" element={<Proyecciones />} />
            <Route path="/proyecciones/historial" element={<HistorialVentas />} />
            <Route path="/proyecciones" element={<Navigate to="/proyecciones/cargar" replace />} />

            <Route path="/estados-financieros/cargar" element={<CargarEstadoFinanciero />} />
            <Route path="/estados-financieros/historial" element={<HistorialEstadosFinancieros />} />
            <Route path="/estados-financieros/detalle/:id" element={<DetalleEstadoFinanciero />} />

            
            <Route path="/estados-financieros" element={<Navigate to="/estados-financieros/cargar" replace />} />

            {/*Rutas para los Ratios*/}
            <Route path="/sectores" element={<Sectores />} />
            <Route path="/categoria_ratio" element={<CategoriaRatio />} />
            <Route path="/tipo_ratio" element={<TipoRatio />} />
            <Route path="/parametro_sector" element={<ParametroSector/>}/>
            <Route path="/ratios" element={<Ratio/>}/>
          </Route>
        </Route>
        
        {/* Ruta para páginas no encontradas */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}