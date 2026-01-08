import { api } from './axios';
import { ClienteRequestDTO, ClienteResponseDTO } from '../dtos/cliente.dto';

export const clientesApi = {
  getAll: async (): Promise<ClienteResponseDTO[]> => {
    const { data } = await api.get<ClienteResponseDTO[]>('/clientes');
    return data;
  },
  getById: async (id: number): Promise<ClienteResponseDTO> => {
    const { data } = await api.get<ClienteResponseDTO>(`/clientes/${id}`);
    return data;
  },
  create: async (payload: ClienteRequestDTO): Promise<ClienteResponseDTO> => {
    const { data } = await api.post<ClienteResponseDTO>('/clientes', payload);
    return data;
  },
  update: async (id: number, payload: ClienteRequestDTO): Promise<ClienteResponseDTO> => {
    const { data } = await api.put<ClienteResponseDTO>(`/clientes/${id}`, payload);
    return data;
  },
};
