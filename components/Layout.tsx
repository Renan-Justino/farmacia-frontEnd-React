import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Toolbar from './Toolbar';
import Footer from './Footer';
import Logo from './Logo';
import Icon from './Icon';

const Layout: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/home', icon: 'dashboard' },
    { name: 'Clientes', path: '/clientes', icon: 'users' },
    { name: 'Medicamentos', path: '/medicamentos', icon: 'pills' },
    { name: 'Vendas', path: '/vendas', icon: 'shopping' },
    { name: 'Estoque', path: '/estoque', icon: 'box' },
    { name: 'Logs', path: '/logs', icon: 'log' },
  ];

  const isActive = (path: string) => {
    if (path === '/home') {
      return location.pathname === '/home' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 pt-20 pb-20" style={{ paddingBottom: '70px', paddingTop: '80px' }}>
      {/* Toolbar Fixa */}
      <Toolbar />
      
      {/* Footer Fixo */}
      <Footer />

      {/* Overlay para mobile/tablet */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-dpsp-dark bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          style={{ pointerEvents: 'auto' }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex-col shadow-sm transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex overflow-y-auto`}
        style={{ top: '80px', maxHeight: 'calc(100vh - 80px - 70px)' }}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <Logo size="md" />
            <p className="text-xs text-gray-500 mt-1">Sistema de Gestão</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Fechar menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-dpsp-dark-blue text-white'
                  : 'text-gray-700 hover:bg-dpsp-light-blue/10'
              }`}
            >
              <Icon name={item.icon} className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={() => {
              setSidebarOpen(false);
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-dpsp-red hover:bg-dpsp-red/90 transition-colors"
          >
            <Icon name="logout" className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header com menu hambúrguer - Integrado na toolbar (mobile e tablet) */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-transparent pointer-events-none" style={{ height: '80px' }}>
          <div className="absolute top-0 left-0 px-4 py-3 pointer-events-auto">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white hover:text-white/80 transition-colors bg-dpsp-dark/50 backdrop-blur-sm rounded-lg p-2 shadow-lg"
              aria-label="Abrir menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
