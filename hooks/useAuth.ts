import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth.api';
import { LoginRequestDTO } from '../dtos/auth.dto';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginRequestDTO) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, [token]);

  const login = async (credentials: LoginRequestDTO) => {
    const response = await authApi.login(credentials);
    setToken(response.token);
  };

  const logout = () => {
    setToken(null);
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { token, isAuthenticated: !!token, login, logout } },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};