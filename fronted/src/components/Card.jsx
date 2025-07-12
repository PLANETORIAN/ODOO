import React from 'react';

const Card = ({ children, className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'glass-card rounded-xl',
    panel: 'glass-panel rounded-xl',
    minimal: 'bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg shadow-sm'
  };
  
  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;