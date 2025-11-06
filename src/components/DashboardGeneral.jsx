import DashboardCards from "./shared/DashboardCards";
// 1. Importa los nuevos íconos aquí también
import { 
  Building, 
  PeopleFill, 
  Diagram3, 
  FileEarmarkText, 
  JournalCheck, 
  GraphUpArrow 
} from 'react-bootstrap-icons';

const DashboardGeneral = () => {
  // 2. Añade los nuevos objetos al array 'items'.
  //    El 'to' debe coincidir exactamente con el de las rutas y el menú.
  const items = [
    { label: "Gestionar Empresas", icon: Building, to: "/empresas" },
    { label: "Gestionar Sectores", icon: Diagram3, to: "/sectores" },
    { label: "Gestionar Usuarios", icon: PeopleFill, to: "/usuarios" },
    { label: "Catálogo de Cuentas", icon: JournalCheck, to: "/catalogo-cuentas" }, // <-- AÑADIDO
    { label: "Proyecciones", icon: GraphUpArrow, to: "/proyecciones" },           // <-- AÑADIDO
    { label: "Estados Financieros", icon: FileEarmarkText, to: "/estados-financieros" },
  ];

  // El resto del componente no cambia. Sigue delegando todo a DashboardCards.
  return (
    <section>
      <DashboardCards title="Módulos del Sistema" items={items} />
    </section>
  );
};

export default DashboardGeneral;