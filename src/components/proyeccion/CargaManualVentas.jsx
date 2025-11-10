import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { Notifier } from '../../utils/Notifier';
import { getEmpresas } from '../../services/empresa/empresaService';
import { createVentasManual } from '../../services/proyeccion/ventaHistoricaService';
import buttonStyles from '../../styles/shared/Button.module.css';
import viewStyles from '../../styles/shared/View.module.css';

export const CargaManualVentas = () => {
    const [empresas, setEmpresas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { empresaId: '', ventas: [{ fechaVenta: '', montoVenta: '', observacion: '' }] }
    });
    const { fields, append, remove } = useFieldArray({ control, name: "ventas" });

    useEffect(() => {
        getEmpresas().then(setEmpresas).catch(() => Notifier.error("No se pudieron cargar las empresas."));
    }, []);

    const onSubmit = async (data) => {
        setIsLoading(true);
        const payload = {
            ...data,
            empresaId: parseInt(data.empresaId),
            ventas: data.ventas.map(v => ({...v, montoVenta: parseFloat(v.montoVenta)}))
        };
        const toastId = Notifier.loading("Guardando registros...");
        try {
            await createVentasManual(payload);
            Notifier.dismiss(toastId);
            Notifier.success("Ventas guardadas correctamente.");
            reset();
        } catch (error) {
            Notifier.dismiss(toastId);
            Notifier.error(error.response?.data?.message || "Error al guardar las ventas.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Selector de Empresa */}
            <div className="mb-4">
                <label htmlFor="empresaId" className="form-label fw-bold">Empresa</label>
                <select id="empresaId" className={`form-select ${errors.empresaId ? 'is-invalid' : ''}`} {...register("empresaId", { required: "Debe seleccionar una empresa" })}>
                    <option value="">-- Seleccione una Empresa --</option>
                    {empresas.map(e => <option key={e.empresaId} value={e.empresaId}>{e.nombreEmpresa}</option>)}
                </select>
                {errors.empresaId && <div className="invalid-feedback">{errors.empresaId.message}</div>}
            </div>

            {/* Tabla de Entradas Dinámicas */}
            <div className="table-responsive">
                <table className={viewStyles.table}>
                    <thead>
                        <tr>
                            <th>Fecha de Venta</th>
                            <th>Monto de Venta</th>
                            <th>Observación (Opcional)</th>
                            <th className="text-end">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((field, index) => (
                            <tr key={field.id}>
                                <td><input type="month" className="form-control" {...register(`ventas.${index}.fechaVenta`, { required: true })} /></td>
                                <td><input type="number" step="0.01" className="form-control" {...register(`ventas.${index}.montoVenta`, { required: true, valueAsNumber: true })} /></td>
                                <td><input type="text" className="form-control" {...register(`ventas.${index}.observacion`)} /></td>
                                <td className="text-end">
                                    <button type="button" className={`${buttonStyles.btnIcon} ${buttonStyles.btnIconDelete}`} onClick={() => remove(index)} disabled={fields.length <= 1}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Botones de Acción */}
            <div className="d-flex justify-content-between mt-4">
                <button type="button" className={buttonStyles.btnSecondary} onClick={() => append({ fechaVenta: '', montoVenta: '', observacion: '' })}>
                    <FaPlus className="me-2" /> Añadir Fila
                </button>
                <button type="submit" className={buttonStyles.btnPrimary} disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Guardar Todas las Ventas'}
                </button>
            </div>
        </form>
    );
};