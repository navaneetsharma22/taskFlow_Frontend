import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  className = '',
  icon = null,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-darkBg-950 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-premium active:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-700',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:bg-slate-300 dark:bg-darkBg-800 dark:hover:bg-darkBg-700 dark:text-slate-200 dark:active:bg-darkBg-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm active:bg-red-800 dark:bg-red-600/90 dark:hover:bg-red-700',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 active:bg-slate-200 dark:hover:bg-darkBg-800/80 dark:text-slate-400 dark:active:bg-darkBg-700',
    glass: 'bg-white/10 hover:bg-white/20 text-slate-800 border border-white/20 backdrop-blur-sm dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-100 dark:border-white/5'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  return (
    <motion.button
      whileTap={disabled || isLoading ? {} : { scale: 0.98 }}
      whileHover={disabled || isLoading ? {} : { scale: 1.01 }}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
