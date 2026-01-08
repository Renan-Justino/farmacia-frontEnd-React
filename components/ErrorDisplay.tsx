/**
 * Componente de Exibição de Erros
 * 
 * Componente profissional para exibição de erros com diferentes estilos
 * baseados na severidade e tipo de feedback.
 */

import React from 'react';
import { ProcessedError, getFeedbackType } from '../utils/errorHandler';

interface ErrorDisplayProps {
  error: ProcessedError;
  className?: string;
  onDismiss?: () => void;
}

/**
 * Componente principal de exibição de erros
 * Adapta-se automaticamente ao tipo de feedback recomendado
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, className = '', onDismiss }) => {
  const feedbackType = getFeedbackType(error);

  switch (feedbackType) {
    case 'banner':
      return <ErrorBanner error={error} className={className} onDismiss={onDismiss} />;
    case 'modal':
      return <ErrorModal error={error} className={className} onDismiss={onDismiss} />;
    case 'inline':
      return <ErrorInline error={error} className={className} />;
    case 'toast':
    default:
      return <ErrorToast error={error} className={className} onDismiss={onDismiss} />;
  }
};

/**
 * Banner de erro (fixo no topo da página)
 * Usado para erros críticos que afetam toda a aplicação
 */
const ErrorBanner: React.FC<ErrorDisplayProps> = ({ error, className, onDismiss }) => {
  const bgColor = error.severity === 'error' ? 'bg-red-50 border-red-400' : 'bg-yellow-50 border-yellow-400';
  const textColor = error.severity === 'error' ? 'text-red-800' : 'text-yellow-800';
  const icon = error.severity === 'error' ? '❌' : '⚠️';

  return (
    <div className={`${bgColor} border-l-4 border rounded-lg p-4 mb-6 ${className}`} role="alert">
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{icon}</span>
        <div className="flex-1">
          <p className={`font-semibold text-sm mb-1 ${textColor}`}>
            {error.severity === 'error' ? 'Erro' : 'Atenção'}
          </p>
          <p className={`text-sm ${textColor}`}>{error.message}</p>
          {error.actionHint && (
            <p className={`text-xs mt-2 opacity-90 ${textColor}`}>
              💡 {error.actionHint}
            </p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={error.severity === 'error' ? 'text-red-600 hover:opacity-75 transition-opacity' : 'text-yellow-600 hover:opacity-75 transition-opacity'}
            aria-label="Fechar"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Toast de erro (notificação temporária)
 * Usado para erros de negócio que não bloqueiam a interface
 */
const ErrorToast: React.FC<ErrorDisplayProps> = ({ error, className, onDismiss }) => {
  const bgColor = error.severity === 'error' ? 'bg-red-50 border-red-400' : 'bg-yellow-50 border-yellow-400';
  const textColor = error.severity === 'error' ? 'text-red-800' : 'text-yellow-800';
  const icon = error.severity === 'error' ? '❌' : '⚠️';

  return (
    <div className={`${bgColor} border-l-4 border rounded-lg p-4 shadow-lg ${className}`} role="alert">
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0">{icon}</span>
        <div className="flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{error.message}</p>
          {error.actionHint && (
            <p className={`text-xs mt-1 opacity-90 ${textColor}`}>{error.actionHint}</p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={error.severity === 'error' ? 'text-red-600 hover:opacity-75 transition-opacity text-sm' : 'text-yellow-600 hover:opacity-75 transition-opacity text-sm'}
            aria-label="Fechar"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Erro inline (próximo ao campo)
 * Usado para erros de validação de formulário
 */
const ErrorInline: React.FC<Omit<ErrorDisplayProps, 'onDismiss'>> = ({ error, className }) => {
  return (
    <p className={`text-xs text-red-600 mt-1 ${className}`} role="alert">
      {error.message}
      {error.actionHint && (
        <span className="block mt-1 text-gray-600">{error.actionHint}</span>
      )}
    </p>
  );
};

/**
 * Modal de erro
 * Usado para erros críticos que requerem atenção imediata
 */
const ErrorModal: React.FC<ErrorDisplayProps> = ({ error, className, onDismiss }) => {
  if (!onDismiss) {
    // Se não há handler de dismiss, renderiza como banner
    return <ErrorBanner error={error} className={className} onDismiss={onDismiss} />;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full p-6">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Atenção</h3>
            <p className="text-sm text-gray-700">{error.message}</p>
            {error.actionHint && (
              <p className="text-xs text-gray-600 mt-2">{error.actionHint}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onDismiss}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

