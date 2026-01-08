import { api } from './axios';
import { MedicamentoRequestDTO, MedicamentoResponseDTO, MedicamentoUpdateDTO } from '../dtos/medicamento.dto';

export const medicamentosApi = {
  getAll: async (): Promise<MedicamentoResponseDTO[]> => {
    const { data } = await api.get<MedicamentoResponseDTO[]>('/medicamentos');
    return data;
  },
  getById: async (id: number): Promise<MedicamentoResponseDTO> => {
    const { data } = await api.get<MedicamentoResponseDTO>(`/medicamentos/${id}`);
    return data;
  },
  create: async (payload: MedicamentoRequestDTO): Promise<MedicamentoResponseDTO> => {
    const { data } = await api.post<MedicamentoResponseDTO>('/medicamentos', payload);
    return data;
  },
  update: async (id: number, payload: MedicamentoUpdateDTO): Promise<MedicamentoResponseDTO> => {
    const { data } = await api.put<MedicamentoResponseDTO>(`/medicamentos/${id}`, payload);
    return data;
  },
  updateStatus: async (id: number, ativo: boolean): Promise<void> => {
    // API expects raw boolean in body (JSON true/false)
    await api.patch(`/medicamentos/${id}/status`, ativo);
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/medicamentos/${id}`);
  }
};
