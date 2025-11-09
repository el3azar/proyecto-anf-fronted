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
import { Proyecciones } from '../components/proyeccion/Proyecciones';
import CargarEstadoFinanciero from '../components/estadosfinancieros/CargarEstadoFinanciero';
import HistorialEstadosFinancieros from '../components/estadosfinancieros/HistorialEstadosFinancieros';
import DetalleEstadoFinanciero from '../components/estadosfinancieros/DetalleEstadoFinanciero';

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
            <Route path="/sectores" element={<Sectores />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/catalogo-cuentas" element={<CatalogoCuentas />} />
            <Route path="/proyecciones" element={<Proyecciones />} />

            <Route path="/estados-financieros/cargar" element={<CargarEstadoFinanciero />} />
            <Route path="/estados-financieros/historial" element={<HistorialEstadosFinancieros />} />
            <Route path="/estados-financieros/detalle/:id" element={<DetalleEstadoFinanciero />} />

            
            <Route path="/estados-financieros" element={<Navigate to="/estados-financieros/cargar" replace />} />

          </Route>
        </Route>
        
        {/* Ruta para páginas no encontradas */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}