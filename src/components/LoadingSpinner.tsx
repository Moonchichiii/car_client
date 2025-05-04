import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', className = '' }) => {
  const sizeMap = {
    small: 'h-8 w-8 border-2',
    medium: 'h-12 w-12 border-3',
    large: 'h-16 w-16 border-4',
  };

  const spinnerSize = sizeMap[size];

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50 ${className}`}
    >
      <div className="relative">
        <div className={`animate-spin rounded-full ${spinnerSize} border-gray-200`}></div>
        <div
          className={`animate-spin rounded-full ${spinnerSize} border-t-blue-500 absolute top-0 left-0`}
        ></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
