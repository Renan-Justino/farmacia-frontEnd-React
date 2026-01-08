import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { estoqueApi } from '../api/estoque.api';
import { MovimentacaoResponseDTO } from '../dtos/estoque.dto';
import { MedicamentoResponseDTO } from '../dtos/medicamento.dto';

interface EstoquePeriodoChartProps {
  medicamentos: MedicamentoResponseDTO[];
  medicamentoMaisVendidoId?: number;
}

const EstoquePeriodoChart: React.FC<EstoquePeriodoChartProps> = ({ medicamentos, medicamentoMaisVendidoId }) => {
  const [periodo, setPeriodo] = useState<'7' | '30' | '90'>('30');
  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState<number | null>(
    medicamentoMaisVendidoId || null
  );

  const { data: historico, isLoading } = useQuery<MovimentacaoResponseDTO[]>({
    queryKey: ['historico', medicamentoSelecionado],
    queryFn: () => estoqueApi.getHistory(medicamentoSelecionado!),
    enabled: !!medicamentoSelecionado,
  });

  const dadosGrafico = useMemo(() => {
    if (!historico || historico.length === 0) return [];

    // Filtrar por período
    const hoje = new Date();
    const diasAtras = parseInt(periodo);
    const dataLimite = new Date(hoje);
    dataLimite.setDate(dataLimite.getDate() - diasAtras);

    const movimentacoesFiltradas = historico.filter(mov => {
      const dataMov = new Date(mov.dataHora);
      return dataMov >= dataLimite;
    });

    // Agrupar por data e calcular estoque acumulado
    const movimentacoesPorData: Record<string, { entradas: number; saidas: number }> = {};
    
    movimentacoesFiltradas.forEach(mov => {
      const data = new Date(mov.dataHora).toLocaleDateString('pt-BR');
      if (!movimentacoesPorData[data]) {
        movimentacoesPorData[data] = { entradas: 0, saidas: 0 };
      }
      if (mov.tipo === 'ENTRADA') {
        movimentacoesPorData[data].entradas += mov.quantidade;
      } else {
        movimentacoesPorData[data].saidas += mov.quantidade;
      }
    });

    // Calcular estoque acumulado
    let estoqueAtual = 0;
    const medicamento = medicamentos.find(m => m.id === medicamentoSelecionado);
    if (medicamento) {
      estoqueAtual = medicamento.quantidadeEstoque;
    }

    // Reverter para calcular estoque histórico
    const dadosOrdenados = Object.entries(movimentacoesPorData)
      .sort(([a], [b]) => new Date(a.split('/').reverse().join('-')).getTime() - new Date(b.split('/').reverse().join('-')).getTime())
      .reverse();

    let estoqueAcumulado = estoqueAtual;
    const dadosComEstoque = dadosOrdenados.map(([data, mov]) => {
      estoqueAcumulado = estoqueAcumulado - mov.entradas + mov.saidas;
      return {
        data,
        entradas: mov.entradas,
        saidas: mov.saidas,
        estoque: estoqueAcumulado,
      };
    }).reverse();

    return dadosComEstoque;
  }, [historico, periodo, medicamentos, medicamentoSelecionado]);

  const medicamentoSelecionadoNome = medicamentos.find(m => m.id === medicamentoSelecionado)?.nome || 'Selecione um medicamento';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Análise de Estoque por Período</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medicamento</label>
            <select
              className="w-full input"
              value={medicamentoSelecionado || ''}
              onChange={(e) => setMedicamentoSelecionado(Number(e.target.value) || null)}
            >
              <option value="">Selecione um medicamento...</option>
              {medicamentos?.map(med => (
                <option key={med.id} value={med.id}>
                  {med.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriodo('7')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  periodo === '7'
                    ? 'bg-dpsp-dark-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                7 dias
              </button>
              <button
                onClick={() => setPeriodo('30')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  periodo === '30'
                    ? 'bg-dpsp-dark-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                30 dias
              </button>
              <button
                onClick={() => setPeriodo('90')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  periodo === '90'
                    ? 'bg-dpsp-dark-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                90 dias
              </button>
            </div>
          </div>
        </div>
      </div>

      {!medicamentoSelecionado ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">Selecione um medicamento para ver o gráfico de estoque</p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">Carregando histórico...</p>
        </div>
      ) : dadosGrafico.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">Nenhuma movimentação registrada no período selecionado</p>
        </div>
      ) : (
        <>
          <div className="mb-4 bg-dpsp-light-blue/10 rounded-lg p-4 border border-dpsp-light-blue/20">
            <p className="text-sm text-gray-600 mb-1">Medicamento Analisado</p>
            <p className="text-lg font-bold text-dpsp-dark-blue">{medicamentoSelecionadoNome}</p>
            <p className="text-xs text-gray-500 mt-1">Período: Últimos {periodo} dias</p>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="data" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'estoque') {
                    return [`${value} unidades`, 'Estoque'];
                  }
                  if (name === 'entradas') {
                    return [`${value} unidades`, 'Entradas'];
                  }
                  if (name === 'saidas') {
                    return [`${value} unidades`, 'Saídas'];
                  }
                  return value;
                }}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="estoque" 
                stroke="#1e3a8a" 
                strokeWidth={3}
                name="Estoque (unidades)"
                dot={{ fill: '#1e3a8a', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="entradas" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Entradas (unidades)"
                dot={{ fill: '#10b981', r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="saidas" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Saídas (unidades)"
                dot={{ fill: '#ef4444', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default EstoquePeriodoChart;

