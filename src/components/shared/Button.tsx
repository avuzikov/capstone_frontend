// src\components\shared\Button.tsx

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}) => {
  const baseStyles = 'font-bold rounded-md transition-colors';

  const variantStyles = {
    primary: 'bg-adp-navy text-white border border-adp-navy-light hover:bg-adp-navy-dark',
    secondary:
      'bg-adp-white text-adp-navy border border-adp-navy-light hover:bg-adp-navy-light hover:text-adp-white',
    destructive: 'bg-adp-red text-adp-white border border-adp-red-light hover:bg-adp-red-light',
  };

  const sizeStyles = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };

  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={buttonStyles} {...props}>
      {children}
    </button>
  );
};

export default Button;
