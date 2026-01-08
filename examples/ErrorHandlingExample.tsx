/**
 * Exemplos de Uso do Sistema de Tratamento de Erros
 * 
 * Este arquivo demonstra os diferentes padrões de uso do sistema
 * de tratamento de erros em diferentes cenários.
 */

import React, { useState } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { processError } from '../utils/errorHandler';

// ==========================================
// EXEMPLO 1: Uso Básico com Hook
// ==========================================
export function ExemploBasico() {
  const { error, handleError, clearError } = useErrorHandler();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulação de chamada API
      await new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Erro de exemplo')), 1000)
      );
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <ErrorDisplay 
          error={error} 
          onDismiss={clearError}
        />
      )}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processando...' : 'Enviar'}
      </button>
    </div>
  );
}

// ==========================================
// EXEMPLO 2: Formulário com Erros Inline
// ==========================================
export function ExemploFormulario() {
  const { error, handleError, clearError } = useErrorHandler();
  const [cpf, setCpf] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); // Limpa erro anterior
    
    try {
      // Simulação de validação de CPF duplicado
      if (cpf === '12345678901') {
        throw { 
          response: { 
            status: 422,
            data: { 
              error: 'CLIENTE_CPF_DUPLICADO',
              message: 'Já existe um cliente cadastrado com este CPF.'
            }
          }
        };
      }
    } catch (err) {
      handleError(err);
    }
  };

  const processedError = error ? processError(error as any) : null;
  const isCpfError = processedError?.code === 'CLIENTE_CPF_DUPLICADO';

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>CPF</label>
        <input
          type="text"
          value={cpf}
          onChange={(e) => {
            setCpf(e.target.value);
            clearError(); // Limpa erro ao digitar
          }}
        />
        {isCpfError && processedError && (
          <ErrorDisplay error={processedError} />
        )}
      </div>
      <button type="submit">Salvar</button>
    </form>
  );
}

// ==========================================
// EXEMPLO 3: Múltiplos Erros (Lista)
// ==========================================
export function ExemploMultiplosErros() {
  const [errors, setErrors] = useState<ReturnType<typeof processError>[]>([]);

  const handleMultipleErrors = async () => {
    try {
      // Simulação de múltiplos erros
      const error1 = { response: { status: 422, data: { error: 'ESTOQUE_INSUFICIENTE', message: 'Estoque insuficiente' } } };
      const error2 = { response: { status: 422, data: { error: 'MEDICAMENTO_INATIVO', message: 'Medicamento inativo' } } };
      
      setErrors([
        processError(error1),
        processError(error2),
      ]);
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div>
      {errors.map((error, index) => (
        <ErrorDisplay
          key={index}
          error={error}
          onDismiss={() => {
            setErrors(errors.filter((_, i) => i !== index));
          }}
        />
      ))}
      <button onClick={handleMultipleErrors}>
        Testar Múltiplos Erros
      </button>
    </div>
  );
}

// ==========================================
// EXEMPLO 4: Erro de Rede
// ==========================================
export function ExemploErroRede() {
  const { error, handleError } = useErrorHandler();

  const handleNetworkError = () => {
    // Simula erro de rede (sem response)
    const networkError = {
      isAxiosError: true,
      response: undefined,
      message: 'Network Error',
    };
    handleError(networkError);
  };

  return (
    <div>
      {error && <ErrorDisplay error={error} />}
      <button onClick={handleNetworkError}>
        Simular Erro de Rede
      </button>
    </div>
  );
}

// ==========================================
// EXEMPLO 5: Integração com React Query
// ==========================================
export function ExemploComReactQuery() {
  const { error, handleError, clearError } = useErrorHandler();

  // Em um hook customizado
  const useCriarCliente = () => {
    const mutation = {
      mutateAsync: async (data: any) => {
        try {
          // Simulação de API call
          return await Promise.resolve(data);
        } catch (err) {
          handleError(err);
          throw err;
        }
      },
      isPending: false,
    };
    return mutation;
  };

  const criarCliente = useCriarCliente();

  const handleSubmit = async () => {
    clearError();
    try {
      await criarCliente.mutateAsync({ nome: 'Teste' });
    } catch (err) {
      // Erro já foi processado pelo handleError no hook
    }
  };

  return (
    <div>
      {error && <ErrorDisplay error={error} onDismiss={clearError} />}
      <button onClick={handleSubmit}>
        Criar Cliente
      </button>
    </div>
  );
}

