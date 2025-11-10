import React, { useState } from 'react';
import { uploadVentasExcel } from '../../services/proyeccion/ventaHistoricaService';
import { Notifier } from '../../utils/Notifier';
import { Download, FileEarmarkArrowUp } from 'react-bootstrap-icons';
import buttonStyles from '../../styles/shared/Button.module.css';
import localStyles from '../../styles/estadosfinancieros/CargarEstadoFinanciero.module.css'; // Reutilizamos estilos!

export const CargaMasivaVentas = () => {
    // Lógica casi idéntica a la carga de estados financieros
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) return Notifier.warning('Selecciona un archivo.');
        
        setIsLoading(true);
        const toastId = Notifier.loading("Procesando archivo...");
        try {
            await uploadVentasExcel(selectedFile);
            Notifier.dismiss(toastId);
            Notifier.success('Ventas cargadas exitosamente desde Excel.');
            setSelectedFile(null);
            e.target.reset();
        } catch (error) {
            Notifier.dismiss(toastId);
            Notifier.error(error.response?.data?.message || "Error al procesar el archivo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={localStyles.formBox}>
            <div className={localStyles.instructions}>
                <p>Sube las ventas históricas usando la plantilla de Excel.</p>
                <a href="/templates/plantilla_ventas.xlsx" className={buttonStyles.btnSecondary} download>
                    <Download className="me-2" /> Descargar Plantilla
                </a>
            </div>
            <form onSubmit={handleSubmit}>
                <div className={localStyles.fileInputContainer}>
                    <label htmlFor="file-upload-ventas" className={localStyles.fileInputLabel}>
                        <FileEarmarkArrowUp className="me-2" /> Seleccionar archivo
                    </label>
                    <input id="file-upload-ventas" type="file" accept=".xlsx" className={localStyles.hiddenFileInput} onChange={handleFileChange} disabled={isLoading} />
                    <span className={localStyles.fileName}>{selectedFile ? selectedFile.name : 'Ningún archivo seleccionado'}</span>
                </div>
                <div className={localStyles.submitContainer}>
                    <button type="submit" className={buttonStyles.btnPrimary} disabled={!selectedFile || isLoading}>
                        {isLoading ? 'Cargando...' : 'Cargar desde Excel'}
                    </button>
                </div>
            </form>
        </div>
    );
};