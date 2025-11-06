import React from 'react';
import SubMenu from './../shared/SubMenu';
import { empresasSubMenuLinks } from '../../config/menuConfig';


export const Empresas = () => { // <-- Fíjate en el "export const"
  return (
    <div>
        <SubMenu links={empresasSubMenuLinks} />
      <h1>Gestión de Empresas</h1>
      <p>Aquí se mostrará la tabla de empresas y las opciones para crear, editar y eliminar.</p>
    </div>
  );
};