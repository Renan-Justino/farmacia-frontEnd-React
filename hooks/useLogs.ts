import { useQuery } from '@tanstack/react-query';
import { logsApi, LogEntryDTO } from '../api/logs.api';

export const useLogs = (filters?: { level?: string; startDate?: string; endDate?: string }) => {
  return useQuery<LogEntryDTO[]>({
    queryKey: ['logs', 'all'],
    queryFn: async () => {
      // Busca todos os logs do backend
      // Os filtros são aplicados no frontend para melhor performance e flexibilidade
      try {
        const allLogs = await logsApi.getAll();
        return allLogs || [];
      } catch (error) {
        console.error('Erro ao carregar logs:', error);
        return [];
      }
    },
    refetchInterval: 30000, // Atualiza a cada 30 segundos
    staleTime: 10000, // Considera os dados frescos por 10 segundos
    retry: 2, // Tenta novamente 2 vezes em caso de erro
  });
};

