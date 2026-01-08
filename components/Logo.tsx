import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: { grupo: 'text-xs', dpsp: 'text-sm', symbol: 'w-1.5 h-3' },
    md: { grupo: 'text-sm', dpsp: 'text-xl', symbol: 'w-2 h-4' },
    lg: { grupo: 'text-base', dpsp: 'text-3xl', symbol: 'w-3 h-6' },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`flex flex-col ${className}`} style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Linha superior: GRUPO + símbolo */}
      <div className="flex items-center gap-2">
        <span className={`font-bold ${sizes.grupo} text-dpsp-dark-blue`}>GRUPO</span>
        <div className="flex items-center gap-0.5">
          {/* Retângulo azul escuro */}
          <div className={`${sizes.symbol} bg-dpsp-dark-blue`}></div>
          {/* Retângulo vermelho */}
          <div className={`${sizes.symbol} bg-dpsp-red`}></div>
          {/* Seta azul claro apontando para direita */}
          <div 
            className={`${size === 'sm' ? 'border-t-[6px] border-b-[6px] border-l-[8px]' : size === 'md' ? 'border-t-[8px] border-b-[8px] border-l-[12px]' : 'border-t-[12px] border-b-[12px] border-l-[18px]'} border-t-transparent border-b-transparent border-l-dpsp-light-blue`}
          ></div>
        </div>
      </div>
      {/* Linha inferior: DPSP */}
      <span className={`font-bold ${sizes.dpsp} text-dpsp-dark-blue leading-tight`}>
        DPSP
      </span>
    </div>
  );
};

export default Logo;

