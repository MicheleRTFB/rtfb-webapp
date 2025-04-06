import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/rtfb-logo.png" 
        alt="Run To Feel Better" 
        className="w-full h-auto"
      />
    </div>
  );
}; 