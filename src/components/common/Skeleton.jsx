import React from 'react';

const Skeleton = ({ className = '', variant = 'text', count = 1 }) => {
  const getShapeClass = () => {
    switch (variant) {
      case 'circle':
        return 'rounded-full';
      case 'card':
        return 'rounded-16 h-36';
      case 'table-row':
        return 'rounded-lg h-10 w-full';
      default: // 'text'
        return 'rounded h-3 w-full';
    }
  };

  const skeletons = Array.from({ length: count });

  return (
    <div className="space-y-2.5 w-full select-none">
      {skeletons.map((_, idx) => (
        <div
          key={idx}
          className={`
            animate-pulse bg-slate-200/60 dark:bg-darkBg-850/60
            ${getShapeClass()} 
            ${className}
          `}
        />
      ))}
    </div>
  );
};

export default Skeleton;
