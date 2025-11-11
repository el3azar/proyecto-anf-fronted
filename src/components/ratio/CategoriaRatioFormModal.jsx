// src/components/ratio/CategoriaRatioFormModal.js

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from 'react-bootstrap';

import buttonStyles from '../../styles/shared/Button.module.css';
import modalStyles from '../../styles/shared/Modal.module.css';

export const CategoriaRatioFormModal = ({ show, onClose, onSave, initialData = null, tiposRatio = [] }) => {
  
  const isCreateMode = !initialData;
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (show) {
      reset(initialData || {
        nombre: '',
        descripcion: '',
        idTipoRatio: '',
      });
    }
  }, [show, initialData, reset]);

  const onSubmit = (data) => {
    onSave(data, initialData?.id);
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" contentClassName={modalStyles.modalContent}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ... El resto del modal no cambia ... */}
        
        <Modal.Body>
          {/* ... Campo Nombre ... */}
          <div className="mb-3">
            <label className="form-label">Nombre de la Categoría</label>
            <input 
              type="text" 
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              {...register("nombre", { required: "El nombre es obligatorio" })}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Tipo de Ratio</label>
            <select
              className={`form-select ${errors.idTipoRatio ? 'is-invalid' : ''}`}
              {...register("idTipoRatio", { required: "Debe seleccionar un tipo de ratio" })}
            >
              <option value="">-- Seleccionar un Tipo --</option>
              {tiposRatio.map(tipo => (
                // --- ¡AQUÍ ESTÁ LA CORRECCIÓN CLAVE! ---
                // Usamos 'id_tipo_ratio' para la key y el value.
                // Usamos 'nombre_ratio' para mostrar el texto.
                <option key={tipo.id_tipo_ratio} value={tipo.id_tipo_ratio}>
                  {tipo.nombre_ratio}
                </option>
              ))}
            </select>
            {errors.idTipoRatio && <div className="invalid-feedback">{errors.idTipoRatio.message}</div>}
          </div>

          {/* ... Campo Descripción ... */}
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea 
              className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
              rows="3"
              {...register("descripcion")}
            ></textarea>
          </div>
        </Modal.Body>

        <Modal.Footer className={modalStyles.modalFooter}>
          <button type="button" className={buttonStyles.btnSecondary} onClick={onClose}>Cancelar</button>
          <button type="submit" className={buttonStyles.btnPrimary}>
            {isCreateMode ? 'Guardar Categoría' : 'Guardar Cambios'}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};