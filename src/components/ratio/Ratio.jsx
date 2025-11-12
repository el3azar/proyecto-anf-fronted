import React, { useState, useEffect, useCallback } from 'react';
import SubMenu from '../shared/SubMenu';
import { sectoresSubMenuLinks } from '../../config/menuConfig';
import Tabla from '../shared/Tabla';
import { Notifier } from '../../utils/Notifier';

// --- Servicios a utilizar (con la nueva función importada) ---
import { getRatios, createRatio, updateRatio, deleteRatio, calculateLiquidezRatio, calculateCapitalTrabajoRatio, calculateEfectivoRatio, calculateRotacionCuentasPorCobrarRatio, calculatePeriodoCobranzaRatio, calculateRotacionActivosTotalesRatio, calculateRotacionActivosFijosRatio, calculateMargenBrutoRatio, calculateMargenOperativoRatio } from '../../services/ratio/ratioService';

// --- Componentes y otros servicios ---
import { RatioFormModal } from './RatioFormModal';
// ✅ 1. IMPORTA EL NUEVO MODAL DE DETALLES
import { RatioDetailsModal } from './RatioDetailsModal'; 
import { getCategoriasRatio } from '../../services/ratio/CategoriaRatio';
import { getParametros } from '../../services/ratio/parametroSector';
import { getEmpresas } from '../../services/empresa/empresaService';

