import { api } from './axios';

export interface LogEntryDTO {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  module?: string;
  userId?: number;
  username?: string;
  action?: string;
  details?: string;
  entityType?: string;
  entityId?: number;
}

export const logsApi = {
  getAll: async (): Promise<LogEntryDTO[]> => {
    const { data } = await api.get<LogEntryDTO[]>('/api/logs');
    return data;
  },
  getByLevel: async (level: string): Promise<LogEntryDTO[]> => {
    const { data } = await api.get<LogEntryDTO[]>(`/api/logs?level=${level}`);
    return data;
  },
  getByDateRange: async (startDate: string, endDate: string): Promise<LogEntryDTO[]> => {
    // Formato ISO 8601 para o backend
    const start = new Date(startDate).toISOString();
    const end = new Date(endDate).toISOString();
    const { data } = await api.get<LogEntryDTO[]>(`/api/logs?startDate=${start}&endDate=${end}`);
    return data;
  },
};

