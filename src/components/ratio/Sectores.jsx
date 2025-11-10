import React from 'react';
import SubMenu from '../shared/SubMenu';
import { sectoresSubMenuLinks } from '../../config/menuConfig';
import Tabla from '../shared/Tabla'; 

export const Sectores = () => {
  const datosSectores = [
    { id: 1, nombre: 'Tecnología', descripcion: 'Sector de alta tecnología', pais: 'Irlanda', fuente: 'Fuentes confiabel'},
    { id: 2, nombre: 'Salud', descripcion: 'Sector de cuidados de la salud', pais: 'El Salvador', fuente: 'Fuentes Vetoben' },
    { id: 3, nombre: 'Finanzas', descripcion: 'Sector de servicios financieros', pais: 'Canada', fuente: 'Fuentes falsa' },
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
      Header: 'Descripción',
      accessor: 'descripcion',
    },
    {
      Header: 'Pais',
      accessor: 'pais',
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
     
      {/* Añadimos un margen superior a la tabla */}
      <div style={{ marginTop: '2rem' }}>
         <Tabla
          titulo="Gestión de Sectores"
          textoBotonNuevo="Nuevo Sector"
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