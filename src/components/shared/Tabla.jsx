import React from 'react';
// 1. Importa el nuevo icono
import { FaEdit, FaEye, FaTrash, FaCalculator } from 'react-icons/fa';
// La ruta de tu CSS podría ser diferente, ajústala si es necesario
import '../../styles/shared/table.css'; 

// 2. Agrega 'enCalcular' a las props que recibe el componente
const Tabla = ({ columnas, datos, enEditar, enVer, enEliminar, enCalcular,onNuevoClick  }) => {
  return (

  
    <div className="tabla-component-wrapper">
      
      {/* 3. Renderizado condicional del botón 'Nuevo' */}
      {onNuevoClick && (
        <div className="tabla-header">
          <button className="btn-nuevo" onClick={onNuevoClick}>
            Nuevo
          </button>
        </div>
      )}

    <div className="tabla-container">
      <table className="tabla">
        <thead>
          <tr>
            {columnas.map((columna, index) => (
              <th key={index}>{columna.Header}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.length > 0 ? (
            datos.map((fila, rowIndex) => (
              <tr key={rowIndex}>
                {columnas.map((columna, colIndex) => (
                  <td key={colIndex}>{fila[columna.accessor]}</td>
                ))}
                <td>
                  <div className="acciones-cell">
                     <button onClick={() => enVer(fila)} title="Ver detalles">
                      <FaEye />
                    </button>

                    <button onClick={() => enEditar(fila)} title="Editar">
                      <FaEdit />
                    </button>

                    <button onClick={() => enEliminar(fila)} title="Eliminar">
                      <FaTrash />
                    </button>

                    {enCalcular && (
                      <button onClick={() => enCalcular(fila)} title="Calcular Ratio">
                        <FaCalculator />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columnas.length + 1} style={{ textAlign: 'center' }}>
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Tabla;