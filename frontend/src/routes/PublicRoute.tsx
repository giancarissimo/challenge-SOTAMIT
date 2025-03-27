import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '@store/userStore';

const PublicRoute = () => {
  const { user } = useUserStore();

  // Si el usuario está autenticado, se redirige al home
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Renderiza las rutas públicas normalmente
  return <Outlet />;
};

export default PublicRoute;
