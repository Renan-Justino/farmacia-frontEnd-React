import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DPSPLogo from './DPSPLogo';

const Header: React.FC = () => {
  const { token, logout } = useAuth();

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="hover:opacity-80 transition-opacity">
              <DPSPLogo size="sm" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {token ? (
              <>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="btn-primary">
                  Entrar
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;