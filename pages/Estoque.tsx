import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { estoqueApi } from '../api/estoque.api';
import { alertasApi } from '../api/alertas.api';
import { useMedicamentos } from '../hooks/useMedicamentos';
import { ErrorMessage } from '../components/ErrorMessage';
import { MovimentacaoRequestDTO, MovimentacaoResponseDTO } from '../dtos/estoque.dto';
import { MedicamentoResponseDTO } from '../dtos/medicamento.dto';
import MovimentacaoDetails from '../components/MovimentacaoDetails';
import Icon from '../components/Icon';

const Estoque: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: medicamentos } = useMedicamentos();
  
  // Alerts Queries
  const { data: validadeProxima = [] } = useQuery<MedicamentoResponseDTO[]>({ 
    queryKey: ['alertaValidade'], 
    queryFn: () => alertasApi.getValidadeProxima() 
  });
  const { data: estoqueBaixo = [] } = useQuery<MedicamentoResponseDTO[]>({ 
    queryKey: ['alertaEstoque'], 
    queryFn: () => alertasApi.getEstoqueBaixo() 
  });

  // Mutations
  const entradaMut = useMutation({ 
    mutationFn: estoqueApi.entrada, 
    onSuccess: () => {
        alert('Entrada registrada!'); 
        setForm({ ...form, quantidade: 0, observacao: '' });
        queryClient.invalidateQueries({ queryKey: ['medicamentos'] });
        queryClient.invalidateQueries({ queryKey: ['alertaEstoque'] });
    }
  });
  const saidaMut = useMutation({ 
    mutationFn: estoqueApi.saida,
    onSuccess: () => {
        alert('Saída registrada!');
        setForm({ ...form, quantidade: 0, observacao: '' });
        queryClient.invalidateQueries({ queryKey: ['medicamentos'] });
        queryClient.invalidateQueries({ queryKey: ['alertaEstoque'] });
    }
  });

  const [tipo, setTipo] = useState<'ENTRADA' | 'SAIDA'>('ENTRADA');
  const [form, setForm] = useState<MovimentacaoRequestDTO>({ medicamentoId: 0, quantidade: 0, observacao: '' });
  
  // History View
  const [selectedMedHistory, setSelectedMedHistory] = useState<number | null>(null);
  const [selectedMovimentacao, setSelectedMovimentacao] = useState<MovimentacaoResponseDTO | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { data: history } = useQuery({
    queryKey: ['historico', selectedMedHistory],
    queryFn: () => estoqueApi.getHistory(selectedMedHistory!),
    enabled: !!selectedMedHistory
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tipo === 'ENTRADA') await entradaMut.mutateAsync(form);
    else await saidaMut.mutateAsync(form);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Estoque</h1>
        <p className="text-gray-500">Gerencie movimentações e consulte alertas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Movimentação Form */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">Movimentação de Estoque</h2>
            <ErrorMessage error={entradaMut.error || saidaMut.error} />
            
            <div className="flex gap-2 mb-6">
              <button 
                  onClick={() => setTipo('ENTRADA')} 
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                    tipo === 'ENTRADA' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                  Entrada
              </button>
              <button 
                  onClick={() => setTipo('SAIDA')} 
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                    tipo === 'SAIDA' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                  Saída
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Medicamento</label>
                <select 
                  className="input" 
                  value={form.medicamentoId}
                  onChange={e => setForm({ ...form, medicamentoId: Number(e.target.value) })}
                  required
                >
                  <option value={0}>Selecione...</option>
                  {medicamentos?.filter(m => m.ativo).map(m => (
                      <option key={m.id} value={m.id}>
                        {m.nome} (Estoque: {m.quantidadeEstoque} unidades)
                      </option>
                  ))}
                </select>
                {form.medicamentoId > 0 && tipo === 'SAIDA' && (() => {
                  const medicamento = medicamentos?.find(m => m.id === form.medicamentoId);
                  if (medicamento && form.quantidade > medicamento.quantidadeEstoque) {
                    return (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <Icon name="alert" className="w-3 h-3" />
                        Estoque insuficiente. Disponível: {medicamento.quantidadeEstoque} unidades
                      </p>
                    );
                  }
                  return null;
                })()}
              </div>
              <div>
                <label className="label">Quantidade</label>
                <input 
                  type="number" 
                  min="1" 
                  className="input"
                  value={form.quantidade}
                  onChange={e => {
                    const value = Math.max(1, Number(e.target.value));
                    setForm({ ...form, quantidade: value });
                  }}
                  required
                />
                {form.medicamentoId > 0 && tipo === 'SAIDA' && (() => {
                  const medicamento = medicamentos?.find(m => m.id === form.medicamentoId);
                  if (medicamento && form.quantidade > medicamento.quantidadeEstoque) {
                    return (
                      <p className="text-xs text-red-600 mt-1">
                        A quantidade solicitada excede o estoque disponível
                      </p>
                    );
                  }
                  return null;
                })()}
              </div>
              <div>
                <label className="label">Observação</label>
                <textarea 
                  className="input"
                  rows={3}
                  value={form.observacao}
                  onChange={e => setForm({ ...form, observacao: e.target.value })}
                  placeholder="Observações sobre a movimentação (opcional)"
                />
              </div>
              <button 
                  className="w-full btn-primary"
                  type="submit"
              >
                  Confirmar {tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
              </button>
            </form>
          </div>

          {/* Historico Selector */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
             <h2 className="text-xl font-bold text-gray-900 mb-4">Consultar Histórico</h2>
             <select 
               className="input mb-4"
               onChange={e => setSelectedMedHistory(Number(e.target.value) || null)}
             >
               <option value="">Selecione um medicamento para ver histórico...</option>
               {medicamentos?.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
             </select>
             
             {history && (
               <>
                 {/* Tabela Desktop/Tablet */}
                 <div className="hidden md:block overflow-auto max-h-96 border border-gray-200 rounded-lg">
                   <table className="w-full text-sm">
                     <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 md:px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Data/Hora</th>
                          <th className="px-3 md:px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Tipo</th>
                          <th className="px-3 md:px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Quantidade</th>
                          <th className="px-3 md:px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Transação</th>
                          <th className="px-3 md:px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Observação</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-200 bg-white">
                        {history.map(h => {
                          const obsLower = (h.observacao || '').toLowerCase();
                          const isVenda = obsLower.includes('venda') || (obsLower.includes('cliente:') && !obsLower.includes('reposição'));
                          const isReposicao = obsLower.includes('reposição') || obsLower.includes('reposicao') || obsLower.includes('compra') || obsLower.includes('fornecedor');
                          const isAjuste = obsLower.includes('ajuste') || obsLower.includes('inventário') || obsLower.includes('inventario') || obsLower.includes('contagem');
                          const transacaoTipo = isVenda ? 'Venda' : isReposicao ? 'Reposição' : isAjuste ? 'Ajuste' : h.observacao ? 'Outro' : 'Manual';
                          
                          return (
                            <tr 
                              key={h.id} 
                              className="hover:bg-dpsp-light-blue/10 transition-colors cursor-pointer"
                              onClick={() => {
                                setSelectedMovimentacao(h);
                                setIsDetailsOpen(true);
                              }}
                            >
                              <td className="px-3 md:px-4 py-3 text-gray-600">
                                <div>
                                  <p className="font-medium">{new Date(h.dataHora).toLocaleDateString('pt-BR')}</p>
                                  <p className="text-xs text-gray-500">{new Date(h.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                              </td>
                              <td className="px-3 md:px-4 py-3">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                  h.tipo === 'ENTRADA' 
                                    ? 'bg-green-100 text-green-800 border-green-300' 
                                    : 'bg-red-100 text-red-800 border-red-300'
                                }`}>
                                  {h.tipo === 'ENTRADA' ? (
                                    <>
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                      </svg>
                                      Entrada
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                      </svg>
                                      Saída
                                    </>
                                  )}
                                </span>
                              </td>
                              <td className="px-3 md:px-4 py-3">
                                <span className="font-semibold text-dpsp-dark-blue">
                                  {h.quantidade} {h.quantidade === 1 ? 'un' : 'un'}
                                </span>
                              </td>
                              <td className="px-3 md:px-4 py-3">
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                  isVenda 
                                    ? 'bg-green-100 text-green-800' 
                                    : isReposicao
                                      ? 'bg-blue-100 text-blue-800'
                                      : isAjuste
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {transacaoTipo}
                                </span>
                              </td>
                              <td className="px-3 md:px-4 py-3">
                                <p className="text-xs text-gray-600 truncate max-w-xs" title={h.observacao || 'Sem observação'}>
                                  {h.observacao || '-'}
                                </p>
                              </td>
                            </tr>
                          );
                        })}
                     </tbody>
                   </table>
                 </div>

                 {/* Cards Mobile */}
                 <div className="md:hidden space-y-3 max-h-96 overflow-y-auto">
                   {history.map(h => {
                     const obsLower = (h.observacao || '').toLowerCase();
                     const isVenda = obsLower.includes('venda') || (obsLower.includes('cliente:') && !obsLower.includes('reposição'));
                     const isReposicao = obsLower.includes('reposição') || obsLower.includes('reposicao') || obsLower.includes('compra') || obsLower.includes('fornecedor');
                     const isAjuste = obsLower.includes('ajuste') || obsLower.includes('inventário') || obsLower.includes('inventario') || obsLower.includes('contagem');
                     const transacaoTipo = isVenda ? 'Venda' : isReposicao ? 'Reposição' : isAjuste ? 'Ajuste' : h.observacao ? 'Outro' : 'Manual';
                     
                     return (
                       <div
                         key={h.id}
                         onClick={() => {
                           setSelectedMovimentacao(h);
                           setIsDetailsOpen(true);
                         }}
                         className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
                       >
                         <div className="space-y-2">
                           <div className="flex justify-between items-start">
                             <span className="text-xs font-semibold text-gray-500">Data/Hora:</span>
                             <div className="text-right flex-1 ml-4">
                               <p className="text-sm font-medium">{new Date(h.dataHora).toLocaleDateString('pt-BR')}</p>
                               <p className="text-xs text-gray-500">{new Date(h.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                             </div>
                           </div>
                           <div className="flex justify-between items-center">
                             <span className="text-xs font-semibold text-gray-500">Tipo:</span>
                             <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                               h.tipo === 'ENTRADA' 
                                 ? 'bg-green-100 text-green-800 border-green-300' 
                                 : 'bg-red-100 text-red-800 border-red-300'
                             }`}>
                               {h.tipo === 'ENTRADA' ? (
                                 <>
                                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                   </svg>
                                   Entrada
                                 </>
                               ) : (
                                 <>
                                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                   </svg>
                                   Saída
                                 </>
                               )}
                             </span>
                           </div>
                           <div className="flex justify-between items-center">
                             <span className="text-xs font-semibold text-gray-500">Quantidade:</span>
                             <span className="text-sm font-semibold text-dpsp-dark-blue">
                               {h.quantidade} {h.quantidade === 1 ? 'un' : 'un'}
                             </span>
                           </div>
                           <div className="flex justify-between items-center">
                             <span className="text-xs font-semibold text-gray-500">Transação:</span>
                             <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                               isVenda 
                                 ? 'bg-green-100 text-green-800' 
                                 : isReposicao
                                   ? 'bg-blue-100 text-blue-800'
                                   : isAjuste
                                     ? 'bg-yellow-100 text-yellow-800'
                                     : 'bg-gray-100 text-gray-800'
                             }`}>
                               {transacaoTipo}
                             </span>
                           </div>
                           {h.observacao && (
                             <div className="flex justify-between items-start">
                               <span className="text-xs font-semibold text-gray-500">Observação:</span>
                               <p className="text-xs text-gray-600 text-right flex-1 ml-4 break-words">{h.observacao}</p>
                             </div>
                           )}
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </>
             )}
          </div>
        </div>

        {/* Alerts Section */}
        <div className="space-y-6">
          <div className="bg-white border-l-4 border-gray-400 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="alert" className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
              Estoque Baixo
            </h2>
            {estoqueBaixo.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum alerta.</p>
            ) : (
               <ul className="space-y-2">
                  {estoqueBaixo.map((m) => (
                      <li key={m.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <span className="font-medium text-gray-900">{m.nome}</span>
                          <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-semibold">
                              Restam: {m.quantidadeEstoque}
                          </span>
                      </li>
                  ))}
               </ul>
            )}
          </div>

          <div className="bg-white border-l-4 border-gray-400 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="alert" className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              Validade Próxima
            </h2>
            {validadeProxima.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum alerta.</p>
            ) : (
               <ul className="space-y-2">
                  {validadeProxima.map((m) => (
                      <li key={m.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <span className="font-medium text-gray-900">{m.nome}</span>
                          <span className="text-sm text-gray-600">Vence: {m.dataValidade}</span>
                      </li>
                  ))}
               </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes da Movimentação */}
      <MovimentacaoDetails
        movimentacao={selectedMovimentacao}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default Estoque;
