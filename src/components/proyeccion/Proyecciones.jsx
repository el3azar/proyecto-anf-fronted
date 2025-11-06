import React from 'react';
import SubMenu from './../shared/SubMenu';
import { proyeccionesSubMenuLinks } from '../../config/menuConfig';
export const Proyecciones = () => {
  return (
    <div>
      <SubMenu links={proyeccionesSubMenuLinks} />
      <h1>Proyecciones Financieras</h1>
      <p>Aquí se mostrarán las herramientas y reportes para generar proyecciones basadas en los estados financieros.</p>
    </div>
  );
};