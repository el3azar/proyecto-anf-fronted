import React, { useEffect, useState } from 'react';
import SubMenu from './../shared/SubMenu';
import { proyeccionesSubMenuLinks } from '../../config/menuConfig';
import { getEmpresas } from '../../services/empresa/empresaService';
import buttonStyles from '../../styles/shared/Button.module.css';
import viewStyles from '../../styles/shared/View.module.css';

export const Proyecciones = () => {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const [metodo, setMetodo] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [ventas, setVentas] = useState(Array(12).fill('')); // 12 meses vacíos

  // Cargar empresas desde el backend
  useEffect(() => {
    const cargarEmpresas = async () => {
      try {
        const data = await getEmpresas();
        setEmpresas(data);
      } catch (error) {
        console.error("Error al cargar empresas:", error);
      }
    };
    cargarEmpresas();
  }, []);

  const handleArchivoChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleVentaChange = (index, value) => {
    const nuevasVentas = [...ventas];
    nuevasVentas[index] = value;
    setVentas(nuevasVentas);
  };

  const handleGenerarProyeccion = () => {
    if (!empresaSeleccionada || !metodo) {
      alert("Por favor seleccione una empresa y un método de proyección.");
      return;
    }

    console.log("Generando proyección con los siguientes datos:", {
      empresaSeleccionada,
      metodo,
      archivo,
      ventas
    });
  };

  return (
    <div className={viewStyles.viewContainer}>
      <SubMenu links={proyeccionesSubMenuLinks} />

      <h1 className={viewStyles.viewTitle}>Proyección de Ventas</h1>
      <p className="mb-4">
        Este módulo permite realizar una proyección de ventas a 12 meses basada en datos históricos.
        Puede subir un archivo Excel o ingresar los valores manualmente.
      </p>

      {/* Selector de Empresa */}
      <div className="mb-3">
        <label className="form-label">Seleccione la Empresa</label>
        <select
          className="form-select"
          value={empresaSeleccionada}
          onChange={(e) => setEmpresaSeleccionada(e.target.value)}
        >
          <option value="">Seleccione una empresa...</option>
          {empresas.map((e) => (
            <option key={e.empresaId} value={e.empresaId}>
              {e.nombreEmpresa}
            </option>
          ))}
        </select>
      </div>

      {/* Selector de Método */}
      <div className="mb-3">
        <label className="form-label">Seleccione el Método de Proyección</label>
        <select
          className="form-select"
          value={metodo}
          onChange={(e) => setMetodo(e.target.value)}
        >
          <option value="">Seleccione un método...</option>
          <option value="minimos-cuadrados">Mínimos Cuadrados</option>
          <option value="incremento-porcentual">Incremento Porcentual</option>
          <option value="incremento-absoluto">Incremento Absoluto</option>
        </select>
      </div>

      {/* Subida de archivo Excel */}
      <div className="mb-4">
        <label className="form-label">Cargar Archivo Excel (opcional)</label>
        <input
          type="file"
          accept=".xlsx, .xls"
          className="form-control"
          onChange={handleArchivoChange}
        />
      </div>

      {/* Entrada manual de datos */}
      <h5 className="mt-4">Ingresar datos manualmente</h5>
      <p className="text-muted">Digite las ventas de los últimos 12 meses:</p>

      <div className="table-responsive mb-4">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              {Array.from({ length: 12 }, (_, i) => (
                <th key={i}>Mes {i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {ventas.map((valor, index) => (
                <td key={index}>
                  <input
                    type="number"
                    min="0"
                    className="form-control text-center"
                    value={valor}
                    onChange={(e) => handleVentaChange(index, e.target.value)}
                    placeholder="0.00"
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <button
        className={buttonStyles.btnPrimary}
        onClick={handleGenerarProyeccion}
      >
        Generar Proyección
      </button>
    </div>
  );
};
