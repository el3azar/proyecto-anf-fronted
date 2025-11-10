import React, { useState } from 'react';
import SubMenu from '../shared/SubMenu';
import { proyeccionesSubMenuLinks } from '../../config/menuConfig';
import viewStyles from '../../styles/shared/View.module.css';
import tabStyles from '../../styles/proyeccion/Proyecciones.module.css';
import { CargaMasivaVentas } from './CargaMasivaVentas';
import { CargaManualVentas } from './CargaManualVentas';

// --- CAMBIO DE NOMBRE ---
export const Proyecciones = () => {
  const [activeTab, setActiveTab] = useState('masiva');

return (
    <>
      <SubMenu links={proyeccionesSubMenuLinks} />
      <div className={viewStyles.viewContainer}>
        <div className={viewStyles.viewHeader}>
          <h1 className={viewStyles.viewTitle}>Cargar Ventas Históricas</h1>
        </div>

        {/* --- SECCIÓN MODIFICADA --- */}
        {/* 2. Reemplazamos las clases de Bootstrap con las nuestras */}
        <div className={tabStyles.tabContainer}>
            <button 
                className={`${tabStyles.tabButton} ${activeTab === 'masiva' ? tabStyles.active : ''}`} 
                onClick={() => setActiveTab('masiva')}
            >
              Carga Masiva (Excel)
            </button>
            <button 
                className={`${tabStyles.tabButton} ${activeTab === 'manual' ? tabStyles.active : ''}`} 
                onClick={() => setActiveTab('manual')}
            >
              Carga Manual
            </button>
        </div>
        {/* --- FIN DE LA SECCIÓN MODIFICADA --- */}

        {/* Contenido de la pestaña activa (esto no cambia) */}
        <div>
          {activeTab === 'masiva' && <CargaMasivaVentas />}
          {activeTab === 'manual' && <CargaManualVentas />}
        </div>
      </div>
    </>
  );
};