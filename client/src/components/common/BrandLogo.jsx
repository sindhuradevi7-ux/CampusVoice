import React from 'react';
import logoImg from '../../assets/logo.png';

export const BrandLogo = ({ className = "w-10 h-10", showGlow = false, alt = "Brand Mark Logo" }) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {showGlow && (
        <div className="absolute inset-0 bg-gradient-to-tr from-burgundy-700/20 to-peach-500/30 rounded-2xl blur-md -z-10" />
      )}
      <img
        src={logoImg}
        alt={alt}
        className="w-full h-full object-contain drop-shadow-xs transition-transform duration-300 hover:scale-105 select-none"
        draggable={false}
      />
    </div>
  );
};

export default BrandLogo;
