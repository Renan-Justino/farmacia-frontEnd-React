import React from 'react';
import { MedicamentoResponseDTO } from '../dtos/medicamento.dto';
import DetailModal from './DetailModal';

interface MedicamentoDetailsProps {
  medicamento: MedicamentoResponseDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

const MedicamentoDetails: React.FC<MedicamentoDetailsProps> = ({ medicamento, isOpen, onClose }) => {
  if (!medicamento) return null;

  const verificarValidade = (dataValidade: string) => {
    const hoje = new Date();
    const validade = new Date(dataValidade);
    const diasRestantes = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diasRestantes < 0) {
      return { status: 'vencido', dias: Math.abs(diasRestantes), cor: 'red' };
    } else if (diasRestantes <= 30) {
      return { status: 'proximo', dias: diasRestantes, cor: 'yellow' };
    } else {
      return { status: 'ok', dias: diasRestantes, cor: 'green' };
    }
  };

  const validadeInfo = medicamento.dataValidade ? verificarValidade(medicamento.dataValidade) : null;

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Medicamento"
      size="lg"
    >
      <div className="space-y-6">
        {/* Informações Principais */}
        <div className="bg-dpsp-light-blue/10 rounded-lg p-4 border border-dpsp-light-blue/20">
          <h4 className="font-semibold text-dpsp-dark-blue mb-3 flex items-center gap-2">
            <span>💊</span> Informações do Medicamento
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Nome</p>
              <p className="text-sm font-medium text-gray-900">{medicamento.nome}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Categoria</p>
              <p className="text-sm font-medium text-gray-900">{medicamento.categoriaNome}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-gray-500 mb-1">Descrição</p>
              <p className="text-sm text-gray-900">{medicamento.descricao || 'Sem descrição'}</p>
            </div>
          </div>
        </div>

        {/* Preço e Estoque */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>💰</span> Preço e Estoque
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Preço Unitário</p>
              <p className="text-lg font-bold text-dpsp-dark-blue">
                R$ {medicamento.preco.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Quantidade em Estoque</p>
              <p className={`text-lg font-bold ${
                medicamento.quantidadeEstoque === 0 
                  ? 'text-red-600' 
                  : medicamento.quantidadeEstoque < 10 
                    ? 'text-yellow-600' 
                    : 'text-green-600'
              }`}>
                {medicamento.quantidadeEstoque} unidades
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                medicamento.ativo 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {medicamento.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        </div>

        {/* Validade */}
        {medicamento.dataValidade && (
          <div className={`rounded-lg p-4 border ${
            validadeInfo?.cor === 'red' 
              ? 'bg-red-50 border-red-200' 
              : validadeInfo?.cor === 'yellow'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-green-50 border-green-200'
          }`}>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>📅</span> Validade
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Data de Validade</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(medicamento.dataValidade).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                {validadeInfo && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    validadeInfo.cor === 'red'
                      ? 'bg-red-100 text-red-800'
                      : validadeInfo.cor === 'yellow'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {validadeInfo.status === 'vencido' 
                      ? `Vencido há ${validadeInfo.dias} dias`
                      : validadeInfo.status === 'proximo'
                        ? `Vence em ${validadeInfo.dias} dias`
                        : `Válido por mais ${validadeInfo.dias} dias`
                    }
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Informações do Sistema */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>📋</span> Informações do Sistema
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">ID do Medicamento</p>
              <p className="text-sm font-medium text-gray-900">#{medicamento.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Categoria ID</p>
              <p className="text-sm font-medium text-gray-900">#{medicamento.categoriaId}</p>
            </div>
          </div>
        </div>
      </div>
    </DetailModal>
  );
};

export default MedicamentoDetails;

