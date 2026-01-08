import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { VendaResponseDTO } from '../dtos/venda.dto';

interface MedicamentoMaisVendidoChartProps {
  vendas: VendaResponseDTO[];
}

const MedicamentoMaisVendidoChart: React.FC<MedicamentoMaisVendidoChartProps> = ({ vendas }) => {
  const dadosGrafico = useMemo(() => {
    if (!vendas || vendas.length === 0) return [];

    // Agrupar vendas por medicamento
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

    // Converter para array e ordenar por quantidade
    const medicamentosArray = Object.values(medicamentosVendidos)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10); // Top 10

    return medicamentosArray.map(med => ({
      nome: med.nome.length > 20 ? med.nome.substring(0, 20) + '...' : med.nome,
      quantidade: med.quantidade,
      valorTotal: med.valorTotal,
    }));
  }, [vendas]);

  const medicamentoMaisVendido = dadosGrafico[0];

  if (!medicamentoMaisVendido) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Medicamento Mais Vendido</h3>
        <p className="text-gray-500 text-sm">Nenhuma venda registrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Medicamento Mais Vendido</h3>
        <div className="bg-dpsp-light-blue/10 rounded-lg p-4 border border-dpsp-light-blue/20">
          <p className="text-sm text-gray-600 mb-1">Medicamento</p>
          <p className="text-xl font-bold text-dpsp-dark-blue">{medicamentoMaisVendido.nome}</p>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Quantidade Vendida</p>
              <p className="text-lg font-semibold text-gray-900">{medicamentoMaisVendido.quantidade} unidades</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Valor Total</p>
              <p className="text-lg font-semibold text-dpsp-dark-blue">R$ {medicamentoMaisVendido.valorTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Top 10 Medicamentos Mais Vendidos</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosGrafico}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="nome" 
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
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
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MedicamentoMaisVendidoChart;

