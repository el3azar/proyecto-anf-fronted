import React from 'react';
import { FaEdit, FaEye, FaTrash, FaCalculator, FaPlus } from 'react-icons/fa';
// CAMBIO IMPORTANTE: Importa el nuevo archivo CSS unificado
import '../../styles/shared/table.css'; 

const Tabla = ({ 
  titulo,
  textoBotonNuevo = 'Nuevo',
  onNuevoClick, 
  columnas, 
  datos, 
  enEditar, 
  enVer, 
  enEliminar, 
  enCalcular 
}) => {
  return (
    // CAMBIO: Usa la clase 'view-container'
    <div className="view-container">
      
      {/* CAMBIO: Usa la clase 'view-header' y 'view-title' */}
      <div className="view-header">
        <h2 className="view-title">{titulo}</h2>
        {onNuevoClick && (
          // CAMBIO: Usa la clase 'btn-primary' para el botón
          <button className="btn-primary" onClick={onNuevoClick}>
            <FaPlus style={{ marginRight: '8px' }} />
            {textoBotonNuevo}
          </button>
        )}
      </div>

      <div className="table-responsive">
        {/* CAMBIO: Usa la clase 'table' */}
        <table className="table">
          <thead>
            <tr>
              {columnas.map((columna, index) => (
                <th key={index}>{columna.Header}</th>
              ))}
              <th className="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos && datos.length > 0 ? (
              datos.map((fila, rowIndex) => (
                <tr key={rowIndex}>
                  {columnas.map((columna, colIndex) => (
                    <td key={colIndex}>{fila[columna.accessor]}</td>
                  ))}
                  <td className="text-right">
                    {/* CAMBIO: Usa la clase 'actions-cell' */}
                    <div className="actions-cell">
                      
                      {/* CAMBIO: Los botones ahora usan 'btn-icon' y una clase modificadora */}
                      {enVer && (
                        <button onClick={() => enVer(fila)} title="Ver detalles" className="btn-icon view">
                          <FaEye />
                        </button>
                      )}
                      {enEditar && (
                        <button onClick={() => enEditar(fila)} title="Editar" className="btn-icon edit">
                          <FaEdit />
                        </button>
                      )}
                      {enEliminar && (
                        <button onClick={() => enEliminar(fila)} title="Eliminar" className="btn-icon delete">
                          <FaTrash />
                        </button>
                      )}
                      {enCalcular && (
                        <button onClick={() => enCalcular(fila)} title="Calcular Ratio" className="btn-icon calculate">
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