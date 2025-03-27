import { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '@/store/toastStore';

const Profile: React.FC = () => {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(false);


  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        addToast("logout", "error", "Error logging out. Try again later");
      }
      setIsLoading(false);
      setUser(null);
      navigate('/');
    } catch (error: any) {
      setIsLoading(false);
      addToast("global", "error", error?.message || "Internal Server Error");
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user?._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        setIsLoading(false);
        addToast("removeUserById", "error", "Error deleting your account. Try again later");
      };

      addToast("removeUserById", "success", "Your account was succesfully deleted");
      setIsLoading(false);
      setUser(null);
      navigate('/');
    } catch (error: any) {
      setIsLoading(false);
      addToast("global", "error", error?.message || "Internal Server Error");
    }
  }

  return (
    <section className="w-full mx-auto mt-10 rounded flex flex-col justify-center items-start gap-3">
      <h1 className="text-xl font-bold mb-4">My profile</h1>

      <div className='w-full bg-white/5 p-4 rounded-xl'>
        <div className='flex justify-start items-center gap-6'>
          <div className='flex justify-start items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-16">
              <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
            </svg>
            <div className='mx-2'>
              <h2 className='font-semibold'>{user?.first_name} {user?.last_name}</h2>
              <span className='font-semibold text-gray-500'>{user?.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="cursor-pointer min-w-24 bg-[#030712] flex justify-center items-center border-1 border-solid border-white/15 text-red-500 px-5 py-1.5 rounded-xl" disabled={isLoading}>
            {!isLoading ? 'Logout' : (
              <svg className="size-6 animate-spin text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className='w-full bg-white/5 p-4 rounded-xl'>
        <h2 className='text-lg font-bold mb-4'>Personal Information</h2>

        <div className='w-3/4 flex flex-wrap justify-between items-center gap-8'>
          <div>
            <h3 className='font-semibold text-gray-500'>First Name</h3>
            <p className='font-semibold'>{user?.first_name}</p>
          </div>

          <div>
            <h3 className='font-semibold text-gray-500'>Last Name</h3>
            <p className='font-semibold'>{user?.last_name}</p>
          </div>

          <div>
            <h3 className='font-semibold text-gray-500'>Date Of Birth</h3>
            {user?.birthdate && <p className='font-semibold'>{new Date(user?.birthdate).toISOString().split("T")[0]}</p>}
          </div>

          <div>
            <h3 className='font-semibold text-gray-500'>DNI</h3>
            <p className='font-semibold'>{user?.dni}</p>
          </div>

          <div>
            <h3 className='font-semibold text-gray-500'>User Role</h3>
            <p className='font-semibold'>{user?.role}</p>
          </div>

        </div>
      </div>

      <div className='w-full bg-white/5 p-4 rounded-xl'>
        <h2 className='text-lg font-bold mb-4'>Work Information</h2>

        <div className='w-1/2 flex flex-wrap justify-between items-center gap-8'>
          <div>
            <h3 className='font-semibold text-gray-500'>Work Area</h3>
            <p className='font-semibold'>{user?.work_area}</p>
          </div>

          <div>
            <h3 className='font-semibold text-gray-500'>Is developer?</h3>
            <p className='font-semibold'>{user?.is_developer ? 'Yes' : 'No'}</p>
          </div>

          <div>
            <h3 className='font-semibold text-gray-500'>Job Description</h3>
            <p className='font-semibold'>{user?.description}</p>
          </div>
        </div>
      </div>

      <div className='w-full bg-white/5 p-4 rounded-xl border-1 border-solid border-red-500'>
        <h2 className='text-lg font-bold mb-4'>Danger Zone</h2>
        <button onClick={handleDeleteAccount} className="cursor-pointer min-w-40 bg-[#030712] flex justify-center items-center border-1 border-solid border-white/15 text-red-500 px-5 py-1.5 rounded-xl">
          {!isLoading ? 'Delete Account' : (
            <svg className="size-6 animate-spin text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </button>
      </div>

    </section>
  );
};

export default Profile;