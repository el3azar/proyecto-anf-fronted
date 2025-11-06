import React from 'react';
import SubMenu from './../shared/SubMenu';
import { sectoresSubMenuLinks } from '../../config/menuConfig';
export const Sectores = () => {
  return (
    <div>
      <SubMenu links={sectoresSubMenuLinks} />  
      <h1>Gestión de Sectores</h1>
      <p>Aquí se mostrará la tabla de sectores y las opciones para crear, editar y eliminar.</p>
    </div>
  );
};
