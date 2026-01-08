import React, { useState } from 'react';
import { authApi } from '../api/auth.api';
import { useNavigate, Link } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { RegisterRequestDTO } from '../dtos/auth.dto';
import Logo from '../components/Logo';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequestDTO>({
    username: '',
    password: '',
    perfil: 'ATENDENTE',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== confirmPassword) {
      setError({ code: 'PASSWORD_MISMATCH', message: 'As senhas não coincidem.' });
      return;
    }

    if (formData.password.length < 6) {
      setError({ code: 'PASSWORD_TOO_SHORT', message: 'A senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setIsLoading(true);
    try {
      await authApi.register(formData);
      // Após registro bem-sucedido, redireciona para login
      navigate('/login', { state: { message: 'Usuário criado com sucesso! Faça login para continuar.' } });
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <p className="text-sm text-gray-500">Criar nova conta</p>
          </div>

          <ErrorMessage error={error} />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Usuário</label>
              <input
                type="text"
                required
                minLength={3}
                maxLength={50}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input"
                placeholder="Digite seu nome de usuário"
              />
            </div>

            <div>
              <label className="label">Senha</label>
              <input
                type="password"
                required
                minLength={6}
                maxLength={100}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="label">Confirmar Senha</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="Digite a senha novamente"
              />
            </div>

            <div>
              <label className="label">Perfil</label>
              <select
                value={formData.perfil}
                onChange={(e) => setFormData({ ...formData, perfil: e.target.value as 'ADMIN' | 'ATENDENTE' })}
                className="input"
              >
                <option value="ATENDENTE">Atendente</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary"
              >
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </button>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Já tem uma conta? <span className="text-gray-900">Faça login</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

