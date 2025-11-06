import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  
  // Cuando el login sea real, esta variable funcionará automáticamente
  if (!isAuthenticated) {
    // Redirige al usuario a la página de inicio (login)
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, renderiza el contenido de la ruta anidada
  return <Outlet />;
};

export default ProtectedRoute;