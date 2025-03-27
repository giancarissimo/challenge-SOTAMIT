import { useEffect, useState } from 'react';

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  work_area: string;
  description: string;
  dni: string;
  role: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || 'Error al obtener usuarios');
        }
        const result = await response.json();
        setUsers(result.data.users);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return (
      <section className="w-full text-center">
        {error}
      </section>
    );
  };

  return (
    <section className="w-full mx-auto mt-10 p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">Users registered</h2>
      <table className="min-w-full">
        <thead className='text-center'>
          <tr className='bg-white/5 border-separate'>
            <th className="px-4 py-3 rounded-tl-2xl">DNI</th>
            <th className='px-4 py-3'>Name</th>
            <th className='px-4 py-3'>Last Name</th>
            <th className="px-4 py-3">Date of Birth</th>
            <th className="px-4 py-3">Work area</th>
            <th className="px-4 py-3">Job Description</th>
            <th className='px-4 py-3 rounded-tr-2xl'>Role</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4">{user.dni}</td>
              <td className="px-6 py-4">{user.first_name}</td>
              <td className="px-6 py-4">{user.last_name}</td>
              <td className="px-6 py-4">{new Date(user.birthdate).toISOString().split("T")[0]}</td>
              <td className="px-6 py-4">{user.work_area}</td>
              <td className="px-6 py-4">{user.description}</td>
              <td className="px-6 py-4">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Users;
