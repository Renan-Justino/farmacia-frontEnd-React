export interface ClienteRequestDTO {
  nome: string;
  cpf: string;
  email: string;
  dataNascimento: string; // YYYY-MM-DD
}

export interface ClienteResponseDTO {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  dataNascimento: string;
}
