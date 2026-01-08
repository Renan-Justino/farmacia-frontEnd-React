import React from 'react';
import { ClienteResponseDTO } from '../dtos/cliente.dto';
import DetailModal from './DetailModal';

interface ClienteDetailsProps {
  cliente: ClienteResponseDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

const ClienteDetails: React.FC<ClienteDetailsProps> = ({ cliente, isOpen, onClose }) => {
  if (!cliente) return null;

  const calcularIdade = (dataNascimento: string) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const formatarCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Cliente"
      size="md"
    >
      <div className="space-y-6">
        {/* Informações Principais */}
        <div className="bg-dpsp-light-blue/10 rounded-lg p-4 border border-dpsp-light-blue/20">
          <h4 className="font-semibold text-dpsp-dark-blue mb-3 flex items-center gap-2">
            <span>👤</span> Informações Pessoais
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Nome Completo</p>
              <p className="text-sm font-medium text-gray-900">{cliente.nome}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">CPF</p>
              <p className="text-sm font-medium text-gray-900">{formatarCPF(cliente.cpf)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">E-mail</p>
              <p className="text-sm font-medium text-gray-900">{cliente.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Data de Nascimento</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(cliente.dataNascimento).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Idade</p>
              <p className="text-sm font-medium text-gray-900">
                {calcularIdade(cliente.dataNascimento)} anos
              </p>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>📋</span> Informações do Sistema
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">ID do Cliente</p>
              <p className="text-sm font-medium text-gray-900">#{cliente.id}</p>
            </div>
          </div>
        </div>
      </div>
    </DetailModal>
  );
};

export default ClienteDetails;

