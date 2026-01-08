import React, { useMemo, useState } from 'react';
import { useVendas } from '../hooks/useVendas';
import { useMedicamentos } from '../hooks/useMedicamentos';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ErrorMessage } from '../components/ErrorMessage';
import { Link } from 'react-router-dom';

const EstrategiaMedicamentos: React.FC = () => {
  const { data: vendas, isLoading: loadingVendas, error: errorVendas } = useVendas();
  const { data: medicamentos, isLoading: loadingMedicamentos } = useMedicamentos();
  const [periodo, setPeriodo] = useState<'7' | '30' | '90' | '365'>('30');

  // Top medicamentos vendidos
  const topMedicamentos = useMemo(() => {
    if (!vendas || vendas.length === 0) return [];

    const medicamentosVendidos: Record<number, { 
      nome: string; 
      quantidade: number; 
      valorTotal: number;
      quantidadeEstoque: number;
      preco: number;
    }> = {};

    vendas.forEach(venda => {
      venda.itens.forEach(item => {
        if (!medicamentosVendidos[item.medicamentoId]) {
          const medicamento = medicamentos?.find(m => m.id === item.medicamentoId);
          medicamentosVendidos[item.medicamentoId] = {
            nome: item.nomeMedicamento,
            quantidade: 0,
            valorTotal: 0,
            quantidadeEstoque: medicamento?.quantidadeEstoque || 0,
            preco: item.precoUnitario,
          };
        }
        medicamentosVendidos[item.medicamentoId].quantidade += item.quantidade;
        medicamentosVendidos[item.medicamentoId].valorTotal += item.precoUnitario * item.quantidade;
      });
    });

    return Object.values(medicamentosVendidos)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10)
      .map(med => ({
        nome: med.nome.length > 25 ? med.nome.substring(0, 25) + '...' : med.nome,
        quantidade: med.quantidade,
        valorTotal: med.valorTotal,
        estoque: med.quantidadeEstoque,
        preco: med.preco,
        rotatividade: med.quantidadeEstoque > 0 ? (med.quantidade / med.quantidadeEstoque) * 100 : 0,
      }));
  }, [vendas, medicamentos]);

  // Medicamento mais vendido
  const medicamentoMaisVendido = topMedicamentos[0];

  // Sugestões de estratégia
  const sugestoes = useMemo(() => {
    const sugestoes: string[] = [];

    if (!topMedicamentos.length) return sugestoes;

    // Verificar estoque baixo nos mais vendidos
    const medicamentosEstoqueBaixo = topMedicamentos.filter(m => m.estoque < 10);
    if (medicamentosEstoqueBaixo.length > 0) {
      sugestoes.push(`⚠️ ${medicamentosEstoqueBaixo.length} medicamento(s) dos mais vendidos estão com estoque baixo. Considere repor.`);
    }

    // Verificar alta rotatividade
    const altaRotatividade = topMedicamentos.filter(m => m.rotatividade > 50);
    if (altaRotatividade.length > 0) {
      sugestoes.push(`📈 ${altaRotatividade.length} medicamento(s) têm alta rotatividade. Considere aumentar o estoque.`);
    }

    // Verificar medicamentos com baixa rotatividade mas alto valor
    const baixaRotatividadeAltoValor = topMedicamentos.filter(m => m.rotatividade < 10 && m.valorTotal > 1000);
    if (baixaRotatividadeAltoValor.length > 0) {
      sugestoes.push(`💰 ${baixaRotatividadeAltoValor.length} medicamento(s) de alto valor têm baixa rotatividade. Considere promoções.`);
    }

    // Verificar medicamentos com estoque alto mas poucas vendas
    const estoqueAltoPoucasVendas = topMedicamentos.filter(m => m.estoque > 50 && m.quantidade < 5);
    if (estoqueAltoPoucasVendas.length > 0) {
      sugestoes.push(`📦 ${estoqueAltoPoucasVendas.length} medicamento(s) têm muito estoque mas poucas vendas. Considere ajustar pedidos.`);
    }

    return sugestoes;
  }, [topMedicamentos]);

  // Vendas de medicamentos por período
  const vendasMedicamentosPorPeriodo = useMemo(() => {
    if (!vendas || vendas.length === 0) return [];

    const hoje = new Date();
    const diasAtras = parseInt(periodo);
    const dataLimite = new Date(hoje);
    dataLimite.setDate(dataLimite.getDate() - diasAtras);

    const vendasFiltradas = vendas.filter(v => {
      const dataVenda = new Date(v.dataVenda);
      return dataVenda >= dataLimite;
    });

    const medicamentosPorData: Record<string, { quantidade: number; valor: number }> = {};

    vendasFiltradas.forEach(venda => {
      const data = new Date(venda.dataVenda).toLocaleDateString('pt-BR');
      if (!medicamentosPorData[data]) {
        medicamentosPorData[data] = { quantidade: 0, valor: 0 };
      }
      venda.itens.forEach(item => {
        medicamentosPorData[data].quantidade += item.quantidade;
        medicamentosPorData[data].valor += item.precoUnitario * item.quantidade;
      });
    });

    return Object.entries(medicamentosPorData)
      .sort(([a], [b]) => new Date(a.split('/').reverse().join('-')).getTime() - new Date(b.split('/').reverse().join('-')).getTime())
      .map(([data, info]) => ({
        data,
        quantidade: info.quantidade,
        valor: info.valor,
      }));
  }, [vendas, periodo]);

  const COLORS = ['#1e3a8a', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', '#1e40af', '#2563eb', '#3b82f6'];

  if (loadingVendas || loadingMedicamentos) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Estratégia de Medicamentos</h1>
          <p className="text-sm sm:text-base text-gray-500">Análise de vendas e medicamentos para sugestões estratégicas</p>
        </div>
        <Link
          to="/home"
          className="text-sm text-dpsp-dark-blue hover:text-dpsp-dark-blue/80 font-medium transition-colors"
        >
          ← Voltar ao Dashboard
        </Link>
      </div>

      <ErrorMessage error={errorVendas} />

      {/* Medicamento Mais Vendido - Destaque */}
      {medicamentoMaisVendido && (
        <div className="bg-gradient-to-r from-dpsp-dark-blue to-dpsp-light-blue rounded-lg border border-gray-200 p-6 shadow-sm text-white">
          <h2 className="text-xl font-bold mb-4">🏆 Medicamento Mais Vendido</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm opacity-90 mb-1">Medicamento</p>
              <p className="text-xl font-bold">{medicamentoMaisVendido.nome}</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Quantidade Vendida</p>
              <p className="text-xl font-bold">{medicamentoMaisVendido.quantidade} unidades</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Estoque Atual</p>
              <p className={`text-xl font-bold ${medicamentoMaisVendido.estoque < 10 ? 'text-yellow-300' : ''}`}>
                {medicamentoMaisVendido.estoque} unidades
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Valor Total</p>
              <p className="text-xl font-bold">R$ {medicamentoMaisVendido.valorTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sugestões de Estratégia */}
      {sugestoes.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Sugestões de Estratégia</h2>
          <ul className="space-y-2">
            {sugestoes.map((sugestao, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>{sugestao}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top 10 Medicamentos */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top 10 Medicamentos Mais Vendidos</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topMedicamentos}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="nome" 
              angle={-45}
              textAnchor="end"
              height={120}
              tick={{ fontSize: 11 }}
            />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'quantidade') {
                  return [`${value} unidades`, 'Quantidade Vendida'];
                }
                if (name === 'estoque') {
                  return [`${value} unidades`, 'Estoque Atual'];
                }
                return [`R$ ${value.toFixed(2)}`, 'Valor Total'];
              }}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="quantidade" fill="#1e3a8a" name="Quantidade Vendida" radius={[8, 8, 0, 0]} />
            <Bar yAxisId="right" dataKey="estoque" fill="#10b981" name="Estoque Atual" radius={[8, 8, 0, 0]} />
            <Bar yAxisId="left" dataKey="valorTotal" fill="#60a5fa" name="Valor Total (R$)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Vendas de Medicamentos por Período */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Vendas de Medicamentos por Período</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setPeriodo('7')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                periodo === '7'
                  ? 'bg-dpsp-dark-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setPeriodo('30')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                periodo === '30'
                  ? 'bg-dpsp-dark-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              30 dias
            </button>
            <button
              onClick={() => setPeriodo('90')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                periodo === '90'
                  ? 'bg-dpsp-dark-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              90 dias
            </button>
            <button
              onClick={() => setPeriodo('365')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                periodo === '365'
                  ? 'bg-dpsp-dark-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              1 ano
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={vendasMedicamentosPorPeriodo}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="data" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'quantidade') {
                  return [`${value} unidades`, 'Quantidade'];
                }
                return [`R$ ${value.toFixed(2)}`, 'Valor'];
              }}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="quantidade" 
              stroke="#1e3a8a" 
              strokeWidth={3}
              name="Quantidade de Medicamentos"
              dot={{ fill: '#1e3a8a', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="valor" 
              stroke="#60a5fa" 
              strokeWidth={3}
              name="Valor Total (R$)"
              dot={{ fill: '#60a5fa', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Distribuição de Medicamentos */}
      {topMedicamentos.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Distribuição por Quantidade Vendida</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topMedicamentos}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {topMedicamentos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Distribuição por Valor Total</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topMedicamentos}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="valorTotal"
                >
                  {topMedicamentos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstrategiaMedicamentos;

