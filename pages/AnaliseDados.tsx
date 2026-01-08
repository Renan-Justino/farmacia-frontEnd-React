import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useVendas } from '../hooks/useVendas';
import { useMedicamentos } from '../hooks/useMedicamentos';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { VendaResponseDTO } from '../dtos/venda.dto';
import { ErrorMessage } from '../components/ErrorMessage';
import { Link } from 'react-router-dom';

const AnaliseDados: React.FC = () => {
  const { data: vendas, isLoading: loadingVendas, error: errorVendas } = useVendas();
  const { data: medicamentos, isLoading: loadingMedicamentos } = useMedicamentos();
  const [periodo, setPeriodo] = useState<'7' | '30' | '90' | '365'>('30');
  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState<number | null>(null);

  // Calcular medicamento mais vendido
  const medicamentoMaisVendido = useMemo(() => {
    if (!vendas || vendas.length === 0) return null;

    const medicamentosVendidos: Record<number, { nome: string; quantidade: number; valorTotal: number; id: number }> = {};

    vendas.forEach(venda => {
      venda.itens.forEach(item => {
        if (!medicamentosVendidos[item.medicamentoId]) {
          medicamentosVendidos[item.medicamentoId] = {
            id: item.medicamentoId,
            nome: item.nomeMedicamento,
            quantidade: 0,
            valorTotal: 0,
          };
        }
        medicamentosVendidos[item.medicamentoId].quantidade += item.quantidade;
        medicamentosVendidos[item.medicamentoId].valorTotal += item.precoUnitario * item.quantidade;
      });
    });

    const medicamento = Object.values(medicamentosVendidos)
      .sort((a, b) => b.quantidade - a.quantidade)[0];

    return medicamento || null;
  }, [vendas]);

  // Top 10 medicamentos
  const top10Medicamentos = useMemo(() => {
    if (!vendas || vendas.length === 0) return [];

    const medicamentosVendidos: Record<number, { nome: string; quantidade: number; valorTotal: number }> = {};

    vendas.forEach(venda => {
      venda.itens.forEach(item => {
        if (!medicamentosVendidos[item.medicamentoId]) {
          medicamentosVendidos[item.medicamentoId] = {
            nome: item.nomeMedicamento,
            quantidade: 0,
            valorTotal: 0,
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
        nome: med.nome.length > 30 ? med.nome.substring(0, 30) + '...' : med.nome,
        quantidade: med.quantidade,
        valorTotal: med.valorTotal,
      }));
  }, [vendas]);

  // Vendas por período
  const vendasPorPeriodo = useMemo(() => {
    if (!vendas || vendas.length === 0) return [];

    const hoje = new Date();
    const diasAtras = parseInt(periodo);
    const dataLimite = new Date(hoje);
    dataLimite.setDate(dataLimite.getDate() - diasAtras);

    const vendasFiltradas = vendas.filter(v => {
      const dataVenda = new Date(v.dataVenda);
      return dataVenda >= dataLimite;
    });

    // Agrupar por data
    const vendasPorData: Record<string, { quantidade: number; valor: number }> = {};

    vendasFiltradas.forEach(venda => {
      const data = new Date(venda.dataVenda).toLocaleDateString('pt-BR');
      if (!vendasPorData[data]) {
        vendasPorData[data] = { quantidade: 0, valor: 0 };
      }
      vendasPorData[data].quantidade += 1;
      vendasPorData[data].valor += venda.valorTotal;
    });

    return Object.entries(vendasPorData)
      .sort(([a], [b]) => new Date(a.split('/').reverse().join('-')).getTime() - new Date(b.split('/').reverse().join('-')).getTime())
      .map(([data, info]) => ({
        data,
        quantidade: info.quantidade,
        valor: info.valor,
      }));
  }, [vendas, periodo]);

  // Estatísticas gerais
  const estatisticas = useMemo(() => {
    if (!vendas || vendas.length === 0) {
      return {
        totalVendas: 0,
        valorTotal: 0,
        mediaVenda: 0,
        totalItens: 0,
      };
    }

    const totalVendas = vendas.length;
    const valorTotal = vendas.reduce((acc, v) => acc + v.valorTotal, 0);
    const totalItens = vendas.reduce((acc, v) => acc + v.itens.length, 0);

    return {
      totalVendas,
      valorTotal,
      mediaVenda: valorTotal / totalVendas,
      totalItens,
    };
  }, [vendas]);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Análise de Dados</h1>
          <p className="text-gray-500">Visão detalhada e análises do sistema</p>
        </div>
        <Link
          to="/home"
          className="text-sm text-dpsp-dark-blue hover:text-dpsp-dark-blue/80 font-medium transition-colors"
        >
          ← Voltar ao Dashboard
        </Link>
      </div>

      <ErrorMessage error={errorVendas} />

      {/* Resumo Estatístico */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total de Vendas</p>
          <p className="text-3xl font-bold text-gray-900">{estatisticas.totalVendas}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Valor Total</p>
          <p className="text-3xl font-bold text-dpsp-dark-blue">R$ {estatisticas.valorTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Ticket Médio</p>
          <p className="text-3xl font-bold text-gray-900">R$ {estatisticas.mediaVenda.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total de Itens</p>
          <p className="text-3xl font-bold text-gray-900">{estatisticas.totalItens}</p>
        </div>
      </div>

      {/* Medicamento Mais Vendido - Destaque */}
      {medicamentoMaisVendido && (
        <div className="bg-gradient-to-r from-dpsp-dark-blue to-dpsp-light-blue rounded-lg border border-gray-200 p-6 shadow-sm text-white">
          <h2 className="text-xl font-bold mb-4">🏆 Medicamento Mais Vendido</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm opacity-90 mb-1">Medicamento</p>
              <p className="text-2xl font-bold">{medicamentoMaisVendido.nome}</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Quantidade Vendida</p>
              <p className="text-2xl font-bold">{medicamentoMaisVendido.quantidade} unidades</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Valor Total Gerado</p>
              <p className="text-2xl font-bold">R$ {medicamentoMaisVendido.valorTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Gráfico Top 10 Medicamentos */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top 10 Medicamentos Mais Vendidos</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={top10Medicamentos}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="nome" 
              angle={-45}
              textAnchor="end"
              height={120}
              tick={{ fontSize: 11 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'quantidade') {
                  return [`${value} unidades`, 'Quantidade'];
                }
                return [`R$ ${value.toFixed(2)}`, 'Valor Total'];
              }}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="quantidade" fill="#1e3a8a" name="Quantidade (unidades)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="valorTotal" fill="#60a5fa" name="Valor Total (R$)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Vendas por Período */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Vendas por Período</h2>
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
          <LineChart data={vendasPorPeriodo}>
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
                  return [`${value} vendas`, 'Quantidade'];
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
              name="Quantidade de Vendas"
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

      {/* Gráfico de Pizza - Distribuição de Vendas */}
      {top10Medicamentos.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Distribuição por Quantidade</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={top10Medicamentos}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {top10Medicamentos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Distribuição por Valor</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={top10Medicamentos}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="valorTotal"
                >
                  {top10Medicamentos.map((entry, index) => (
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

export default AnaliseDados;

