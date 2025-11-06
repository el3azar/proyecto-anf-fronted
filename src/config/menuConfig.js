// 1. Importa los nuevos íconos al principio del archivo
import { House, Building, PeopleFill, Diagram3, FileEarmarkText, JournalCheck, GraphUpArrow } from 'react-bootstrap-icons';

// Solo necesitamos una lista de enlaces, ya que no hay roles
export const mainLinks = [
  { to: "/dashboard", label: "Dashboard", icon: House },
  { to: "/empresas", label: "Empresas", icon: Building },
  { to: "/sectores", label: "Sectores", icon: Diagram3 },
  { to: "/usuarios", label: "Usuarios", icon: PeopleFill },
  
  // --- INICIO DE LAS NUEVAS OPCIONES ---
  { to: "/catalogo-cuentas", label: "Catálogo de Cuentas", icon: JournalCheck },
  { to: "/proyecciones", label: "Proyecciones", icon: GraphUpArrow },
  // --- FIN DE LAS NUEVAS OPCIONES ---
  
  { to: "/estados-financieros", label: "Estados Financieros", icon: FileEarmarkText },
];

/**
 * Configuraciones centralizadas para los sub-menús de cada módulo.
 */

export const empresasSubMenuLinks = [
  { to: '/empresas', label: 'Ver Empresas' },
  { to: '/empresas/nuevo', label: 'Registrar Empresa' },
  { to: '/empresas/inactivas', label: 'Ver Inactivas' },
];

export const sectoresSubMenuLinks = [
  { to: '/sectores', label: 'Ver Sectores' },
  { to: '/sectores/nuevo', label: 'Registrar Sector' },
];

export const usuariosSubMenuLinks = [
    { to: '/usuarios', label: 'Ver Usuarios' },
    { to: '/usuarios/nuevo', label: 'Registrar Usuario' },
];

/**
 * Enlaces para el submenú del módulo de Catálogo de Cuentas.
 * Este flujo es más específico.
 */
export const catalogoCuentasSubMenuLinks = [
  { to: '/catalogo-cuentas', label: 'Gestión por Empresa' },
  { to: '/catalogo-cuentas/maestro', label: 'Ver Catálogo Maestro' },
];

/**
 * Enlaces para el submenú del módulo de Proyecciones.
 * Orientado a la creación y visualización de análisis.
 */
export const proyeccionesSubMenuLinks = [
  { to: '/proyecciones', label: 'Generar Nueva Proyección' },
  { to: '/proyecciones/historial', label: 'Ver Proyecciones Guardadas' },
  { to: '/proyecciones/escenarios', label: 'Análisis de Escenarios' },
];

/**
 * Enlaces para el submenú del módulo de Estados Financieros.
 * Enfocado en la carga de datos y la visualización de reportes.
 */
export const estadosFinancierosSubMenuLinks = [
  { to: '/estados-financieros', label: 'Cargar Estado Financiero' },
  { to: '/estados-financieros/historial', label: 'Ver Historial' },
  { to: '/estados-financieros/balance-general', label: 'Balance General' },
  { to: '/estados-financieros/estado-resultados', label: 'Estado de Resultados' },
];
