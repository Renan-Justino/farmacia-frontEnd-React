/**
 * Hook para Tratamento de Erros
 * 
 * Facilita o uso do sistema de tratamento de erros em componentes React
 */

import { useState, useCallback } from 'react';
import { processError, ProcessedError, shouldLogError } from '../utils/errorHandler';

/**
 * Hook que gerencia erros de forma reativa
 * 
 * @example
 * const { error, handleError, clearError } = useErrorHandler();
 * 
 * try {
 *   await api.call();
 * } catch (err) {
 *   handleError(err);
 * }
 * 
 * return (
 *   <>
 *     {error && <ErrorDisplay error={error} onDismiss={clearError} />}
 *   </>
 * );
 */
export function useErrorHandler() {
  const [error, setError] = useState<ProcessedError | null>(null);

  const handleError = useCallback((err: unknown) => {
    const processed = processError(err);
    
    // Log apenas em desenvolvimento ou para erros críticos
    if (shouldLogError(processed)) {
      console.error('Erro processado:', {
        code: processed.code,
        message: processed.message,
        status: processed.status,
        technical: processed.technicalMessage,
      });
    }

    setError(processed);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
    hasError: error !== null,
  };
}

