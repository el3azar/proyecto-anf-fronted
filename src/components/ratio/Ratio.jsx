import React from 'react';
import SubMenu from '../shared/SubMenu';
import { sectoresSubMenuLinks } from '../../config/menuConfig';
import Tabla from '../shared/Tabla'; 
// El import de ParametroSector no se está usando, lo puedes quitar si no es necesario.
// import { ParametroSector } from './ParametroSector';

export const Ratio = () => {
  const datosSectores = [
    { id: 1, categoria: 'Tecnología', tipo:'A', parametro: 'Sector de alta tecnología', anio: 'dias', periodo: '2022-2024'},
    { id: 2, categoria: 'Salud', tipo:'B', parametro: 'Sector de cuidados de la salud', anio: 'años', periodo: '2022-2024'},
    { id: 3, categoria: 'Finanzas', tipo: 'C',parametro: 'Sector de servicios financieros', anio: 'monetaria', periodo: '2022-2024' },
  ];

  const columnasSectores = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Categoria', accessor: 'categoria' },
    { Header: 'Tipo', accessor: 'tipo' },
    { Header: 'Parametro', accessor: 'parametro' },
    { Header: 'Año', accessor: 'anio' },
    { Header: 'Periodo', accessor: 'periodo' }
  ];

 const handleNuevoRatio = () => {
    console.log("Se presionó el botón para crear un nuevo ratio.");
    // Aquí puedes agregar la lógica para abrir un modal o navegar a una página de creación.
  };

  const handleEditar = (ratio) => {
    console.log('Editando:', ratio);
  };

  const handleVer = (ratio) => {
    console.log('Viendo:', ratio);
  };

  const handleEliminar = (ratio) => {
    console.log('Eliminando:', ratio);
  };

  // 1. Crea la nueva función para manejar la acción de calcular
  const handleCalcular = (ratio) => {
    console.log('Calculando ratio para:', ratio);
    // Aquí puedes agregar la lógica para navegar a otra página, abrir un modal, etc.
  };

  return (
    <div style={{ padding: '20px' }}>
      <SubMenu links={sectoresSubMenuLinks} />

      <div style={{ marginTop: '2rem' }}>
        <Tabla
          titulo="Gestión de Ratio"
          textoBotonNuevo="Nuevo Ratio"
          columnas={columnasSectores}
          datos={datosSectores}
          enEditar={handleEditar}
          enVer={handleVer}
          enEliminar={handleEliminar}
          // 2. Pasa la nueva función como prop a la Tabla
          enCalcular={handleCalcular}
          onNuevoClick={handleNuevoRatio}
        />
      </div>
    </div>
  );
};