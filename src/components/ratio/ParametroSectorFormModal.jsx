import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from 'react-bootstrap';

import buttonStyles from '../../styles/shared/Button.module.css';
import modalStyles from '../../styles/shared/Modal.module.css';

export const ParametroSectorFormModal = ({ 
  show, 
  onClose, 
  onSave, 
  initialData = null,
  // Props para llenar los selectores
  categorias,
  sectores
}) => {
  const isCreateMode = !initialData;
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (show) {
      reset(initialData || {
        nombreRatio: '',
        valorReferencia: '',
        fuente: '',
        anioReferencia: '',
        id_sector: '',
        id_categoria_ratio: ''
      });
    }
  }, [show, initialData, reset]);

  const onSubmit = (data) => {
    onSave(data, initialData?.id);
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" contentClassName={modalStyles.modalContent}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header className={modalStyles.modalHeader}>
          <Modal.Title className={modalStyles.modalTitle}>
            {isCreateMode ? 'Registrar Nuevo Parámetro' : 'Editar Parámetro'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Nombre del Ratio/Parámetro</label>
            <input type="text" className={`form-control ${errors.nombreRatio ? 'is-invalid' : ''}`}
              {...register("nombreRatio", { required: "El nombre es obligatorio" })}
            />
            {errors.nombreRatio && <div className="invalid-feedback">{errors.nombreRatio.message}</div>}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Valor de Referencia</label>
              <input type="number" step="0.01" className={`form-control ${errors.valorReferencia ? 'is-invalid' : ''}`}
                {...register("valorReferencia", { required: "El valor es obligatorio", valueAsNumber: true })}
              />
              {errors.valorReferencia && <div className="invalid-feedback">{errors.valorReferencia.message}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Año de Referencia</label>
              <input type="number" className={`form-control ${errors.anioReferencia ? 'is-invalid' : ''}`}
                {...register("anioReferencia", { required: "El año es obligatorio", valueAsNumber: true, min: { value: 1900, message: 'Año inválido' } })}
              />
              {errors.anioReferencia && <div className="invalid-feedback">{errors.anioReferencia.message}</div>}
            </div>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Fuente</label>
            <input type="text" className="form-control" {...register("fuente")} />
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Categoría de Ratio</label>
              <select className={`form-select ${errors.id_categoria_ratio ? 'is-invalid' : ''}`}
                {...register("id_categoria_ratio", { required: "Debe seleccionar una categoría" })}
              >
                <option value="">Seleccione una categoría...</option>
                {categorias.map(cat => (
                  <option key={cat.idCategoriaRatio} value={cat.idCategoriaRatio}>
                    {cat.nombreTipo}
                  </option>
                ))}
              </select>
              {errors.id_categoria_ratio && <div className="invalid-feedback">{errors.id_categoria_ratio.message}</div>}
            </div>
            
            <div className="col-md-6 mb-3">
              <label className="form-label">Sector</label>
              <select className={`form-select ${errors.id_sector ? 'is-invalid' : ''}`}
                {...register("id_sector", { required: "Debe seleccionar un sector" })}
              >
                <option value="">Seleccione un sector...</option>
                {sectores.map(sec => (
                  <option key={sec.idSector} value={sec.idSector}>
                    {sec.nombreSector}
                  </option>
                ))}
              </select>
              {errors.id_sector && <div className="invalid-feedback">{errors.id_sector.message}</div>}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className={modalStyles.modalFooter}>
          <button type="button" className={buttonStyles.btnSecondary} onClick={onClose}>Cancelar</button>
          <button type="submit" className={buttonStyles.btnPrimary}>
            {isCreateMode ? 'Guardar Parámetro' : 'Guardar Cambios'}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};