/**
 * Tratamento Global de Erros
 * 
 * Centraliza a lógica de tratamento de erros HTTP e de negócio,
 * garantindo consistência em toda a aplicação.
 */

import { AxiosError } from 'axios';
import { getBusinessError, extractErrorCodeFromMessage, BusinessErrorMapping } from '../constants/businessErrors';

/**
 * Formato de erro retornado pelo backend
 */
export interface ApiErrorResponse {
  timestamp?: string;
  status: number;
  error?: string;
  message: string;
  path?: string;
}

/**
 * Erro processado e pronto para exibição
 */
export interface ProcessedError {
  /** Código de erro técnico (para logging) */
  code: string;
  /** Mensagem amigável para o usuário */
  message: string;
  /** Severidade do erro */
  severity: 'error' | 'warning' | 'info';
  /** Se o erro bloqueia a ação */
  blocking: boolean;
  /** Sugestão de ação */
  actionHint?: string;
  /** Status HTTP */
  status: number;
  /** Mensagem técnica original (para debug) */
  technicalMessage?: string;
}

/**
 * Processa um erro HTTP/Axios e retorna um erro formatado para UX
 * 
 * @param error Erro capturado (AxiosError, Error, ou unknown)
 * @returns Erro processado pronto para exibição
 */
export function processError(error: unknown): ProcessedError {
  // Erro de rede (sem resposta do servidor)
  if (isAxiosError(error) && !error.response) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Não foi possível conectar ao servidor.',
      severity: 'error',
      blocking: true,
      actionHint: 'Verifique sua conexão com a internet e tente novamente.',
      status: 0,
      technicalMessage: error.message,
    };
  }

  // Erro HTTP com resposta
  if (isAxiosError(error) && error.response) {
    const apiError = error.response.data as Partial<ApiErrorResponse>;
    const status = error.response.status;
    const errorCode = apiError.error || extractErrorCodeFromMessage(apiError.message || '');
    const technicalMessage = apiError.message || error.message;

    // Obtém mapeamento de erro de negócio
    const businessError = getBusinessError(errorCode);

    return {
      code: errorCode || 'UNKNOWN_ERROR',
      message: businessError.message,
      severity: businessError.severity,
      blocking: businessError.blocking,
      actionHint: businessError.actionHint,
      status,
      technicalMessage,
    };
  }

  // Erro JavaScript genérico
  if (error instanceof Error) {
    return {
      code: 'JAVASCRIPT_ERROR',
      message: 'Ocorreu um erro inesperado na aplicação.',
      severity: 'error',
      blocking: true,
      actionHint: 'Recarregue a página e tente novamente. Se o problema persistir, entre em contato com o suporte.',
      status: 0,
      technicalMessage: error.message,
    };
  }

  // Erro desconhecido
  return {
    code: 'UNKNOWN_ERROR',
    message: 'Ocorreu um erro inesperado.',
    severity: 'error',
    blocking: true,
    actionHint: 'Tente novamente em alguns instantes.',
    status: 0,
  };
}

/**
 * Verifica se o erro é um AxiosError
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as any).isAxiosError === true
  );
}

/**
 * Determina se um erro deve ser logado no console (apenas em desenvolvimento)
 */
export function shouldLogError(error: ProcessedError): boolean {
  // Em produção, apenas erros críticos devem ser logados
  // Em desenvolvimento, logar tudo para debug
  if (import.meta.env.DEV) {
    return true;
  }

  // Em produção, apenas erros de servidor (5xx) e erros críticos
  return error.status >= 500 || error.severity === 'error';
}

/**
 * Determina o tipo de feedback UX baseado no erro
 */
export type FeedbackType = 'toast' | 'inline' | 'modal' | 'banner';

export function getFeedbackType(error: ProcessedError): FeedbackType {
  // Erros de rede sempre em banner (crítico)
  if (error.code === 'NETWORK_ERROR') {
    return 'banner';
  }

  // Erros de validação em inline (próximo ao campo)
  if (error.status === 400 && error.severity === 'warning') {
    return 'inline';
  }

  // Erros de negócio (422) em toast ou inline dependendo do contexto
  if (error.status === 422) {
    return 'toast';
  }

  // Erros de servidor (5xx) em banner
  if (error.status >= 500) {
    return 'banner';
  }

  // Erros de autorização (401, 403) em modal ou banner
  if (error.status === 401 || error.status === 403) {
    return 'modal';
  }

  // Padrão: toast para erros de negócio, banner para erros críticos
  return error.severity === 'error' ? 'banner' : 'toast';
}

