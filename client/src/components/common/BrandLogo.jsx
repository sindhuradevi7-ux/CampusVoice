import React from 'react';
import logoImg from '../../assets/logo.png';

export const BrandLogo = ({ className = "w-12 h-12", showGlow = false, alt = "Campus Voice Brand Mark" }) => {
  return (
    <div className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 aspect-square ${className}`}>
      {showGlow && (
        <div className="absolute inset-0 bg-gradient-to-tr from-burgundy-700/20 to-peach-500/30 rounded-full blur-md -z-10" />
      )}
      <img
        src={logoImg}
        alt={alt}
        className="w-full h-full object-cover scale-135 rounded-full select-none"
        draggable={false}
      />
    </div>
  );
};

export default BrandLogo;
