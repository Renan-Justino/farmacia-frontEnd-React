import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicamentosApi } from '../api/medicamentos.api';
import { categoriasApi } from '../api/categorias.api';
import { MedicamentoRequestDTO, MedicamentoUpdateDTO } from '../dtos/medicamento.dto';
import { CategoriaRequestDTO } from '../dtos/categoria.dto';

// --- Medicamentos ---
export const useMedicamentos = () => {
  return useQuery({
    queryKey: ['medicamentos'],
    queryFn: medicamentosApi.getAll,
  });
};

export const useCreateMedicamento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: medicamentosApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicamentos'] });
    },
  });
};

export const useUpdateMedicamento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MedicamentoUpdateDTO }) =>
      medicamentosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicamentos'] });
    },
  });
};

// --- Categorias ---
export const useCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasApi.getAll,
  });
};

export const useCreateCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriasApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
};

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriasApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
};
