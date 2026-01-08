import React from 'react';
import { parseApiError } from '../api/axios';
import { ApiErrorDTO } from '../dtos/error.dto';
import { getFriendlyErrorMessage, extractFieldErrors } from '../utils/errorMessages';

interface ErrorMessageProps {
  error: unknown;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, className = '' }) => {
  if (!error) return null;

  const apiError: ApiErrorDTO = parseApiError(error);
  const friendly = getFriendlyErrorMessage(apiError.message);
  const fieldErrors = extractFieldErrors(apiError.message);

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  const getBgColor = () => {
    switch (friendly.type) {
      case 'error':
        return 'bg-red-50 border-red-400 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-400 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-400 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-400 text-gray-800';
    }
  };

  const getIcon = () => {
    return friendly.icon || (friendly.type === 'error' ? '❌' : friendly.type === 'warning' ? '⚠️' : 'ℹ️');
  };

  return (
    <div className={`${getBgColor()} border-l-4 border rounded-lg p-4 mb-6 ${className}`} role="alert">
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{getIcon()}</span>
        <div className="flex-1">
          <p className="font-semibold text-sm mb-1">
            {friendly.type === 'error' ? 'Erro' : friendly.type === 'warning' ? 'Atenção' : 'Informação'}
          </p>
          <p className="text-sm">{friendly.message}</p>
          
          {hasFieldErrors && (
            <div className="mt-3 pt-3 border-t border-current border-opacity-20">
              <p className="text-xs font-semibold mb-2">Erros nos campos:</p>
              <ul className="text-xs space-y-1">
                {Object.entries(fieldErrors).map(([field, message]) => (
                  <li key={field} className="flex items-start gap-2">
                    <span className="font-medium">• {field}:</span>
                    <span>{message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {apiError.code && apiError.code !== 'UNKNOWN_ERROR' && (
            <p className="text-xs mt-2 opacity-75">Código: {apiError.code}</p>
          )}
        </div>
      </div>
    </div>
  );
};
