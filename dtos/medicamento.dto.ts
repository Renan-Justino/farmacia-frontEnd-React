export interface MedicamentoRequestDTO {
  nome: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  dataValidade: string; // YYYY-MM-DD
  ativo: boolean;
  categoriaId: number;
}

export interface MedicamentoUpdateDTO {
  nome: string;
  descricao: string;
  preco: number;
  dataValidade: string;
  ativo: boolean;
  categoriaId: number;
}

export interface MedicamentoResponseDTO {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  dataValidade: string;
  ativo: boolean;
  categoriaId: number;
  categoriaNome: string;
}
