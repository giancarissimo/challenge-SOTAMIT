import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  placeholder: string;
}

const InputForm = forwardRef<HTMLInputElement, InputProps>(({ name, type, placeholder, ...rest }, ref) => {
  return (
    <>
      {
        type !== 'checkbox' ? (
          <div className="min-w-64 max-w-full w-full relative group bg-white/5 text-white/50 inset-ring inset-ring-white/15 rounded-2xl">
            <input ref={ref} name={name} type={type} placeholder='' autoComplete="off" className="peer w-full px-3 pt-5 pb-1 outline-none no-spin placeholder:text-transparent"  {...rest} />
            <span className="absolute inset-0 mt-3 pointer-events-none text-[1.0625rem] ml-3 transition-all duration-200 group-focus:text-sm group-focus:-mt-1 group-focus:transform-none group-focus-within:text-sm group-focus-within:mt-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:mt-1">
              {placeholder}
            </span>
          </div>
        ) : (
          <div className="min-w-64 max-w-full w-full p-3 relative group bg-white/5 text-white/50 inset-ring inset-ring-white/15 rounded-2xl">
            <input ref={ref} name={name} type={type} placeholder='' autoComplete="off" className="peer w-auto outline-none placeholder:text-transparent"  {...rest} />
            <span className='mx-3'>{placeholder}</span>
          </div>
        )
      }
    </>
  );
});

export default InputForm;
