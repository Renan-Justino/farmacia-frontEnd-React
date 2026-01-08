import { api } from './axios';
import { CategoriaRequestDTO, CategoriaResponseDTO } from '../dtos/categoria.dto';

export const categoriasApi = {
  getAll: async (): Promise<CategoriaResponseDTO[]> => {
    const { data } = await api.get<CategoriaResponseDTO[]>('/categorias');
    return data;
  },
  create: async (payload: CategoriaRequestDTO): Promise<CategoriaResponseDTO> => {
    const { data } = await api.post<CategoriaResponseDTO>('/categorias', payload);
    return data;
  },
  getById: async (id: number): Promise<CategoriaResponseDTO> => {
    const { data } = await api.get<CategoriaResponseDTO>(`/categorias/${id}`);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },
};