export const Ratio = () => {
  // --- Estados para los datos ---
  const [ratios, setRatios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [parametros, setParametros] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  
  // --- Estados para el filtrado ---
  const [filtroEmpresa, setFiltroEmpresa] = useState('');

  // --- Estados para la UI ---
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Para el formulario
  const [editingRatio, setEditingRatio] = useState(null);

  // ✅ 2. AÑADE NUEVOS ESTADOS PARA EL MODAL DE DETALLES
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRatioDetails, setSelectedRatioDetails] = useState(null);

  // --- Carga de datos inicial y por filtro ---
  const fetchData = useCallback(async (nombreEmpresa) => {
    try {
      setLoading(true);
      const ratiosData = await getRatios(nombreEmpresa);
      setRatios(ratiosData);
    } catch (error) {
      Notifier.error('No se pudieron cargar los ratios.');
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Carga de datos para los menús desplegables (solo una vez) ---
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [categoriasData, parametrosData, empresasData] = await Promise.all([
          getCategoriasRatio(),
          getParametros(),
          getEmpresas(),
        ]);
        setCategorias(categoriasData);
        setParametros(parametrosData);
        setEmpresas(empresasData);
      } catch (error) {
        Notifier.error('No se pudieron cargar los datos para los formularios.');
      }
    };
    fetchDropdownData();
  }, []);

  // --- useEffect para aplicar el filtro con debounce ---
  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchData(filtroEmpresa);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [filtroEmpresa, fetchData]);


  // --- Definición de las columnas para la tabla (versión original) ---
  const columnas = [
    { 
      Header: 'ID', 
      accessor: 'id_ratio' 
    },
    {
      Header: 'EMPRESA',
      accessor: row => row.empresa ? row.empresa.nombre_empresa : 'N/A',
    },
    {
      Header: 'CATEGORÍA',
      accessor: row => row.categoriaRatio ? row.categoriaRatio.nombre_categoria : 'N/A',
    },
    {
      Header: 'PARÁMETRO',
      accessor: row => row.parametroSector ? row.parametroSector.nombreRatio : 'N/A',
    },
    { 
      Header: 'AÑO', 
      accessor: 'anio_ratio' 
    },
    { 
      Header: 'PERÍODO', 
      accessor: 'periodo_ratio' 
    }
  ];

  // --- Manejadores de eventos del Modal de Formulario ---
  const handleNuevoRatio = () => {
    setEditingRatio(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRatio(null);
  };

  const handleEditar = (ratio) => {
    setEditingRatio({
      id_ratio: ratio.id_ratio,
      empresa_id: ratio.empresa.empresa_id,
      id_categoria_ratio: ratio.categoriaRatio.id_categoria_ratio,
      id_parametro_sector: ratio.parametroSector.id_parametro_sector,
      anio_ratio: ratio.anio_ratio,
      periodo_ratio: ratio.periodo_ratio,
    });
    setIsModalOpen(true);
  };
  
  // ✅ 3. LÓGICA DE VER ACTUALIZADA PARA ABRIR EL MODAL
  const handleVer = (ratio) => {
    setSelectedRatioDetails(ratio); // Guarda los datos del ratio a mostrar
    setIsDetailsModalOpen(true);    // Abre el modal de detalles
  };

  // --- Lógica de Calcular ---
  const handleCalcular = async (ratio) => {
    const categoriaNombre = ratio.categoriaRatio?.nombre_categoria;
    const ratioId = ratio.id_ratio;

    if (!categoriaNombre) {
      Notifier.error("La categoría del ratio no está definida. No se puede calcular.");
      return;
    }

    // El "mapa" que conecta el nombre de la categoría con la función de servicio.
    // ¡Asegúrate de que los nombres coincidan con los de tu base de datos!
    const calculoPorCategoria = {
      'Razón de circulante o liquidez corriente': calculateLiquidezRatio,
      'Razón de capital de trabajo': calculateCapitalTrabajoRatio,
      'Razón de efectivo': calculateEfectivoRatio,
      'Razón de rotación de cuentas por cobrar': calculateRotacionCuentasPorCobrarRatio,
      // --- NUEVOS RATIOS AÑADIDOS AL MAPA ---
      'Período Medio de Cobranza': calculatePeriodoCobranzaRatio,
      'Índice de rotación de activos totales': calculateRotacionActivosTotalesRatio,
      'Índice de rotación de activos fijos': calculateRotacionActivosFijosRatio,
      'Índice de margen bruto': calculateMargenBrutoRatio,
      'Índice de margen operativo': calculateMargenOperativoRatio,
    };

    const funcionDeCalculo = calculoPorCategoria[categoriaNombre];

    if (!funcionDeCalculo) {
      Notifier.warning(`La categoría "${categoriaNombre}" aún no tiene una función de cálculo implementada.`);
      return;
    }

    const loadingToastId = Notifier.loading(`Calculando ratio ID: ${ratioId} (${categoriaNombre})...`);

    try {
      await funcionDeCalculo(ratioId);
      Notifier.dismiss(loadingToastId);
      Notifier.success(`¡Ratio ID: ${ratioId} calculado exitosamente!`);
      fetchData(filtroEmpresa);
    } catch (error) {
      Notifier.dismiss(loadingToastId);
      const errorMessage = error.response?.data?.message || `No se pudo calcular el ratio de ${categoriaNombre}.`;
      Notifier.error(errorMessage);
      console.error(`Error en handleCalcular para la categoría ${categoriaNombre}:`, error);
    }
  };


  // --- Lógica de Guardar ---
  const handleSave = async (formData, id) => {
    const isEditing = !!id;
    const payload = {
      anio_ratio: parseInt(formData.anio_ratio, 10),
      periodo_ratio: formData.periodo_ratio,
      empresa_id: parseInt(formData.empresa_id, 10),
      id_categoria_ratio: parseInt(formData.id_categoria_ratio, 10),
      id_parametro_sector: parseInt(formData.id_parametro_sector, 10),
    };

    const loadingToastId = Notifier.loading(isEditing ? "Actualizando ratio..." : "Guardando nuevo ratio...");

    try {
      if (isEditing) {
        await updateRatio(id, payload);
      } else {
        await createRatio(payload);
      }
      Notifier.dismiss(loadingToastId);
      Notifier.success(`¡Ratio ${isEditing ? 'actualizado' : 'creado'} exitosamente!`);
      
      handleCloseModal();
      fetchData(filtroEmpresa);
    } catch (error) {
      Notifier.dismiss(loadingToastId);
      Notifier.error(`Error al ${isEditing ? 'actualizar' : 'crear'} el ratio.`);
      console.error("Error en handleSave:", error);
    }
  };
  
  // --- Lógica de Eliminar ---
  const handleEliminar = async (ratio) => {
    const result = await Notifier.confirm({
      title: `¿Estás seguro de eliminar el ratio?`,
      text: `Se eliminará el registro del año ${ratio.anio_ratio} para la empresa ${ratio.empresa?.nombre_empresa}. Esta acción no se puede deshacer.`,
    });

    if (result.isConfirmed) {
      const loadingToastId = Notifier.loading("Eliminando...");
      try {
        await deleteRatio(ratio.id_ratio);
        Notifier.dismiss(loadingToastId);
        Notifier.success("Ratio eliminado correctamente.");
        fetchData(filtroEmpresa);
      } catch (error) {
        Notifier.dismiss(loadingToastId);
        Notifier.error("No se pudo eliminar el ratio. Inténtalo de nuevo.");
        console.error("Error en handleEliminar:", error);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <SubMenu links={sectoresSubMenuLinks} />

      <div style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
          <label htmlFor="filtro-empresa" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Filtrar por Nombre de Empresa
          </label>
          <input
            id="filtro-empresa"
            type="text"
            placeholder="Ej: DIANA"
            value={filtroEmpresa}
            onChange={(e) => setFiltroEmpresa(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              fontSize: '1rem', 
              borderRadius: '4px', 
              border: '1px solid #ccc' 
            }}
          />
        </div>

        {loading ? (
          <p>Cargando ratios...</p>
        ) : (
          <Tabla
            titulo="Gestión de Ratios"
            textoBotonNuevo="Nuevo Ratio"
            columnas={columnas}
            datos={ratios}
            onNuevoClick={handleNuevoRatio}
            enEditar={handleEditar}
            enEliminar={handleEliminar}
            enVer={handleVer}
            enCalcular={handleCalcular}
          />
        )}
      </div>

      <RatioFormModal
        show={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editingRatio}
        categorias={categorias}
        parametros={parametros}
        empresas={empresas}
      />

      {/* ✅ 4. RENDERIZA EL NUEVO MODAL DE DETALLES */}
      <RatioDetailsModal
        show={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        ratio={selectedRatioDetails}
      />
    </div>
  );
};