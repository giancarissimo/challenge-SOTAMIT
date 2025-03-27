import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@store/userStore';
import { useToastStore } from '@/store/toastStore';
import InputForm from '@components/InputForm';

type LoginFormInputs = {
  dni: number;
  password: string;
};

const Login: React.FC = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const { addToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        // Asigna un error manual a ambos campos
        setIsLoading(false)
        setError('dni', { type: 'manual', message: result.message });
        setError('password', { type: 'manual', message: result.message });
        return;
      }

      setIsLoading(false)
      navigate('/profile');
      const result = await response.json();

      const userToZustand = {
        _id: result.data.user._id,
        first_name: result.data.user.first_name,
        last_name: result.data.user.last_name,
        birthdate: result.data.user.birthdate,
        dni: result.data.user.dni,
        work_area: result.data.user.work_area,
        description: result.data.user.description,
        is_developer: result.data.user.is_developer,
        role: result.data.user.role,
      };

      setUser(userToZustand); // Almacenamos el usuario en zustand
    } catch (error: any) {
      addToast("global", "error", error?.message || "Internal server Error")
      setIsLoading(false);
    }
  };

  return (
    <section className="min-w-2xs max-w-3xl w-full flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className='min-w-64 max-w-96 w-full'>
        <h2 className="text-2xl font-bold">Sign in</h2>
        <p className='mb-2'>To try our crud aplication.</p>
        <div className="w-full flex flex-col h-18 mb-0.5">
          <span className="text-red-500 text-sm min-h-5">{errors?.dni?.message}</span>
          <InputForm type="number" placeholder="DNI" {...register('dni', { required: 'This field is required', valueAsNumber: true })} />
        </div>
        <div className="w-full flex flex-col h-18 mb-4">
          <span className="text-red-500 text-sm min-h-5">{errors?.password?.message}</span>
          <InputForm type="password" placeholder="Password" {...register('password', { required: 'This field is required' })} />
        </div>
        <button type="submit" className="cursor-pointer w-full bg-blue-500 text-white py-3 rounded-2xl flex justify-center items-center" disabled={isLoading}>
        {!isLoading ? 'Sign in' : (
            <svg className="size-6 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account? <a href="/register" className="text-sky-500 hover:underline">Create yours now</a>
      </p>
    </section>
  );
};

export default Login;
