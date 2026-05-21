import React from 'react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  icon,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 select-none tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          id={id}
          placeholder={placeholder}
          className={`
            w-full bg-white dark:bg-darkBg-900 border text-sm rounded-lg py-2 px-3 transition-all duration-200 outline-none
            ${icon ? 'pl-9' : ''}
            ${error 
              ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30' 
              : 'border-slate-200 focus:border-brand-500 dark:border-darkBg-800 dark:focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
            }
            text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="text-[11px] text-red-500 font-medium mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
