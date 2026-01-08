import React from 'react';

interface Props { children: React.ReactNode }
interface State { hasError: boolean, error?: Error }

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = { hasError: false };

  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // Log para facilitar depuração local
    // Em produção, integrar com Sentry/Logger central
    // eslint-disable-next-line no-console
    console.error('Uncaught error in component tree:', error, info);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
            <p className="font-bold">Erro na aplicação</p>
            <pre className="mt-2 text-sm text-red-700">{this.state.error?.message}</pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 
