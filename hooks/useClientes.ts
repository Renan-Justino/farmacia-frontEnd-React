import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientesApi } from '../api/clientes.api';
import { ClienteRequestDTO } from '../dtos/cliente.dto';

export const useClientes = () => {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: clientesApi.getAll,
  });
};

export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
};

export const useUpdateCliente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ClienteRequestDTO }) => clientesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
};
