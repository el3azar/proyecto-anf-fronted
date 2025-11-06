import React from 'react';
import SubMenu from './../shared/SubMenu';
import { estadosFinancierosSubMenuLinks} from '../../config/menuConfig';
export const EstadosFinancieros = () => {
  return (
    <div>
      <SubMenu links={estadosFinancierosSubMenuLinks} />
      <h1>Gestión de Estados Financieros</h1>
      <p>Aquí se mostrará la lista de estados financieros y las opciones para cargar nuevos.</p>
    </div>
  );
};
