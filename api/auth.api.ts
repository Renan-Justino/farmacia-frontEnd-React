import { api } from './axios';
import { LoginRequestDTO, LoginResponseDTO, RegisterRequestDTO, UsuarioResponseDTO } from '../dtos/auth.dto';

export const authApi = {
  login: async (credentials: LoginRequestDTO): Promise<LoginResponseDTO> => {
    const { data } = await api.post<LoginResponseDTO>('/auth/login', credentials);
    return data;
  },
  register: async (userData: RegisterRequestDTO): Promise<UsuarioResponseDTO> => {
    const { data } = await api.post<UsuarioResponseDTO>('/auth/register', userData);
    return data;
  },
};
