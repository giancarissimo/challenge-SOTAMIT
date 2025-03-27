import { Link, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user } = useUserStore();

  // Si el usuario no está autenticado
  if (!user) {
    return (
      <section className="w-full flex flex-col justify-center items-center text-center gap-2">
        <h1 className='text-5xl font-bold'>Unauthorized</h1>
        <p>You need to sign in first</p>
        <Link to='/login'>
          <button className='cursor-pointer text-blue-500 hover:underline'>Go there</button>
        </Link>
      </section>
    );
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole && user.role !== requiredRole) {
    return (
      <section className="w-full flex flex-col justify-center items-center text-center gap-2">
        <h1 className='text-5xl font-bold'>Access Denied</h1>
        <p>You don't have permissions to access to this page</p>
        <Link to='/'>
          <button className='cursor-pointer text-sky-500 hover:underline'>Go back</button>
        </Link>
      </section>
    );
  }

  // Si se pasan children, se renderizan; de lo contrario, se renderiza un <Outlet /> para rutas anidadas
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
