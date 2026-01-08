import { api } from './axios';
import { VendaRequestDTO, VendaResponseDTO } from '../dtos/venda.dto';

export const vendasApi = {
  getAll: async (): Promise<VendaResponseDTO[]> => {
    const { data } = await api.get<VendaResponseDTO[]>('/api/vendas');
    return data;
  },
  getById: async (id: number): Promise<VendaResponseDTO> => {
    const { data } = await api.get<VendaResponseDTO>(`/api/vendas/${id}`);
    return data;
  },
  create: async (payload: VendaRequestDTO): Promise<VendaResponseDTO> => {
    const { data } = await api.post<VendaResponseDTO>('/api/vendas', payload);
    return data;
  },
  getByCliente: async (clienteId: number): Promise<VendaResponseDTO[]> => {
    const { data } = await api.get<VendaResponseDTO[]>(`/api/vendas/cliente/${clienteId}`);
    return data;
  },
};
