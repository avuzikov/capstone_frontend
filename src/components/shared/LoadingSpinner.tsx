import React from 'react';

interface LoadingSpinnerProps {
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

const sizeClasses = {
  small: 'h-8 w-8 border-4 border-t-4',
  medium: 'h-12 w-12 border-4 border-t-4',
  large: 'h-16 w-16 border-4 border-t-4',
};

const LoadingSpinner = ({ size = 'medium' }: LoadingSpinnerProps) => {
  return (
    <div
      className={`border-t-adp-red ${sizeClasses[size]} border-gray-200 rounded-full animate-spin`}
    ></div>
  );
};

export default LoadingSpinner;
