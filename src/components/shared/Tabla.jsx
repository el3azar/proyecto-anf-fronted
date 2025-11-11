import React from 'react';
import { FaEdit, FaEye, FaTrash, FaCalculator, FaPlus } from 'react-icons/fa';
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
  // Determinar si hay alguna acción disponible
  const tieneAcciones = enEditar || enVer || enEliminar || enCalcular;

  return (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">{titulo}</h2>
        {onNuevoClick && (
          <button className="btn-primary" onClick={onNuevoClick}>
            <FaPlus style={{ marginRight: '8px' }} />
            {textoBotonNuevo}
          </button>
        )}
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              {columnas.map((columna, index) => (
                <th key={index}>{columna.Header}</th>
              ))}
              {tieneAcciones && <th className="actions-column">Acciones</th>}
            </tr>
          </thead>

          <tbody>
            {datos && datos.length > 0 ? (
              datos.map((fila, rowIndex) => (
                <tr key={rowIndex}>
                  {columnas.map((columna, colIndex) => (
                    <td key={colIndex}>
                      {/* ✅ Soporte para accessor tipo función o string */}
                      {typeof columna.accessor === 'function'
                        ? columna.accessor(fila)
                        : fila[columna.accessor]}
                    </td>
                  ))}

                  {/* Renderizamos la columna de acciones solo si hay alguna */}
                  {tieneAcciones && (
                    <td className="text-right">
                      <div className="actions-cell">
                        {enVer && (
                          <button
                            onClick={() => enVer(fila)}
                            title="Ver detalles"
                            className="btn-icon view"
                          >
                            <FaEye />
                          </button>
                        )}
                        {enEditar && (
                          <button
                            onClick={() => enEditar(fila)}
                            title="Editar"
                            className="btn-icon edit"
                          >
                            <FaEdit />
                          </button>
                        )}
                        {enEliminar && (
                          <button
                            onClick={() => enEliminar(fila)}
                            title="Eliminar"
                            className="btn-icon delete"
                          >
                            <FaTrash />
                          </button>
                        )}
                        {enCalcular && (
                          <button
                            onClick={() => enCalcular(fila)}
                            title="Calcular Ratio"
                            className="btn-icon calculate"
                          >
                            <FaCalculator />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columnas.length + (tieneAcciones ? 1 : 0)} style={{ textAlign: 'center' }}>
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
