export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
}

export interface RegisterRequestDTO {
  username: string;
  password: string;
  perfil?: 'ADMIN' | 'ATENDENTE';
}

export interface UsuarioResponseDTO {
  id: number;
  username: string;
  perfil: string;
  ativo: boolean;
}
