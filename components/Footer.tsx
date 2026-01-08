import React, { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 z-50 shadow-md overflow-hidden transition-opacity duration-300 ease-in-out" 
      style={{ 
        background: 'linear-gradient(to right, #1f2937 0%, #60a5fa 50%, #1f2937 100%)', 
        minHeight: '70px',
        opacity: isScrolled ? 0.7 : 1
      }}
    >
      <div className="w-full py-3 px-4 md:px-6 flex items-center justify-center" style={{ minHeight: '70px' }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-dpsp-dark-blue text-xs md:text-sm font-medium leading-relaxed">
            Movido pelo cliente, somos <span className="font-bold">Grupo DPSP</span> / Drogaria SP e Drogaria Pacheco
          </p>
          <p className="text-dpsp-dark-blue/80 text-xs mt-1">
            © {new Date().getFullYear()} Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

