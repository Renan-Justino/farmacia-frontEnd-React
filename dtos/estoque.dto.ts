export interface MovimentacaoRequestDTO {
  medicamentoId: number;
  quantidade: number;
  observacao: string;
}

export interface MovimentacaoResponseDTO {
  id: number;
  medicamentoNome: string;
  tipo: string; // 'ENTRADA' | 'SAIDA'
  quantidade: number;
  observacao: string;
  dataHora: string; // ISO DateTime
}
