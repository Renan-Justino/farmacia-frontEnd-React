import React, { useState, useMemo } from 'react';
import { useVendas, useCreateVenda } from '../hooks/useVendas';
import { useClientes } from '../hooks/useClientes';
import { useMedicamentos } from '../hooks/useMedicamentos';
import { ErrorMessage } from '../components/ErrorMessage';
import { ItemVendaRequestDTO, VendaResponseDTO } from '../dtos/venda.dto';
import VendaDetails from '../components/VendaDetails';

const Vendas: React.FC = () => {
  const { data: vendas, isLoading, error } = useVendas();
  const { data: clientes, isLoading: loadingClientes, error: errorClientes } = useClientes();
  const { data: medicamentos, isLoading: loadingMedicamentos } = useMedicamentos();
  const createVenda = useCreateVenda();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteId, setClienteId] = useState<number>(0);
  const [itens, setItens] = useState<ItemVendaRequestDTO[]>([]);
  const [selectedVenda, setSelectedVenda] = useState<VendaResponseDTO | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Temporary item state
  const [tempMedId, setTempMedId] = useState<number>(0);
  const [tempQtd, setTempQtd] = useState<number>(1);
  
  // Filtros de busca
  const [filtroCliente, setFiltroCliente] = useState<string>('');
  const [filtroMedicamento, setFiltroMedicamento] = useState<string>('');

  const addItem = () => {
    if (tempMedId === 0) {
      return;
    }
    if (tempQtd <= 0) {
      return;
    }
    
    const medicamento = medicamentos?.find(m => m.id === tempMedId);
    if (!medicamento) {
      return;
    }
    
    // Validação de estoque antes de adicionar
    const quantidadeJaAdicionada = itens
      .filter(item => item.medicamentoId === tempMedId)
      .reduce((sum, item) => sum + item.quantidade, 0);
    
    const totalNecessario = quantidadeJaAdicionada + tempQtd;
    
    if (totalNecessario > medicamento.quantidadeEstoque) {
      // Erro será mostrado pelo ErrorMessage quando tentar salvar
      return;
    }
    
    if (!medicamento.ativo) {
      // Erro será mostrado pelo ErrorMessage quando tentar salvar
      return;
    }
    
    setItens([...itens, { medicamentoId: tempMedId, quantidade: tempQtd }]);
    setTempMedId(0);
    setTempQtd(1);
  };

  const removeItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (clienteId === 0) {
      // Validação no frontend
      return;
    }
    if (itens.length === 0) {
      // Validação no frontend - será tratada pelo backend também
      return;
    }
    
    // Validação de estoque antes de enviar
    for (const item of itens) {
      const medicamento = medicamentos?.find(m => m.id === item.medicamentoId);
      if (medicamento && !medicamento.ativo) {
        // Erro será mostrado pelo ErrorMessage
      }
      if (medicamento && item.quantidade > medicamento.quantidadeEstoque) {
        // Erro será mostrado pelo ErrorMessage
      }
    }
    
    try {
      await createVenda.mutateAsync({ clienteId, itens });
      setIsModalOpen(false);
      setClienteId(0);
      setItens([]);
      setFiltroCliente('');
      setFiltroMedicamento('');
    } catch(e) {
      // Erro será tratado pelo ErrorMessage
    }
  };

  const getMedName = (id: number) => medicamentos?.find(m => m.id === id)?.nome || 'Desconhecido';

  // Filtrar clientes e medicamentos
  const clientesFiltrados = useMemo(() => {
    if (!clientes || clientes.length === 0) return [];
    
    if (!filtroCliente.trim()) {
      // Se não há filtro, retorna todos os clientes ativos
      return clientes.filter(c => c.ativo);
    }
    
    // Aplica o filtro
    const filtroLower = filtroCliente.toLowerCase().trim();
    return clientes.filter(c => 
      c.ativo && (
        c.nome.toLowerCase().includes(filtroLower) ||
        c.cpf.replace(/\D/g, '').includes(filtroCliente.replace(/\D/g, '')) ||
        c.email.toLowerCase().includes(filtroLower)
      )
    );
  }, [clientes, filtroCliente]);

  const medicamentosFiltrados = medicamentos?.filter(m => 
    m.ativo && m.quantidadeEstoque > 0 && (
      m.nome.toLowerCase().includes(filtroMedicamento.toLowerCase()) ||
      m.categoriaNome.toLowerCase().includes(filtroMedicamento.toLowerCase())
    )
  ) || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Vendas</h1>
          <p className="text-sm sm:text-base text-gray-500">Registre e consulte vendas</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary w-full sm:w-auto">+ Nova Venda</button>
      </div>

      <ErrorMessage error={error || createVenda.error} />

      {/* Tabela Desktop/Tablet */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Data</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cliente</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Itens</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vendas?.map(v => (
                <tr 
                  key={v.id} 
                  className="hover:bg-dpsp-light-blue/10 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedVenda(v);
                    setIsDetailsOpen(true);
                  }}
                >
                  <td className="px-4 md:px-6 py-4 text-sm font-medium text-gray-900">#{v.id}</td>
                  <td className="px-4 md:px-6 py-4 text-sm text-gray-600">{new Date(v.dataVenda).toLocaleString('pt-BR')}</td>
                  <td className="px-4 md:px-6 py-4 text-sm text-gray-900">{v.nomeCliente}</td>
                  <td className="px-4 md:px-6 py-4 text-sm font-semibold text-gray-900">R$ {v.valorTotal.toFixed(2)}</td>
                  <td className="px-4 md:px-6 py-4 text-xs text-gray-500">
                    {v.itens.map(i => `${i.nomeMedicamento} (${i.quantidade})`).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards Mobile */}
      <div className="md:hidden space-y-4">
        {vendas?.map(v => (
          <div
            key={v.id}
            onClick={() => {
              setSelectedVenda(v);
              setIsDetailsOpen(true);
            }}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-gray-500 uppercase">ID:</span>
                <span className="text-sm font-medium text-gray-900 text-right flex-1 ml-4">#{v.id}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-gray-500 uppercase">Data:</span>
                <span className="text-sm text-gray-600 text-right flex-1 ml-4">{new Date(v.dataVenda).toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-gray-500 uppercase">Cliente:</span>
                <span className="text-sm text-gray-900 text-right flex-1 ml-4">{v.nomeCliente}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-gray-500 uppercase">Total:</span>
                <span className="text-sm font-semibold text-dpsp-dark-blue text-right flex-1 ml-4">R$ {v.valorTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-gray-500 uppercase">Itens:</span>
                <span className="text-xs text-gray-500 text-right flex-1 ml-4 break-words">
                  {v.itens.map(i => `${i.nomeMedicamento} (${i.quantidade})`).join(', ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Registrar Venda</h3>
            </div>
            <div className="p-6">
              <ErrorMessage error={createVenda.error} />
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="label">Cliente</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      className="input"
                      placeholder="Buscar cliente por nome, CPF ou email..."
                      value={filtroCliente}
                      onChange={e => {
                        const novoFiltro = e.target.value;
                        setFiltroCliente(novoFiltro);
                        // Limpa seleção se o cliente selecionado não corresponde ao filtro
                        if (clienteId > 0 && clientes) {
                          const clienteSelecionado = clientes.find(c => c.id === clienteId);
                          if (clienteSelecionado) {
                            const filtroLower = novoFiltro.toLowerCase().trim();
                            const corresponde = 
                              clienteSelecionado.nome.toLowerCase().includes(filtroLower) ||
                              clienteSelecionado.cpf.replace(/\D/g, '').includes(novoFiltro.replace(/\D/g, '')) ||
                              clienteSelecionado.email.toLowerCase().includes(filtroLower);
                            if (!corresponde) {
                              setClienteId(0);
                            }
                          }
                        }
                      }}
                    />
                    {loadingClientes ? (
                      <div className="input text-center text-gray-500 py-2">
                        Carregando clientes...
                      </div>
                    ) : errorClientes ? (
                      <div className="input text-center text-red-500 py-2">
                        Erro ao carregar clientes
                      </div>
                    ) : (
                      <select 
                        className="input" 
                        value={clienteId} 
                        onChange={e => setClienteId(Number(e.target.value))}
                        required
                        disabled={!clientes || clientes.length === 0}
                      >
                        <option value={0}>
                          {!clientes || clientes.length === 0 
                            ? 'Nenhum cliente cadastrado' 
                            : filtroCliente.trim()
                              ? clientesFiltrados.length === 0 
                                ? `Nenhum cliente encontrado com "${filtroCliente}"`
                                : `Selecione um cliente (${clientesFiltrados.length} encontrado${clientesFiltrados.length !== 1 ? 's' : ''})...`
                              : `Selecione um cliente (${clientes.filter(c => c.ativo).length} disponível${clientes.filter(c => c.ativo).length !== 1 ? 'is' : ''})...`}
                        </option>
                        {clientesFiltrados.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.nome} ({c.cpf})
                          </option>
                        ))}
                      </select>
                    )}
                    {!loadingClientes && !errorClientes && filtroCliente.trim() && clientesFiltrados.length === 0 && clientes && clientes.length > 0 && (
                      <p className="text-xs text-amber-600 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Nenhum cliente encontrado com "{filtroCliente}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-sm text-gray-900 mb-3">Adicionar Itens</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="Buscar medicamento por nome ou categoria..."
                      value={filtroMedicamento}
                      onChange={e => {
                        setFiltroMedicamento(e.target.value);
                        if (tempMedId > 0) {
                          const medicamentoSelecionado = medicamentos?.find(m => m.id === tempMedId);
                          if (medicamentoSelecionado && !(
                            medicamentoSelecionado.nome.toLowerCase().includes(e.target.value.toLowerCase()) ||
                            medicamentoSelecionado.categoriaNome.toLowerCase().includes(e.target.value.toLowerCase())
                          )) {
                            setTempMedId(0);
                          }
                        }
                      }}
                    />
                    <div className="flex gap-2">
                     <select 
                       className="flex-1 input" 
                       value={tempMedId} 
                       onChange={e => setTempMedId(Number(e.target.value))}
                     >
                        <option value={0}>Selecione Medicamento...</option>
                        {medicamentosFiltrados.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.nome} (R$ {m.preco.toFixed(2)}) - Estoque: {m.quantidadeEstoque}
                          </option>
                        ))}
                     </select>
                     <input 
                        type="number" 
                        className="w-24 input" 
                        min="1" 
                        value={tempQtd} 
                        onChange={e => {
                          const value = Math.max(1, Number(e.target.value) || 1);
                          setTempQtd(value);
                        }}
                        placeholder="Qtd"
                     />
                     <button 
                       type="button" 
                       onClick={addItem} 
                       className="btn-secondary px-4"
                       disabled={tempMedId === 0 || tempQtd <= 0}
                     >
                       +
                     </button>
                    </div>
                    {filtroMedicamento && medicamentosFiltrados.length === 0 && (
                      <p className="text-xs text-gray-500 mt-2">Nenhum medicamento encontrado com "{filtroMedicamento}"</p>
                    )}
                  </div>
                  {tempMedId > 0 && (() => {
                    const medicamento = medicamentos?.find(m => m.id === tempMedId);
                    const quantidadeJaAdicionada = itens
                      .filter(item => item.medicamentoId === tempMedId)
                      .reduce((sum, item) => sum + item.quantidade, 0);
                    const totalNecessario = quantidadeJaAdicionada + tempQtd;
                    
                    if (medicamento && totalNecessario > medicamento.quantidadeEstoque) {
                      return (
                        <p className="text-xs text-red-600 mt-2">
                          ⚠️ Estoque insuficiente. Disponível: {medicamento.quantidadeEstoque - quantidadeJaAdicionada} unidades
                        </p>
                      );
                    }
                    return null;
                  })()}
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-3">Carrinho</h4>
                  {itens.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        ⚠️ Adicione pelo menos um item à venda antes de finalizar.
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
                      {itens.map((item, idx) => {
                        const medicamento = medicamentos?.find(m => m.id === item.medicamentoId);
                        const quantidadeJaAdicionada = itens
                          .filter((i, iidx) => i.medicamentoId === item.medicamentoId && iidx < idx)
                          .reduce((sum, i) => sum + i.quantidade, 0);
                        const totalNecessario = quantidadeJaAdicionada + item.quantidade;
                        const temEstoque = medicamento && totalNecessario <= medicamento.quantidadeEstoque;
                        
                        return (
                          <li key={idx} className={`flex justify-between items-center p-3 text-sm hover:bg-gray-50 ${!temEstoque ? 'bg-red-50' : ''}`}>
                            <div className="flex-1">
                              <span className="text-gray-900">{getMedName(item.medicamentoId)} (x{item.quantidade})</span>
                              {!temEstoque && medicamento && (
                                <p className="text-xs text-red-600 mt-1">
                                  ⚠️ Estoque insuficiente (disponível: {medicamento.quantidadeEstoque - quantidadeJaAdicionada})
                                </p>
                              )}
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeItem(idx)} 
                              className="text-gray-600 hover:text-red-600 transition-colors ml-4"
                            >
                              Remover
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                  <button type="submit" disabled={createVenda.isPending} className="btn-primary">
                    {createVenda.isPending ? 'Processando...' : 'Finalizar Venda'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      <VendaDetails
        venda={selectedVenda}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default Vendas;
