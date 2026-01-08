import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import AppRoutes from './routes/AppRoutes';
import { AppShell } from './layout/AppShell';
import ErrorBoundary from './components/ErrorBoundary';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  // eslint-disable-next-line no-console
  console.log('[App] mount');

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* AppShell is a dev-only hidden placeholder to ensure Tailwind generates utilities */}
        <AppShell />

        {/* ErrorBoundary mostra erros de renderização e evita tela branca */}
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
};


export default App;