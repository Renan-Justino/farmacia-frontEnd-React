export interface ItemVendaRequestDTO {
  medicamentoId: number;
  quantidade: number;
}

export interface VendaRequestDTO {
  clienteId: number;
  itens: ItemVendaRequestDTO[];
}

export interface ItemVendaResponseDTO {
  medicamentoId: number;
  nomeMedicamento: string;
  quantidade: number;
  precoUnitario: number;
}

export interface VendaResponseDTO {
  id: number;
  dataVenda: string; // ISO DateTime
  valorTotal: number;
  clienteId: number;
  nomeCliente: string;
  itens: ItemVendaResponseDTO[];
}
