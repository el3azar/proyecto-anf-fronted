import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from 'react-bootstrap';

// Importa los mismos estilos que tu otro modal para mantener la consistencia
import buttonStyles from '../../styles/shared/Button.module.css';
import modalStyles from '../../styles/shared/Modal.module.css';

export const TipoRatioFormModal = ({ show, onClose, onSave, initialData = null }) => {
  // Determina si estamos en modo 'Crear' o 'Editar'
  const isCreateMode = !initialData;

  // Se mantiene la misma lógica de react-hook-form
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // useEffect para resetear el formulario cuando se abre/cierra o cambian los datos
  useEffect(() => {
    if (show) {
      // Si hay datos iniciales (modo edición), los carga. Si no, carga el objeto vacío.
      reset(initialData || {
        codigo: '',
        nombre: '',
        descripcion: '',
        unidad: ''
      });
    }
  }, [show, initialData, reset]);

  // La función que se ejecuta al enviar el formulario
  const onSubmit = (data) => {
    // Llama a la función onSave del componente padre, pasando los datos y el ID (si existe)
    // Asumimos que el ID del tipo de ratio se llama 'id' como en tus datos de ejemplo
    onSave(data, initialData?.id);
  };

  return (
    // La estructura del Modal es idéntica a la de tu ejemplo
    <Modal show={show} onHide={onClose} centered size="lg" contentClassName={modalStyles.modalContent}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header className={modalStyles.modalHeader}>
          <Modal.Title className={modalStyles.modalTitle}>
            {isCreateMode ? 'Registrar Nuevo Tipo de Ratio' : 'Editar Tipo de Ratio'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* --- CAMPO CÓDIGO --- */}
          <div className="mb-3">
            <label className="form-label">Código</label>
            <input 
              type="text" 
              className={`form-control ${errors.codigo ? 'is-invalid' : ''}`}
              maxLength="5" // Límite de ejemplo
              {...register("codigo", { 
                required: "El código es obligatorio",
                maxLength: { value: 5, message: "El código no puede tener más de 5 caracteres" }
              })}
            />
            {errors.codigo && <div className="invalid-feedback">{errors.codigo.message}</div>}
          </div>

          {/* --- CAMPO NOMBRE --- */}
          <div className="mb-3">
            <label className="form-label">Nombre del Tipo de Ratio</label>
            <input 
              type="text" 
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              {...register("nombre", { required: "El nombre es obligatorio" })}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
          </div>

          {/* --- CAMPO DESCRIPCIÓN (usando textarea) --- */}
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea 
              className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
              rows="3"
              {...register("descripcion")} // Este campo puede ser opcional
            ></textarea>
          </div>

          {/* --- CAMPO UNIDAD --- */}
          <div className="mb-3">
            <label className="form-label">Unidad de Medida</label>
            <input 
              type="text" 
              className={`form-control ${errors.unidad ? 'is-invalid' : ''}`}
              {...register("unidad", { required: "La unidad es obligatoria" })}
            />
            {errors.unidad && <div className="invalid-feedback">{errors.unidad.message}</div>}
          </div>
        </Modal.Body>

        <Modal.Footer className={modalStyles.modalFooter}>
          <button type="button" className={buttonStyles.btnSecondary} onClick={onClose}>Cancelar</button>
          <button type="submit" className={buttonStyles.btnPrimary}>
            {isCreateMode ? 'Guardar Tipo' : 'Guardar Cambios'}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};