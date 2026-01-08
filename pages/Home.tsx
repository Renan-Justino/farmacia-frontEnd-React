import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useClientes } from '../hooks/useClientes';
import { useMedicamentos } from '../hooks/useMedicamentos';
import { useVendas } from '../hooks/useVendas';
import { alertasApi } from '../api/alertas.api';
import { ErrorMessage } from '../components/ErrorMessage';
import { Link } from 'react-router-dom';
import VendaDetails from '../components/VendaDetails';
import { VendaResponseDTO } from '../dtos/venda.dto';
import Icon from '../components/Icon';

const Home: React.FC = () => {
  const { data: clientes, isLoading: loadingClientes, error: errorClientes } = useClientes();
  const { data: medicamentos, isLoading: loadingMedicamentos, error: errorMedicamentos } = useMedicamentos();
  const { data: vendas, isLoading: loadingVendas, error: errorVendas } = useVendas();
  const [selectedVenda, setSelectedVenda] = useState<VendaResponseDTO | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { data: estoqueBaixo, isLoading: loadingEstoqueBaixo } = useQuery({
    queryKey: ['alertaEstoque'],
    queryFn: () => alertasApi.getEstoqueBaixo(),
  });

  const { data: validadeProxima, isLoading: loadingValidadeProxima } = useQuery({
    queryKey: ['alertaValidade'],
    queryFn: () => alertasApi.getValidadeProxima(),
  });

  const isLoading = loadingClientes || loadingMedicamentos || loadingVendas || loadingEstoqueBaixo || loadingValidadeProxima;
  const error = errorClientes || errorMedicamentos || errorVendas;

  // Calcular estatísticas
  const totalClientes = clientes?.length || 0;
  const totalMedicamentos = medicamentos?.length || 0;
  const totalMedicamentosAtivos = medicamentos?.filter(m => m.ativo).length || 0;
  const totalVendas = vendas?.length || 0;
  const valorTotalVendas = vendas?.reduce((acc, v) => acc + v.valorTotal, 0) || 0;
  const totalEstoqueBaixo = estoqueBaixo?.length || 0;
  const totalValidadeProxima = validadeProxima?.length || 0;

  // Vendas do mês atual
  const vendasMesAtual = vendas?.filter(v => {
    const dataVenda = new Date(v.dataVenda);
    const hoje = new Date();
    return dataVenda.getMonth() === hoje.getMonth() && dataVenda.getFullYear() === hoje.getFullYear();
  }).length || 0;

  const valorVendasMesAtual = vendas?.filter(v => {
    const dataVenda = new Date(v.dataVenda);
    const hoje = new Date();
    return dataVenda.getMonth() === hoje.getMonth() && dataVenda.getFullYear() === hoje.getFullYear();
  }).reduce((acc, v) => acc + v.valorTotal, 0) || 0;

  // Identificar medicamento mais vendido
  const medicamentoMaisVendidoId = useMemo(() => {
    if (!vendas || vendas.length === 0) return null;

    const medicamentosVendidos: Record<number, number> = {};
    vendas.forEach(venda => {
      venda.itens.forEach(item => {
        medicamentosVendidos[item.medicamentoId] = (medicamentosVendidos[item.medicamentoId] || 0) + item.quantidade;
      });
    });

    const medicamentoMaisVendido = Object.entries(medicamentosVendidos)
      .sort(([, a], [, b]) => b - a)[0];

    return medicamentoMaisVendido ? Number(medicamentoMaisVendido[0]) : null;
  }, [vendas]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-500">Visão geral do sistema</p>
      </div>

      <ErrorMessage error={error} />

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total de Clientes</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalClientes}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Icon name="users" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
          <Link to="/clientes" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Ver todos →
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Medicamentos Ativos</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalMedicamentosAtivos}</p>
              <p className="text-xs text-gray-500 mt-1">de {totalMedicamentos} total</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Icon name="pill" className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
          <Link to="/medicamentos" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Gerenciar →
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total de Vendas</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalVendas}</p>
              <p className="text-xs text-gray-500 mt-1">R$ {valorTotalVendas.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Icon name="shopping" className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
          <Link to="/vendas" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Ver vendas →
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Vendas do Mês</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{vendasMesAtual}</p>
              <p className="text-xs text-gray-500 mt-1">R$ {valorVendasMesAtual.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Icon name="money" className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            </div>
          </div>
          <Link to="/vendas" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Ver detalhes →
          </Link>
        </div>
      </div>

      {/* Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerta Estoque Baixo */}
        <div className="bg-white rounded-lg border-l-4 border-gray-400 border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <Icon name="alert" className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
              Estoque Baixo
            </h2>
            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
              {totalEstoqueBaixo} {totalEstoqueBaixo === 1 ? 'item' : 'itens'}
            </span>
          </div>
          
          {totalEstoqueBaixo === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum medicamento com estoque baixo no momento.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {estoqueBaixo?.slice(0, 5).map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{med.nome}</p>
                    <p className="text-xs text-gray-500">Categoria: {med.categoriaNome}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{med.quantidadeEstoque}</p>
                    <p className="text-xs text-gray-500">unidades</p>
                  </div>
                </div>
              ))}
              {totalEstoqueBaixo > 5 && (
                <Link
                  to="/estoque"
                  className="block text-center text-sm text-gray-600 hover:text-gray-900 font-medium pt-2 transition-colors"
                >
                  Ver todos os alertas ({totalEstoqueBaixo}) →
                </Link>
              )}
            </div>
          )}
          <Link
            to="/estoque"
            className="mt-4 inline-block text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Gerenciar Estoque →
          </Link>
        </div>

        {/* Alerta Validade Próxima */}
        <div className="bg-white rounded-lg border-l-4 border-gray-400 border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">📅</span>
              Validade Próxima
            </h2>
            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
              {totalValidadeProxima} {totalValidadeProxima === 1 ? 'item' : 'itens'}
            </span>
          </div>
          
          {totalValidadeProxima === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum medicamento próximo do vencimento.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {validadeProxima?.slice(0, 5).map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{med.nome}</p>
                    <p className="text-xs text-gray-500">Categoria: {med.categoriaNome}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{med.dataValidade}</p>
                    <p className="text-xs text-gray-500">vencimento</p>
                  </div>
                </div>
              ))}
              {totalValidadeProxima > 5 && (
                <Link
                  to="/estoque"
                  className="block text-center text-sm text-gray-600 hover:text-gray-900 font-medium pt-2 transition-colors"
                >
                  Ver todos os alertas ({totalValidadeProxima}) →
                </Link>
              )}
            </div>
          )}
          <Link
            to="/estoque"
            className="mt-4 inline-block text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Gerenciar Estoque →
          </Link>
        </div>
      </div>

      {/* Análise de Dados - Cards Clicáveis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link to="/analise-vendas" className="block relative group h-full">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-xl hover:border-dpsp-dark-blue transition-all cursor-pointer relative overflow-hidden h-full flex flex-col">
            {/* Mensagem hover */}
            <div className="absolute inset-0 bg-dpsp-dark-blue/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-lg">
              <div className="text-center text-white px-4">
                <p className="text-2xl mb-2">👆</p>
                <p className="text-lg font-bold">Clique para ver análises de vendas!</p>
                <p className="text-sm mt-1 opacity-90">Análise detalhada de vendas e clientes</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-dpsp-dark-blue transition-colors">
                📊 Análise de Vendas
              </h3>
              <span className="text-dpsp-dark-blue group-hover:translate-x-1 transition-transform">→</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 flex-grow">
              Visualize análises de vendas, top clientes, vendas por período e comportamento de compra.
            </p>

            {/* Prévia - Estatísticas de Vendas */}
            <div className="bg-dpsp-light-blue/10 rounded-lg p-4 border border-dpsp-light-blue/20 mt-auto">
              <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                <Icon name="dashboard" className="w-3 h-3" />
                Resumo de Vendas
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Total de Vendas</p>
                  <p className="font-bold text-dpsp-dark-blue text-lg">{totalVendas}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Valor Total</p>
                  <p className="font-bold text-dpsp-dark-blue text-lg">R$ {valorTotalVendas.toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Ticket Médio</p>
                  <p className="font-bold text-gray-900">
                    {totalVendas > 0 ? `R$ ${(valorTotalVendas / totalVendas).toFixed(0)}` : 'R$ 0'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Total de Clientes</p>
                  <p className="font-bold text-gray-900">{clientes?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/estrategia-medicamentos" className="block relative group h-full">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-xl hover:border-dpsp-dark-blue transition-all cursor-pointer relative overflow-hidden h-full flex flex-col">
            {/* Mensagem hover */}
            <div className="absolute inset-0 bg-dpsp-dark-blue/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-lg">
              <div className="text-center text-white px-4">
                <Icon name="pill" className="w-8 h-8 mx-auto mb-2 text-white" />
                <p className="text-base sm:text-lg font-bold">Clique para ver estratégias!</p>
                <p className="text-xs sm:text-sm mt-1 opacity-90">Análise de vendas e medicamentos para sugestões estratégicas</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-dpsp-dark-blue transition-colors flex items-center gap-2">
                <Icon name="pill" className="w-5 h-5 text-purple-600" />
                Estratégia de Medicamentos
              </h3>
              <span className="text-dpsp-dark-blue group-hover:translate-x-1 transition-transform">→</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 flex-grow">
              Acesse análises de medicamentos, sugestões de estratégia, estoque e rotatividade.
            </p>

            {/* Prévia - Medicamento Mais Vendido */}
            <div className="mt-auto">
            {medicamentoMaisVendidoId && (() => {
              const medicamento = medicamentos?.find(m => m.id === medicamentoMaisVendidoId);
              if (!medicamento) return null;
              
              // Calcular quantidade vendida
              const quantidadeVendida = vendas?.reduce((acc, v) => {
                const item = v.itens.find(i => i.medicamentoId === medicamentoMaisVendidoId);
                return acc + (item?.quantidade || 0);
              }, 0) || 0;

              return (
                <div className="bg-dpsp-light-blue/10 rounded-lg p-4 border border-dpsp-light-blue/20">
                  <p className="text-xs text-gray-500 mb-2">🏆 Medicamento Mais Vendido</p>
                  <p className="font-semibold text-gray-900 mb-2 text-sm">{medicamento.nome.length > 30 ? medicamento.nome.substring(0, 30) + '...' : medicamento.nome}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Vendido</p>
                      <p className="font-bold text-dpsp-dark-blue">{quantidadeVendida} un</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Estoque</p>
                      <p className={`font-bold ${medicamento.quantidadeEstoque < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {medicamento.quantidadeEstoque} un
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {!medicamentoMaisVendidoId && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-500">Nenhuma venda registrada ainda</p>
              </div>
            )}
            </div>
          </div>
        </Link>
      </div>

      {/* Vendas Recentes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Vendas Recentes</h2>
          <Link to="/vendas" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Ver todas →
          </Link>
        </div>
        
        {totalVendas === 0 ? (
          <p className="text-gray-500 text-sm">Nenhuma venda registrada ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Itens</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendas?.slice(0, 5).map((venda) => (
                  <tr 
                    key={venda.id} 
                    className="hover:bg-dpsp-light-blue/10 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedVenda(venda);
                      setIsDetailsOpen(true);
                    }}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">#{venda.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(venda.dataVenda).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{venda.nomeCliente}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      R$ {venda.valorTotal.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {venda.itens.length} {venda.itens.length === 1 ? 'item' : 'itens'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalhes da Venda */}
      {isDetailsOpen && selectedVenda && (
        <VendaDetails
          venda={selectedVenda}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedVenda(null);
          }}
        />
      )}
    </div>
  );
};

export default Home;
