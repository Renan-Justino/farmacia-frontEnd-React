import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiErrorDTO } from '../dtos/error.dto';

// Se VITE_API_URL não estiver definida, usa proxy do Vite (string vazia = mesma origem)
const API_URL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * - Injeta JWT automaticamente
 * - NÃO envia token para endpoints públicos (/auth)
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isPublicAuthEndpoint =
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/register');

    if (!isPublicAuthEndpoint) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor
 * - Trata 401 e 403 globalmente
 * - Remove token inválido
 * - Redireciona para login apenas se não estiver já na página de login
 * - NÃO quebra o app se houver erro durante bootstrap
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    
    // Trata 401 (Unauthorized) e 403 (Forbidden)
    if (status === 401 || status === 403) {
      // Remove token inválido/expirado
      localStorage.removeItem('auth_token');
      
      // Redireciona para login APENAS se não estiver já na página de login
      // e se não estiver em uma rota pública
      const currentPath = window.location.hash.replace('#', '') || window.location.pathname;
      const isPublicRoute = currentPath === '/login' || currentPath === '/register';
      
      if (!isPublicRoute) {
        // Usa hash router para redirecionamento
        window.location.hash = '/login';
      }
    }
    
    // Sempre rejeita o erro para que os componentes possam tratá-lo
    return Promise.reject(error);
  }
);

/**
 * Normaliza erros vindos da API
 * O backend retorna ErrorResponse com: timestamp, status, error, message, path
 * 
 * @deprecated Use processError de utils/errorHandler.ts para tratamento profissional
 * Este método é mantido apenas para compatibilidade
 */
export const parseApiError = (error: unknown): ApiErrorDTO => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data as any;

    // Backend retorna ErrorResponse: { timestamp, status, error, message, path }
    if (data.message) {
      return {
        code: data.error || `HTTP_${error.response.status}` || 'API_ERROR',
        message: data.message,
        field: data.field,
      };
    }

    // Fallback para formato antigo
    if (data.code && data.message) {
      return {
        code: data.code,
        message: data.message,
        field: data.field,
      };
    }
  }

  // Erro de rede ou conexão
  if (axios.isAxiosError(error) && !error.response) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
    };
  }

  // Erro desconhecido
  return {
    code: 'UNKNOWN_ERROR',
    message: 'Ocorreu um erro inesperado. Tente novamente.',
  };
};
