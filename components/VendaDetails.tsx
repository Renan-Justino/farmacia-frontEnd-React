import React from 'react';
import { VendaResponseDTO } from '../dtos/venda.dto';
import DetailModal from './DetailModal';

interface VendaDetailsProps {
  venda: VendaResponseDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

const VendaDetails: React.FC<VendaDetailsProps> = ({ venda, isOpen, onClose }) => {
  if (!venda) return null;

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes da Venda"
      size="lg"
    >
      <div className="space-y-6">
        {/* Informações da Venda */}
        <div className="bg-dpsp-light-blue/10 rounded-lg p-4 border border-dpsp-light-blue/20">
          <h4 className="font-semibold text-dpsp-dark-blue mb-3 flex items-center gap-2">
            <span>💰</span> Informações da Venda
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">ID da Venda</p>
              <p className="text-sm font-medium text-gray-900">#{venda.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Data e Hora</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(venda.dataVenda).toLocaleString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Cliente</p>
              <p className="text-sm font-medium text-gray-900">{venda.nomeCliente}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Valor Total</p>
              <p className="text-lg font-bold text-dpsp-dark-blue">
                R$ {venda.valorTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Itens da Venda */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>💊</span> Itens da Venda ({venda.itens.length})
          </h4>
          <div className="space-y-3">
            {venda.itens.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">{item.nomeMedicamento}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Quantidade</p>
                        <p className="font-medium text-gray-900">{item.quantidade} unidade(s)</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Preço Unitário</p>
                        <p className="font-medium text-gray-900">R$ {item.precoUnitario.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                    <p className="text-lg font-bold text-dpsp-dark-blue">
                      R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo */}
        <div className="bg-dpsp-dark-blue/10 rounded-lg p-4 border border-dpsp-dark-blue/20">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total da Venda:</span>
            <span className="text-2xl font-bold text-dpsp-dark-blue">
              R$ {venda.valorTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </DetailModal>
  );
};

export default VendaDetails;

