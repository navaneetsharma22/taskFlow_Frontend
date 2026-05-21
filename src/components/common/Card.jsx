import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  onClick,
  ...props
}) => {
  const isClickable = typeof onClick === 'function';
  
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverEffect ? { y: -2, scale: 1.005 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`
        glass-panel rounded-xl p-5 overflow-hidden transition-all duration-300
        ${glow ? 'glow-effect' : ''}
        ${isClickable ? 'cursor-pointer hover:shadow-premium-hover' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
