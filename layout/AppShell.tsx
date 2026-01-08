import React from 'react';

/**
 * Dev-only placeholder para garantir que Tailwind gere utilitários.
 * Mantido como `hidden` para não afetar UI em runtime.
 */
export const AppShell: React.FC = () => {
  return (
    <div className="hidden">
      {/* Dev-only placeholder para garantir que Tailwind gere utilitários */}
      <div className="bg-gray-100 text-gray-900 p-4 text-lg font-bold">AppShell (dev)</div>
    </div>
  );
};
