import React from 'react';
import { parseApiError } from '../api/axios';
import { extractFieldErrors } from '../utils/errorMessages';

interface FieldErrorProps {
  error: unknown;
  fieldName: string;
  className?: string;
}

export const FieldError: React.FC<FieldErrorProps> = ({ error, fieldName, className = '' }) => {
  if (!error) return null;

  const apiError = parseApiError(error);
  const fieldErrors = extractFieldErrors(apiError.message);
  
  // Tenta encontrar o erro pelo nome do campo (case-insensitive)
  const fieldError = fieldErrors[fieldName] || 
                     fieldErrors[fieldName.toLowerCase()] ||
                     fieldErrors[fieldName.toUpperCase()];

  if (!fieldError) return null;

  return (
    <p className={`text-xs text-red-600 mt-1 ${className}`} role="alert">
      {fieldError}
    </p>
  );
};

