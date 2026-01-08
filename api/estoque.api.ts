import { api } from './axios';
import { MovimentacaoRequestDTO, MovimentacaoResponseDTO } from '../dtos/estoque.dto';

export const estoqueApi = {
  entrada: async (payload: MovimentacaoRequestDTO): Promise<void> => {
    await api.post('/estoque/entrada', payload);
  },
  saida: async (payload: MovimentacaoRequestDTO): Promise<void> => {
    await api.post('/estoque/saida', payload);
  },
  getHistory: async (medicamentoId: number): Promise<MovimentacaoResponseDTO[]> => {
    const { data } = await api.get<MovimentacaoResponseDTO[]>(`/estoque/${medicamentoId}`);
    return data;
  },
};
