import React, { useState } from 'react';
import { useClientes, useCreateCliente, useUpdateCliente } from '../hooks/useClientes';
import { ErrorMessage } from '../components/ErrorMessage';
import { FieldError } from '../components/FieldError';
import { ClienteRequestDTO, ClienteResponseDTO } from '../dtos/cliente.dto';
import ClienteDetails from '../components/ClienteDetails';

const Clientes: React.FC = () => {
  const { data: clientes, isLoading, error } = useClientes();
  const createMutation = useCreateCliente();
  const updateMutation = useUpdateCliente();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<ClienteResponseDTO | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const initialForm: ClienteRequestDTO = { nome: '', cpf: '', email: '', dataNascimento: '' };
  const [formData, setFormData] = useState<ClienteRequestDTO>(initialForm);

  const handleEdit = (cliente: ClienteResponseDTO) => {
    setEditingId(cliente.id);
    setFormData({
      nome: cliente.nome,
      cpf: cliente.cpf,
      email: cliente.email,
      dataNascimento: cliente.dataNascimento,
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      // Error handled by mutation state, displayed via ErrorMessage below if needed
    }
  };

  const mutationError = createMutation.error || updateMutation.error;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Clientes</h1>
          <p className="text-sm sm:text-base text-gray-500">Gerencie o cadastro de clientes</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary w-full sm:w-auto"
        >
          + Novo Cliente
        </button>
      </div>

      <ErrorMessage error={error} />

      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center">
          <p className="text-gray-500">Carregando...</p>
        </div>
      ) : (
        <>
          {/* Tabela Desktop/Tablet */}
          <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">CPF</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nascimento</th>
                    <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientes?.map((cliente) => (
                    <tr 
                      key={cliente.id} 
                      className="hover:bg-dpsp-light-blue/10 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedCliente(cliente);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <td className="px-4 md:px-6 py-4 text-sm font-medium text-gray-900">{cliente.nome}</td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-600">{cliente.cpf}</td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-600">{cliente.email}</td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-600">{cliente.dataNascimento}</td>
                      <td className="px-4 md:px-6 py-4 text-right text-sm font-medium">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(cliente);
                          }}
                          className="text-dpsp-dark-blue hover:text-dpsp-dark-blue/80 font-medium transition-colors"
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
            {clientes?.map((cliente) => (
              <div
                key={cliente.id}
                onClick={() => {
                  setSelectedCliente(cliente);
                  setIsDetailsOpen(true);
                }}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Nome:</span>
                    <span className="text-sm font-medium text-gray-900 text-right flex-1 ml-4">{cliente.nome}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-gray-500 uppercase">CPF:</span>
                    <span className="text-sm text-gray-600 text-right flex-1 ml-4">{cliente.cpf}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Email:</span>
                    <span className="text-sm text-gray-600 text-right flex-1 ml-4 break-words">{cliente.email}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Nascimento:</span>
                    <span className="text-sm text-gray-600 text-right flex-1 ml-4">{cliente.dataNascimento}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(cliente);
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Editar' : 'Novo'} Cliente</h3>
            </div>
            <div className="p-6">
              <ErrorMessage error={mutationError} />
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Nome</label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                    className="input"
                    placeholder="Nome completo"
                  />
                  <FieldError error={mutationError} fieldName="nome" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">CPF</label>
                    <input
                      type="text"
                      required
                      maxLength={11}
                      pattern="[0-9]{11}"
                      value={formData.cpf}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, ''); // Remove não-números
                        setFormData({ ...formData, cpf: value });
                      }}
                      className="input"
                      placeholder="00000000000"
                    />
                    <FieldError error={mutationError} fieldName="cpf" />
                    <p className="text-xs text-gray-500 mt-1">Apenas números (11 dígitos)</p>
                  </div>
                  <div>
                    <label className="label">Nascimento</label>
                    <input
                      type="date"
                      required
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.dataNascimento}
                      onChange={e => setFormData({ ...formData, dataNascimento: e.target.value })}
                      className="input"
                    />
                    <FieldError error={mutationError} fieldName="dataNascimento" />
                    <p className="text-xs text-gray-500 mt-1">Cliente deve ter 18+ anos</p>
                  </div>
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    placeholder="email@exemplo.com"
                  />
                  <FieldError error={mutationError} fieldName="email" />
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
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="btn-primary"
                  >
                    {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      <ClienteDetails
        cliente={selectedCliente}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default Clientes;
