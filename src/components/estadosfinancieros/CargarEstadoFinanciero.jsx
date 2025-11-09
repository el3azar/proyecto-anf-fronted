import React, { useState } from 'react';
import SubMenu from '../shared/SubMenu';
import { estadosFinancierosSubMenuLinks } from '../../config/menuConfig';
import { uploadEstadoFinanciero } from '../../services/estadosfinancieros/estadoFinancieroService';
import { Notifier } from '../../utils/Notifier';
import { Download, FileEarmarkArrowUp, InfoCircleFill } from 'react-bootstrap-icons';

// 1. Importamos tus estilos compartidos y los nuevos
import viewStyles from '../../styles/shared/View.module.css';
import buttonStyles from '../../styles/shared/Button.module.css';
import localStyles from '../../styles/estadosfinancieros/CargarEstadoFinanciero.module.css'; // Nuestros nuevos estilos

const CargarEstadoFinanciero = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            Notifier.warning('Por favor, selecciona un archivo antes de cargar.');
            return;
        }

        setIsLoading(true);
        const toastId = Notifier.loading("Cargando y procesando archivo...");

        try {
            await uploadEstadoFinanciero(selectedFile);
            Notifier.dismiss(toastId);
            Notifier.success('¡Archivo cargado exitosamente!');
            setSelectedFile(null);
            document.getElementById('file-upload').value = null; // Limpia el valor del input
        } catch (error) {
            Notifier.dismiss(toastId);
            const errorMessage = error.response?.data?.message || 'Error al procesar el archivo.';
            Notifier.error(`Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <SubMenu links={estadosFinancierosSubMenuLinks} />
            <div className={viewStyles.viewContainer}>
                <h1 className={viewStyles.viewTitle}>Cargar Nuevo Estado Financiero</h1>
                
                {/* 2. Usamos nuestro nuevo contenedor de formulario */}
                <div className={localStyles.formBox}>
                    <div className={localStyles.instructions}>
                        <InfoCircleFill size={24} className="mb-3" style={{ color: 'var(--color-primary)' }}/>
                        <p>
                            Sube el estado financiero en formato Excel (.xlsx).<br/>
                            Asegúrate de que el archivo cumpla con la estructura requerida.
                        </p>
                        <a href="/templates/plantilla_estado_financiero.xlsx" className={buttonStyles.btnSecondary} download>
                            <Download className="me-2" />
                            Descargar Plantilla
                        </a>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* 3. Implementamos el input de archivo personalizado */}
                        <div className={localStyles.fileInputContainer}>
                            <label htmlFor="file-upload" className={localStyles.fileInputLabel}>
                                <FileEarmarkArrowUp className="me-2" />
                                Seleccionar archivo
                            </label>
                            
                            {/* Este es el input real, pero estará oculto */}
                            <input 
                                type="file" 
                                id="file-upload"
                                className={localStyles.hiddenFileInput}
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                disabled={isLoading}
                            />

                            <span className={localStyles.fileName}>
                                {selectedFile ? selectedFile.name : 'Ningún archivo seleccionado'}
                            </span>
                        </div>

                        {/* 4. El botón de envío ahora está en su propio contenedor */}
                        <div className={localStyles.submitContainer}>
                            <button 
                                type="submit" 
                                className={buttonStyles.btnPrimary}
                                disabled={!selectedFile || isLoading}
                            >
                                {isLoading ? 'Procesando...' : 'Cargar Reporte'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CargarEstadoFinanciero;