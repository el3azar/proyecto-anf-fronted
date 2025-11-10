import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from 'react-bootstrap';

import buttonStyles from '../../styles/shared/Button.module.css';
import modalStyles from '../../styles/shared/Modal.module.css';

export const CategoriaRatioFormModal = ({ show, onClose, onSave, initialData = null }) => {
  const isCreateMode = !initialData;
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (show) {
      reset(initialData || {
        nombre: '',
        descripcion: '',
      });
    }
  }, [show, initialData, reset]);

  const onSubmit = (data) => {
    // Asumimos que el ID de la categoría se llama 'id'
    onSave(data, initialData?.id);
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" contentClassName={modalStyles.modalContent}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header className={modalStyles.modalHeader}>
          <Modal.Title className={modalStyles.modalTitle}>
            {isCreateMode ? 'Registrar Nueva Categoría' : 'Editar Categoría'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* --- CAMPO NOMBRE --- */}
          <div className="mb-3">
            <label className="form-label">Nombre de la Categoría</label>
            <input 
              type="text" 
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              {...register("nombre", { required: "El nombre es obligatorio" })}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
          </div>

          {/* --- CAMPO DESCRIPCIÓN --- */}
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea 
              className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
              rows="3"
              {...register("descripcion")} // Opcional
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