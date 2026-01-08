import React, { useState } from 'react';
import { useMedicamentos, useCreateMedicamento, useUpdateMedicamento, useCategorias, useCreateCategoria, useDeleteCategoria } from '../hooks/useMedicamentos';
import { ErrorMessage } from '../components/ErrorMessage';
import { MedicamentoRequestDTO, MedicamentoResponseDTO } from '../dtos/medicamento.dto';
import MedicamentoDetails from '../components/MedicamentoDetails';

const Medicamentos: React.FC = () => {
  const { data: medicamentos, isLoading: isLoadingMed, error: errorMed } = useMedicamentos();
  const { data: categorias, isLoading: isLoadingCat, error: errorCat } = useCategorias();
  
  const createMed = useCreateMedicamento();
  const updateMed = useUpdateMedicamento();
  const createCat = useCreateCategoria();
  const deleteCat = useDeleteCategoria();

  const [activeTab, setActiveTab] = useState<'medicamentos' | 'categorias'>('medicamentos');
  
  // Forms
  const [medForm, setMedForm] = useState<MedicamentoRequestDTO>({
    nome: '', descricao: '', preco: 0, quantidadeEstoque: 0, dataValidade: '', ativo: true, categoriaId: 0
  });
  const [catForm, setCatForm] = useState({ nome: '', descricao: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState<MedicamentoResponseDTO | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Handlers Medicamentos
  const openMedModal = (med?: any) => {
    if (med) {
      setEditingId(med.id);
      setMedForm({
        nome: med.nome,
        descricao: med.descricao,
        preco: med.preco,
        quantidadeEstoque: med.quantidadeEstoque, // Not updated via PUT usually, but field exists in request
        dataValidade: med.dataValidade,
        ativo: med.ativo,
        categoriaId: med.categoriaId
      });
    } else {
      setEditingId(null);
      setMedForm({ nome: '', descricao: '', preco: 0, quantidadeEstoque: 0, dataValidade: '', ativo: true, categoriaId: 0 });
    }
    setIsModalOpen(true);
  };

  const handleMedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Create UpdateDTO (without estoque)
        const { quantidadeEstoque, ...updateDto } = medForm;
        await updateMed.mutateAsync({ id: editingId, data: updateDto });
      } else {
        await createMed.mutateAsync(medForm);
      }
      setIsModalOpen(false);
    } catch (e) {}
  };

  // Handlers Categorias
  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCat.mutateAsync(catForm);
      setCatForm({ nome: '', descricao: '' });
    } catch(e) {}
  };

  const handleDeleteCat = async (id: number) => {
    const categoria = categorias?.find(c => c.id === id);
    if(window.confirm(`Tem certeza que deseja excluir a categoria "${categoria?.nome}"?`)) {
        try {
            await deleteCat.mutateAsync(id);
        } catch(e) {
            // Erro será tratado pelo ErrorMessage
        }
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Medicamentos</h1>
        <p className="text-gray-500">Gerencie medicamentos e categorias</p>
      </div>

      <div className="mb-6 flex space-x-1 border-b border-gray-200">
        <button 
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'medicamentos' 
              ? 'text-gray-900 border-b-2 border-gray-900' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('medicamentos')}
        >
          Medicamentos
        </button>
        <button 
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'categorias' 
              ? 'text-gray-900 border-b-2 border-gray-900' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('categorias')}
        >
          Categorias
        </button>
      </div>

      <ErrorMessage error={errorMed || errorCat || createMed.error || updateMed.error || createCat.error || deleteCat.error} />

      {activeTab === 'medicamentos' && (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={() => openMedModal()} className="btn-primary w-full sm:w-auto">+ Novo Medicamento</button>
          </div>
          {/* Tabela Desktop/Tablet */}
          <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Preço</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Estoque</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Validade</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Categoria</th>
                    <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicamentos?.map((m) => (
                    <tr 
                      key={m.id} 
                      className="hover:bg-dpsp-light-blue/10 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedMedicamento(m);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <td className="px-4 md:px-6 py-4 text-sm font-medium text-gray-900">{m.nome}</td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-600">R$ {m.preco.toFixed(2)}</td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-600">{m.quantidadeEstoque}</td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-600">{m.dataValidade}</td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-600">{m.categoriaNome}</td>
                      <td className="px-4 md:px-6 py-4 text-right text-sm font-medium">
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             openMedModal(m);
                           }} 
                           className="text-dpsp-dark-blue hover:text-dpsp-dark-blue/80 transition-colors"
                         >
                           Editar
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards Mobile */}
          <div className="md:hidden space-y-4">
            {medicamentos?.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMedicamento(m);
                  setIsDetailsOpen(true);
                }}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Nome:</span>
                    <span className="text-sm font-medium text-gray-900 text-right flex-1 ml-4">{m.nome}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Preço:</span>
                    <span className="text-sm text-gray-600 text-right flex-1 ml-4">R$ {m.preco.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Estoque:</span>
                    <span className="text-sm text-gray-600 text-right flex-1 ml-4">{m.quantidadeEstoque} unidades</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Validade:</span>
                    <span className="text-sm text-gray-600 text-right flex-1 ml-4">{m.dataValidade}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Categoria:</span>
                    <span className="text-sm text-gray-600 text-right flex-1 ml-4">{m.categoriaNome}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openMedModal(m);
                      }}
                      className="w-full text-center text-sm font-medium text-dpsp-dark-blue hover:text-dpsp-dark-blue/80 transition-colors"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'categorias' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-fit">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Nova Categoria</h3>
              <form onSubmit={handleCatSubmit} className="space-y-4">
                 <div>
                   <label className="label">Nome</label>
                   <input 
                      placeholder="Nome da categoria" 
                      className="input"
                      value={catForm.nome}
                      onChange={e => setCatForm({...catForm, nome: e.target.value})}
                      required
                   />
                 </div>
                 <div>
                   <label className="label">Descrição</label>
                   <input 
                      placeholder="Descrição" 
                      className="input"
                      value={catForm.descricao}
                      onChange={e => setCatForm({...catForm, descricao: e.target.value})}
                      required
                   />
                 </div>
                 <button className="w-full btn-primary" disabled={createCat.isPending}>
                   {createCat.isPending ? 'Adicionando...' : 'Adicionar'}
                 </button>
              </form>
           </div>
           <div className="col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
               <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-50">
                    <tr>
                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome</th>
                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Descrição</th>
                       <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                    {categorias?.map(c => (
                       <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-600">{c.id}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.nome}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{c.descricao}</td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                             <button onClick={() => handleDeleteCat(c.id)} className="text-gray-600 hover:text-red-600 transition-colors">Excluir</button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
               </table>
           </div>
        </div>
      )}

      {/* Modal Medicamento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Editar' : 'Novo'} Medicamento</h3>
            </div>
            <div className="p-6">
              <ErrorMessage error={createMed.error || updateMed.error} />
              <form onSubmit={handleMedSubmit} className="space-y-5">
               <div>
                  <label className="label">Nome</label>
                  <input 
                    required 
                    value={medForm.nome} 
                    onChange={e => setMedForm({...medForm, nome: e.target.value})} 
                    className="input" 
                    placeholder="Nome do medicamento"
                  />
               </div>
               <div>
                  <label className="label">Descrição</label>
                  <input 
                    required 
                    value={medForm.descricao} 
                    onChange={e => setMedForm({...medForm, descricao: e.target.value})} 
                    className="input" 
                    placeholder="Descrição"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="label">Preço (R$)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0.01"
                      required 
                      value={medForm.preco} 
                      onChange={e => {
                        const value = Math.max(0.01, parseFloat(e.target.value) || 0);
                        setMedForm({...medForm, preco: value});
                      }} 
                      className="input" 
                      placeholder="0.00"
                    />
                 </div>
                 <div>
                    <label className="label">Validade</label>
                    <input 
                      type="date" 
                      required 
                      min={new Date().toISOString().split('T')[0]}
                      value={medForm.dataValidade} 
                      onChange={e => setMedForm({...medForm, dataValidade: e.target.value})} 
                      className="input"
                    />
                    <p className="text-xs text-gray-500 mt-1">A data não pode ser no passado</p>
                 </div>
               </div>
               {!editingId && (
                   <div>
                    <label className="label">Estoque Inicial</label>
                    <input 
                      type="number" 
                      min="0"
                      required 
                      value={medForm.quantidadeEstoque} 
                      onChange={e => {
                        const value = Math.max(0, parseInt(e.target.value) || 0);
                        setMedForm({...medForm, quantidadeEstoque: value});
                      }} 
                      className="input" 
                      placeholder="0"
                    />
                   </div>
               )}
               <div>
                 <label className="label">Categoria</label>
                 <select 
                   required 
                   value={medForm.categoriaId} 
                   onChange={e => setMedForm({...medForm, categoriaId: parseInt(e.target.value)})} 
                   className="input"
                 >
                    <option value={0}>Selecione...</option>
                    {categorias?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                 </select>
               </div>
               <div className="flex items-center">
                 <input 
                   type="checkbox" 
                   checked={medForm.ativo} 
                   onChange={e => setMedForm({...medForm, ativo: e.target.checked})} 
                   className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                 />
                 <label className="ml-2 text-sm text-gray-700">Ativo</label>
                 {!editingId && (
                   <p className="ml-4 text-xs text-gray-500">Novos medicamentos devem ser criados como ativos</p>
                 )}
               </div>
               <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                 <button 
                   type="button" 
                   onClick={() => setIsModalOpen(false)} 
                   className="btn-secondary"
                 >
                   Cancelar
                 </button>
                 <button 
                   type="submit" 
                   disabled={createMed.isPending || updateMed.isPending}
                   className="btn-primary"
                 >
                   {createMed.isPending || updateMed.isPending ? 'Salvando...' : 'Salvar'}
                 </button>
               </div>
            </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      <MedicamentoDetails
        medicamento={selectedMedicamento}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default Medicamentos;
