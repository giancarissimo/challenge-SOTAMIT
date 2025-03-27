import InputForm from '@/components/InputForm';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useToastStore } from '@/store/toastStore';

type RegisterFormInputs = {
  first_name: string;
  last_name: string;
  dni: string;
  birthdate: Date;
  work_area: string;
  is_developer: string;
  description: string;
  password: string;
};

const Register: React.FC = () => {
  const { addToast } = useToastStore();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Para que se reciba la cookie con el JWT
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result?.status === 'error') {
        addToast(result?.category, "error", (result?.message).charAt(0).toUpperCase() + result?.message.slice(1).toLowerCase());
        setIsLoading(false);
      }

      if (result?.status === 'success') {
        addToast(result?.category, "success", "User registered successfully");
        setIsLoading(false);
      }

    } catch (error: any) {
      addToast("global", "error", error?.message || "Internal server Error")
      setIsLoading(false);
    }
  };

  return (
    <section className="min-w-2xs max-w-3xl w-full flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className='min-w-64 max-w-96 w-full'>
        <h2 className="text-2xl font-bold">Sign up</h2>
        <p className='mb-1'>To try our crud aplication.</p>

        <div className="w-full flex flex-col h-17 mb-0.5">
          <span className="text-red-500 text-sm min-h-5">{errors?.first_name?.message}</span>
          <InputForm type="text" placeholder="First name" {...register('first_name', { required: 'This field is required', minLength: { value: 2, message: 'First Name must be at least 2 characters' } })} />
        </div>

        <div className="w-full flex flex-col h-17 mb-0.5">
          <span className="text-red-500 text-sm min-h-5">{errors?.last_name?.message}</span>
          <InputForm type="test" placeholder="Last name" {...register('last_name', { required: 'This field is required', minLength: { value: 2, message: 'Last Name must be at least 2 characters' } })} />
        </div>

        <div className="w-full flex flex-col h-17 mb-0.5">
          <span className="text-red-500 text-sm min-h-5">{errors?.dni?.message}</span>
          <InputForm type="number" placeholder="DNI" {...register('dni', { required: 'This field is required', valueAsNumber: true, min: { value: 1000000, message: 'DNI must be at least 7 digits' }, max: { value: 999999999, message: 'DNI must be at most 9 digits' } })} />
        </div>

        <div className="w-full flex flex-col h-17 mb-0.5">
          <span className="text-red-500 text-sm min-h-5">{errors?.birthdate?.message}</span>
          <InputForm type="date" placeholder="Birthdate" {...register('birthdate', { required: 'This field is required', valueAsDate: true })} />
        </div>

        <div className="w-full flex flex-col h-17 mb-0.5">
          <span className="text-red-500 text-sm min-h-5">{errors?.work_area?.message}</span>
          <InputForm type="text" placeholder="Work area" {...register('work_area', { required: 'This field is required', minLength: { value: 2, message: 'Work Area must be at least 2 characters' } })} />
        </div>

        <div className="w-full flex flex-col h-17 mb-0.5">
          <span className="text-red-500 text-sm min-h-5">{errors?.description?.message}</span>
          <InputForm type="text" placeholder="Job description" {...register('description', { required: 'This field is required', minLength: { value: 2, message: 'Job Description must be at least 2 characters' }, maxLength: { value: 50, message: 'Job Description must be at least 2 characters' } })} />
        </div>

        <div className="w-full flex flex-col h-17">
          <span className="text-red-500 text-sm min-h-5">{errors?.password?.message}</span>
          <InputForm type="password" placeholder="Password" {...register('password', { required: 'This field is required', minLength: { value: 8, message: 'Password must be at least 8 characters' }, })} />
        </div>

        <div className="w-full flex flex-col h-17">
          <span className="text-red-500 text-sm min-h-5">{errors?.is_developer?.message}</span>
          <InputForm type="checkbox" placeholder="I'm a developer" {...register('is_developer',)} />
        </div>

        <button type="submit" className="cursor-pointer mt-4 w-full bg-green-700 text-white py-3 rounded-2xl flex justify-center items-center" disabled={isLoading}>
          {!isLoading ? 'Sign Up' : (
            <svg className="size-6 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </button>
      </form>
      <p className="mt-4 text-center">Have an account? <Link to="/login" className="text-sky-500 hover:underline">Sign in</Link></p>

      {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
    </section>
  );
};

export default Register;
