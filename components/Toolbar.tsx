import React from 'react';

const Toolbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[60] shadow-md overflow-hidden" style={{ height: 'auto', minHeight: '80px' }}>
      <div className="w-full h-full flex items-center justify-between px-2 sm:px-4 md:px-6 lg:px-8" style={{ background: 'linear-gradient(to right, #1f2937 0%, #60a5fa 50%, #1f2937 100%)' }}>
        {/* Imagens laterais - Ocultas em mobile, visíveis a partir de tablet */}
        <div className="hidden sm:flex items-center gap-2 md:gap-4 h-full">
          <img
            src="/img1.jpg"
            alt="DPSP"
            className="h-14 sm:h-16 md:h-20 w-auto object-contain"
            style={{ display: 'block' }}
          />
          <img
            src="/img2.jpg"
            alt="DPSP"
            className="h-14 sm:h-16 md:h-20 w-auto object-contain"
            style={{ display: 'block' }}
          />
        </div>

        {/* Imagem central - Sempre visível, priorizada em mobile */}
        <div className="flex-1 flex items-center justify-center h-full px-2 sm:px-4">
          <img
            src="/grupodpsp_cover.jpg"
            alt="DPSP"
            className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto max-w-full object-contain"
            style={{ display: 'block' }}
          />
        </div>

        {/* Imagem lateral direita - Ocultas em mobile, visíveis a partir de tablet */}
        <div className="hidden sm:flex items-center justify-end h-full">
          <img
            src="/img3.jpg"
            alt="DPSP"
            className="h-14 sm:h-16 md:h-20 w-auto object-contain"
            style={{ display: 'block' }}
          />
        </div>
      </div>
    </header>
  );
};

export default Toolbar;

