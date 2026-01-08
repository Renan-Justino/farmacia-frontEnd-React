import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Clientes from '../pages/Clientes';
import Medicamentos from '../pages/Medicamentos';
import Vendas from '../pages/Vendas';
import Estoque from '../pages/Estoque';
import Logs from '../pages/Logs';
import AnaliseVendas from '../pages/AnaliseVendas';
import EstrategiaMedicamentos from '../pages/EstrategiaMedicamentos';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  // eslint-disable-next-line no-console
  console.log('[AppRoutes] render');

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="analise-vendas" element={<AnaliseVendas />} />
          <Route path="estrategia-medicamentos" element={<EstrategiaMedicamentos />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="medicamentos" element={<Medicamentos />} />
          <Route path="vendas" element={<Vendas />} />
          <Route path="estoque" element={<Estoque />} />
          <Route path="logs" element={<Logs />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default AppRoutes;