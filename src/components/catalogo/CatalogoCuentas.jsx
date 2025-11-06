import React from 'react';
import SubMenu from './../shared/SubMenu';
import { catalogoCuentasSubMenuLinks } from '../../config/menuConfig';

export const CatalogoCuentas = () => {
  return (
    <div>
      <SubMenu links={catalogoCuentasSubMenuLinks} />
      <h1>Gestión del Catálogo de Cuentas</h1>
      <p>Aquí se mostrará la interfaz para activar, desactivar y gestionar las cuentas del catálogo maestro para una empresa.</p>
    </div>
  );
};