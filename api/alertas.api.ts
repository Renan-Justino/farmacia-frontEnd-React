import { api } from './axios';
import { MedicamentoResponseDTO } from '../dtos/medicamento.dto';

export const alertasApi = {
  getValidadeProxima: async (dias?: number): Promise<MedicamentoResponseDTO[]> => {
    const params = dias ? `?dias=${dias}` : '';
    const { data } = await api.get<MedicamentoResponseDTO[]>(`/alertas/validade-proxima${params}`);
    return data;
  },
  getEstoqueBaixo: async (limite?: number): Promise<MedicamentoResponseDTO[]> => {
    const params = limite ? `?limite=${limite}` : '';
    const { data } = await api.get<MedicamentoResponseDTO[]>(`/alertas/estoque-baixo${params}`);
    return data;
  },
};
