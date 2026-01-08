import React from 'react';
import { MovimentacaoResponseDTO } from '../dtos/estoque.dto';
import DetailModal from './DetailModal';

interface MovimentacaoDetailsProps {
  movimentacao: MovimentacaoResponseDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovimentacaoDetails: React.FC<MovimentacaoDetailsProps> = ({ movimentacao, isOpen, onClose }) => {
  if (!movimentacao) return null;

  const formatarDataHora = (dataHora: string) => {
    try {
      const date = new Date(dataHora);
      return {
        data: date.toLocaleDateString('pt-BR'),
        hora: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        completo: date.toLocaleString('pt-BR')
      };
    } catch {
      return {
        data: dataHora,
        hora: '',
        completo: dataHora
      };
    }
  };

  const dataHoraFormatada = formatarDataHora(movimentacao.dataHora);

  // Analisa a observação para identificar o tipo de transação
  const analisarTransacao = (observacao: string) => {
    if (!observacao) {
      return { tipo: 'Manual', descricao: 'Movimentação manual de estoque', cor: 'blue' };
    }

    const obsLower = observacao.toLowerCase();
    
    // Detecção de venda (formato: "Venda - Cliente: [nome]")
    if (obsLower.includes('venda')) {
      // Extrai informações da venda se disponível
      const clienteMatch = observacao.match(/[Cc]liente:\s*([^|,\n]+)/);
      const cliente = clienteMatch ? clienteMatch[1].trim() : null;
      
      return {
        tipo: 'Venda',
        descricao: cliente ? `Venda para cliente: ${cliente}` : 'Venda realizada',
        cor: 'green',
        cliente
      };
    }

    // Detecção de reposição
    if (obsLower.includes('reposição') || obsLower.includes('reposicao') || obsLower.includes('compra') || obsLower.includes('fornecedor')) {
      return {
        tipo: 'Reposição',
        descricao: 'Reposição de estoque',
        cor: 'blue'
      };
    }

    // Detecção de ajuste
    if (obsLower.includes('ajuste') || obsLower.includes('inventário') || obsLower.includes('inventario') || obsLower.includes('contagem')) {
      return {
        tipo: 'Ajuste',
        descricao: 'Ajuste de inventário',
        cor: 'yellow'
      };
    }

    // Se contém "Cliente:" mas não "Venda", ainda pode ser relacionado a venda
    if (obsLower.includes('cliente:')) {
      const clienteMatch = observacao.match(/[Cc]liente:\s*([^|,\n]+)/);
      const cliente = clienteMatch ? clienteMatch[1].trim() : null;
      return {
        tipo: 'Venda',
        descricao: cliente ? `Venda para cliente: ${cliente}` : 'Movimentação relacionada a cliente',
        cor: 'green',
        cliente
      };
    }

    return {
      tipo: 'Outro',
      descricao: observacao,
      cor: 'gray'
    };
  };

  const transacao = analisarTransacao(movimentacao.observacao || '');

  const getTipoCor = (tipo: string) => {
    if (tipo === 'ENTRADA') {
      return 'bg-green-100 text-green-800 border-green-300';
    }
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getTransacaoCor = (cor: string) => {
    switch (cor) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes da Movimentação"
      size="md"
    >
      <div className="space-y-6">
        {/* Informações Principais */}
        <div className="bg-dpsp-light-blue/10 rounded-lg p-4 border border-dpsp-light-blue/20">
          <h4 className="font-semibold text-dpsp-dark-blue mb-3 flex items-center gap-2">
            <span>📦</span> Informações da Movimentação
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">ID da Movimentação</p>
              <p className="text-sm font-medium text-gray-900">#{movimentacao.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Medicamento</p>
              <p className="text-sm font-medium text-gray-900">{movimentacao.medicamentoNome}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Tipo de Movimentação</p>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getTipoCor(movimentacao.tipo)}`}>
                {movimentacao.tipo === 'ENTRADA' ? '⬆️ Entrada' : '⬇️ Saída'}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Quantidade</p>
              <p className="text-lg font-bold text-dpsp-dark-blue">
                {movimentacao.quantidade} {movimentacao.quantidade === 1 ? 'unidade' : 'unidades'}
              </p>
            </div>
          </div>
        </div>

        {/* Data e Hora */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>📅</span> Data e Hora
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Data</p>
              <p className="text-sm font-medium text-gray-900">{dataHoraFormatada.data}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Hora</p>
              <p className="text-sm font-medium text-gray-900">{dataHoraFormatada.hora || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-gray-500 mb-1">Data/Hora Completa</p>
              <p className="text-sm font-medium text-gray-900">{dataHoraFormatada.completo}</p>
            </div>
          </div>
        </div>

        {/* Tipo de Transação */}
        <div className={`rounded-lg p-4 border ${getTransacaoCor(transacao.cor)}`}>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span>🔄</span> Tipo de Transação
          </h4>
          <div className="space-y-2">
            <div>
              <p className="text-xs opacity-75 mb-1">Categoria</p>
              <p className="text-sm font-medium">{transacao.tipo}</p>
            </div>
            <div>
              <p className="text-xs opacity-75 mb-1">Descrição</p>
              <p className="text-sm font-medium">{transacao.descricao}</p>
            </div>
            {transacao.cliente && (
              <div>
                <p className="text-xs opacity-75 mb-1">Cliente</p>
                <p className="text-sm font-medium">{transacao.cliente}</p>
              </div>
            )}
          </div>
        </div>

        {/* Observações */}
        {movimentacao.observacao && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>📝</span> Observações
            </h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{movimentacao.observacao}</p>
          </div>
        )}

        {/* Resumo */}
        <div className="bg-dpsp-dark-blue/10 rounded-lg p-4 border border-dpsp-dark-blue/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Movimentação:</span>
            <span className={`text-lg font-bold ${
              movimentacao.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'
            }`}>
              {movimentacao.tipo === 'ENTRADA' ? '+' : '-'}{movimentacao.quantidade} unidades
            </span>
          </div>
        </div>
      </div>
    </DetailModal>
  );
};

export default MovimentacaoDetails;

