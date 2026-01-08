import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useVendas } from '../hooks/useVendas';
import { useClientes } from '../hooks/useClientes';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ErrorMessage } from '../components/ErrorMessage';
import { Link } from 'react-router-dom';

const AnaliseVendas: React.FC = () => {
  const { data: vendas, isLoading: loadingVendas, error: errorVendas } = useVendas();
  const { data: clientes, isLoading: loadingClientes } = useClientes();
  const [periodo, setPeriodo] = useState<'7' | '30' | '90' | '365'>('30');

  // Estatísticas de vendas
  const estatisticasVendas = useMemo(() => {
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

  // Top clientes
  const topClientes = useMemo(() => {
    if (!vendas || !clientes || vendas.length === 0) return [];

    const clientesVendas: Record<number, { nome: string; quantidade: number; valorTotal: number }> = {};

    vendas.forEach(venda => {
      if (!clientesVendas[venda.clienteId]) {
        const cliente = clientes.find(c => c.id === venda.clienteId);
        clientesVendas[venda.clienteId] = {
          nome: cliente?.nome || 'Cliente Desconhecido',
          quantidade: 0,
          valorTotal: 0,
        };
      }
      clientesVendas[venda.clienteId].quantidade += 1;
      clientesVendas[venda.clienteId].valorTotal += venda.valorTotal;
    });

    return Object.values(clientesVendas)
      .sort((a, b) => b.valorTotal - a.valorTotal)
      .slice(0, 10)
      .map(cliente => ({
        nome: cliente.nome.length > 25 ? cliente.nome.substring(0, 25) + '...' : cliente.nome,
        quantidade: cliente.quantidade,
        valorTotal: cliente.valorTotal,
      }));
  }, [vendas, clientes]);

  // Vendas por dia da semana
  const vendasPorDiaSemana = useMemo(() => {
    if (!vendas || vendas.length === 0) return [];

    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const vendasPorDia: Record<number, { quantidade: number; valor: number }> = {};

    vendas.forEach(venda => {
      const data = new Date(venda.dataVenda);
      const diaSemana = data.getDay();
      
      if (!vendasPorDia[diaSemana]) {
        vendasPorDia[diaSemana] = { quantidade: 0, valor: 0 };
      }
      vendasPorDia[diaSemana].quantidade += 1;
      vendasPorDia[diaSemana].valor += venda.valorTotal;
    });

    return diasSemana.map((dia, index) => ({
      dia,
      quantidade: vendasPorDia[index]?.quantidade || 0,
      valor: vendasPorDia[index]?.valor || 0,
    }));
  }, [vendas]);

  const COLORS = ['#1e3a8a', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'];

  if (loadingVendas || loadingClientes) {
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Análise de Vendas e Clientes</h1>
          <p className="text-sm sm:text-base text-gray-500">Análise detalhada de vendas e comportamento dos clientes</p>
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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total de Vendas</p>
          <p className="text-3xl font-bold text-gray-900">{estatisticasVendas.totalVendas}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Valor Total</p>
          <p className="text-3xl font-bold text-dpsp-dark-blue">R$ {estatisticasVendas.valorTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Ticket Médio</p>
          <p className="text-3xl font-bold text-gray-900">R$ {estatisticasVendas.mediaVenda.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total de Clientes</p>
          <p className="text-3xl font-bold text-gray-900">{clientes?.length || 0}</p>
        </div>
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

      {/* Top 10 Clientes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top 10 Clientes por Valor</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topClientes}>
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
                  return [`${value} compras`, 'Quantidade'];
                }
                return [`R$ ${value.toFixed(2)}`, 'Valor Total'];
              }}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="quantidade" fill="#1e3a8a" name="Número de Compras" radius={[8, 8, 0, 0]} />
            <Bar dataKey="valorTotal" fill="#60a5fa" name="Valor Total (R$)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Vendas por Dia da Semana */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Vendas por Dia da Semana</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendasPorDiaSemana}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
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
              <Bar dataKey="quantidade" fill="#1e3a8a" name="Quantidade" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Distribuição de Clientes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topClientes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="valorTotal"
              >
                {topClientes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnaliseVendas;

