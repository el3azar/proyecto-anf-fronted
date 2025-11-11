import DashboardCards from "./shared/DashboardCards";
import {useAuth } from "../context/AuthContext";
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
  const { user } = useAuth (); // Hook **dentro del componente**

  const accesos = user?.accesos || []; // obtenemos los accesos del usuario
  
  const items = [
    { id: 1, label: "Gestionar Empresas", icon: Building, to: "/empresas" },
    { id: 2, label: "Gestionar Ratios", icon: Diagram3, to: "/ratios" },
    { id: 3, label: "Gestionar Usuarios", icon: PeopleFill, to: "/usuarios" },
    { id: 4, label: "Catálogo de Cuentas", icon: JournalCheck, to: "/catalogo-cuentas" }, // <-- AÑADIDO
    { id: 5, label: "Proyecciones", icon: GraphUpArrow, to: "/proyecciones" },           // <-- AÑADIDO
    { id: 6, label: "Estados Financieros", icon: FileEarmarkText, to: "/estados-financieros" },
  ];

  // Filtramos los items según los accesos del usuario
  const filteredItems = items.filter(item => accesos.includes(item.id));

  // El resto del componente no cambia. Sigue delegando todo a DashboardCards.
  return (
    <section>
      <DashboardCards title="Módulos del Sistema" items={filteredItems} />
    </section>
  );
};

export default DashboardGeneral;