import { useUserStore } from '@/store/userStore';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { user } = useUserStore()

  return (
    <section className="max-w-2xl mx-auto rounded text-center flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold mb-4">Welcome to the SOTAMIT's Challenge</h1>
      {
        !user || user?.role === 'admin' ? (
          <p>A challenge that has been proposed to me to develop a CRUD application that can register, update, delete and view a user.</p>
        ) : (
          <p>Unfortunately, your account don't have the necessary permissions to access to the crud application.</p>
        )
      }
      <Link to={!user ? '/register' : user?.role === 'admin' ? '/users' : '/profile'} className='mt-4 bg-gray-700 text-white px-3 py-1.5 rounded-2xl transition-colors duration-150 hover:bg-gray-600'>{!user || user?.role === 'admin' ? 'Get started' : 'Go to account'}</Link>
    </section>
  );
};

export default Home;
