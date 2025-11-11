// src/components/ratio/RatioFormModal.js

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from 'react-bootstrap';

import buttonStyles from '../../styles/shared/Button.module.css';
import modalStyles from '../../styles/shared/Modal.module.css';

export const RatioFormModal = ({ show, onClose, onSave, initialData = null, categorias = [], parametros = [], empresas = [] }) => {
  const isCreateMode = !initialData;
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (show) {
      reset(initialData || {
        empresa_id: '',
        id_categoria_ratio: '',
        id_parametro_sector: '',
        anio_ratio: '',
        periodo_ratio: '',
      });
    }
  }, [show, initialData, reset]);

  const onSubmit = (data) => {
    onSave(data, initialData?.id_ratio);
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" contentClassName={modalStyles.modalContent}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ... (Header del Modal sin cambios) ... */}
        <Modal.Header className={modalStyles.modalHeader}>
          <Modal.Title className={modalStyles.modalTitle}>
            {isCreateMode ? 'Registrar Nuevo Ratio' : 'Editar Ratio'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* --- SELECTOR DE EMPRESA (CORREGIDO) --- */}
          <div className="mb-3">
            <label className="form-label">Empresa</label>
            <select
              className={`form-select ${errors.empresa_id ? 'is-invalid' : ''}`}
              {...register("empresa_id", { required: "Debe seleccionar una empresa" })}
            >
              <option value="">-- Seleccionar Empresa --</option>
              {/* === LA CORRECCIÓN ESTÁ AQUÍ === */}
              {/* Usamos 'empresaId' y 'nombreEmpresa' para coincidir con el JSON */}
              {empresas.map(emp => (
                <option key={emp.empresaId} value={emp.empresaId}>
                  {emp.nombreEmpresa}
                </option>
              ))}
            </select>
            {errors.empresa_id && <div className="invalid-feedback">{errors.empresa_id.message}</div>}
          </div>

          {/* --- OTROS SELECTORES (REVISA SUS JSON TAMBIÉN) --- */}
          {/* Asegúrate de que los nombres de propiedad aquí coincidan con sus respectivas APIs */}
          
          {/* SELECTOR DE CATEGORÍA */}
          <div className="mb-3">
            <label className="form-label">Categoría</label>
            <select
              className={`form-select ${errors.id_categoria_ratio ? 'is-invalid' : ''}`}
              {...register("id_categoria_ratio", { required: "Debe seleccionar una categoría" })}
            >
              <option value="">-- Seleccionar Categoría --</option>
              {categorias.map(cat => (
                <option key={cat.idCategoriaRatio} value={cat.idCategoriaRatio}>
                  {cat.nombreTipo}
                </option>
              ))}
            </select>
            {errors.id_categoria_ratio && <div className="invalid-feedback">{errors.id_categoria_ratio.message}</div>}
          </div>

          {/* ... (El resto del formulario sin cambios) ... */}
          <div className="mb-3">
            <label className="form-label">Parámetro</label>
            <select
              className={`form-select ${errors.id_parametro_sector ? 'is-invalid' : ''}`}
              {...register("id_parametro_sector", { required: "Debe seleccionar un parámetro" })}
            >
              <option value="">-- Seleccionar Parámetro --</option>
              {parametros.map(param => (
                <option key={param.idParametroSector} value={param.idParametroSector}>
                  {param.nombreRatio}
                </option>
              ))}
            </select>
            {errors.id_parametro_sector && <div className="invalid-feedback">{errors.id_parametro_sector.message}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Año</label>
            <input 
              type="number" 
              placeholder="Ej: 2025"
              className={`form-control ${errors.anio_ratio ? 'is-invalid' : ''}`}
              {...register("anio_ratio", { required: "El año es obligatorio" })}
            />
            {errors.anio_ratio && <div className="invalid-feedback">{errors.anio_ratio.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Período</label>
            <input 
              type="text" 
              placeholder="Ej: Anual, Trimestral"
              className={`form-control ${errors.periodo_ratio ? 'is-invalid' : ''}`}
              {...register("periodo_ratio", { required: "El período es obligatorio" })}
            />
            {errors.periodo_ratio && <div className="invalid-feedback">{errors.periodo_ratio.message}</div>}
          </div>

        </Modal.Body>

        {/* ... (Footer del Modal sin cambios) ... */}
        <Modal.Footer className={modalStyles.modalFooter}>
          <button type="button" className={buttonStyles.btnSecondary} onClick={onClose}>Cancelar</button>
          <button type="submit" className={buttonStyles.btnPrimary}>
            {isCreateMode ? 'Guardar Ratio' : 'Guardar Cambios'}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};