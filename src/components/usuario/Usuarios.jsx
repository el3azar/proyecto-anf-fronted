import React from 'react';
import SubMenu from './../shared/SubMenu';
import { usuariosSubMenuLinks} from '../../config/menuConfig';
export const Usuarios = () => {
  return (
    <div>
      <SubMenu links={usuariosSubMenuLinks} />
      <h1>Gestión de Usuarios</h1>
      <p>Aquí se mostrará la tabla de usuarios y las opciones para crear, editar y eliminar.</p>
    </div>
  );
};
