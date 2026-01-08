import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendasApi } from '../api/vendas.api';
import { VendaRequestDTO } from '../dtos/venda.dto';

export const useVendas = () => {
  return useQuery({
    queryKey: ['vendas'],
    queryFn: vendasApi.getAll,
  });
};

export const useCreateVenda = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vendasApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendas'] });
      // Creating a sale affects stock
      queryClient.invalidateQueries({ queryKey: ['medicamentos'] }); 
    },
  });
};
