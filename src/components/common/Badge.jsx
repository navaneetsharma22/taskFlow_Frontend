import React from 'react';

const Badge = ({
  children,
  variant = 'brand', // 'brand' | 'success' | 'warning' | 'error' | 'info' | 'gray'
  className = '',
  size = 'md', // 'sm' | 'md'
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';
  
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
  };

  const variants = {
    brand: 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-100/50 dark:border-brand-900/30',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/20',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/20',
    error: 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/20',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/20',
    gray: 'bg-slate-100 text-slate-600 dark:bg-darkBg-800 dark:text-slate-400 border border-slate-200/50 dark:border-darkBg-700/30',
  };

  return (
    <span className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
