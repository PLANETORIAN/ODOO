import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20';
  
  const variants = {
    primary: 'bg-white/50 border border-gray-200 text-gray-700 hover:bg-white/70 hover:border-gray-300',
    secondary: 'border border-gray-200 text-gray-600 hover:bg-white/30 hover:border-gray-300',
    ghost: 'text-gray-600 hover:bg-white/30',
    minimal: 'text-gray-500 hover:text-gray-700 hover:bg-white/20'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;