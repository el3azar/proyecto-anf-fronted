import React from 'react';
import SubMenu from '../shared/SubMenu';
import { sectoresSubMenuLinks } from '../../config/menuConfig';
import Tabla from '../shared/Tabla'; 

export const ParametroSector = () => {
  const datosSectores = [
    { id: 1, nombre: 'Tecnología', sector: 'seguro', valor_referencia: 'Irlanda', anio:'2022', fuente: 'Fuentes confiabel'},
    { id: 2, nombre: 'Salud', sector: 'financiero', valor_referencia: 'El Salvador', anio: '2022', fuente: 'Fuentes Vetoben' },
    { id: 3, nombre: 'Finanzas', sector: 'financiero', valor_referencia: 'Canada', anio:'2022', fuente: 'Fuentes falsa' },
  ];

  const columnasSectores = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Nombre del Sector',
      accessor: 'nombre',
    },
    {
        Header: 'Sector',
        accessor: 'sector',
    },
    {
      Header: 'Referencia',
      accessor: 'valor_referencia',
    },
    {
      Header: 'Año',
      accessor: 'anio',
    },
    {
      Header: 'Fuente',
      accessor: 'fuente',
    }
  ];

 const handleNuevoRatio = () => {
    console.log("Se presionó el botón para crear un nuevo ratio.");
    // Aquí puedes agregar la lógica para abrir un modal o navegar a una página de creación.
  };

  const handleEditar = (sector) => {
    console.log('Editando:', sector);
  };

  const handleVer = (sector) => {
    console.log('Viendo:', sector);
  };

  const handleEliminar = (sector) => {
    console.log('Eliminando:', sector);
  };

  return (
    // Puedes agregar un padding o margen al contenedor principal
    <div style={{ padding: '20px' }}>
      <SubMenu links={sectoresSubMenuLinks} />
      <h1>Gestión de Pametro </h1> 
      {/* Añadimos un margen superior a la tabla */}
      <div style={{ marginTop: '2rem' }}>
        <Tabla
          columnas={columnasSectores}
          datos={datosSectores}
          enEditar={handleEditar}
          enVer={handleVer}
          enEliminar={handleEliminar}
          onNuevoClick={handleNuevoRatio}
        />
      </div>
    </div>
  );
};