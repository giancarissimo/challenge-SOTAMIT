import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '@pages/Login';
import Register from '@pages/Register';
import Home from '@pages/Home';
import Users from '@pages/Users';
import ProtectedRoute from './routes/ProtectedRoute';
import Profile from './pages/Profile';
import { useUserStore } from '@store/userStore';
import ErrorPage from './pages/ErrorPage';
import PublicRoute from './routes/PublicRoute';
import Layout from './layout/Layout';

function App() {
  const { setUser } = useUserStore();

  useEffect(() => {
    // Intenta obtener el perfil del usuario al iniciar la app
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          setUser(null)
        }
        if (response.ok) {
          const result = await response.json();

          const userToZunstand = {
            _id: result.data.user._id,
            first_name: result.data.user.first_name,
            last_name: result.data.user.last_name,
            birthdate: result.data.user.birthdate,
            dni: result.data.user.dni,
            work_area: result.data.user.work_area,
            description: result.data.user.description,
            is_developer: result.data.user.is_developer,
            role: result.data.user.role,
          }

          setUser(userToZunstand); // Le pasamos los datos del user a Zustand
        }
      } catch (error) {
        setUser(null)
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          {/* Si el usuario está loggeado, no deberia acceder a login y register */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Rutas protegidas: el usuario debe estar autenticado */}
          <Route element={<ProtectedRoute />}>
            {/* Si no está loggeado, no puede acceder a la vista de perfil */}
            <Route path="/profile" element={<Profile />} />

            {/* Ruta exclusiva para admin: si no es admin se mostrará un error de acceso */}
            <Route path="/users" element={<ProtectedRoute requiredRole="admin"><Users /></ProtectedRoute>} />
          </Route>
          {/* Redirigir cualquier ruta no definida */}
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
