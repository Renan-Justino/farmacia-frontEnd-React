import React, { useState, useMemo } from 'react';
import { useLogs } from '../hooks/useLogs';
import { LogEntryDTO } from '../api/logs.api';
import { ErrorMessage } from '../components/ErrorMessage';
import Icon from '../components/Icon';

const Logs: React.FC = () => {
  const [filters, setFilters] = useState({
    level: '',
    entityType: '',
    action: '',
    startDate: '',
    endDate: '',
  });

  const { data: allLogs = [], isLoading, error, refetch } = useLogs({
    level: filters.level || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  });

  // Aplicar filtros no frontend e remover logs de sistema/bugs
  const logs = useMemo(() => {
    let filtered = allLogs;
    
    // Remove logs de sistema, bugs e erros técnicos
    filtered = filtered.filter((log: LogEntryDTO) => {
      // Remove logs de erro interno do servidor
      if (log.action === 'INTERNAL_ERROR') return false;
      
      // Remove logs de validação técnica
      if (log.action?.includes('VALIDATION_ERROR') && log.level === 'WARN') {
        // Mantém apenas se for uma tentativa de operação do usuário
        return log.message?.includes('Tentativa de') || false;
      }
      
      // Remove logs de sistema genéricos
      if (log.module === 'SYSTEM' && log.level === 'ERROR') return false;
      
      // Mantém apenas operações do usuário (INFO) e tentativas bloqueadas (WARN de regras de negócio)
      return log.level === 'INFO' || 
             (log.level === 'WARN' && (
               log.action?.includes('_FAILED') || 
               log.action === 'BUSINESS_RULE_VIOLATION' ||
               log.action === 'NOT_FOUND'
             ));
    });
    
    if (filters.entityType) {
      filtered = filtered.filter((log: LogEntryDTO) => log.entityType === filters.entityType);
    }
    if (filters.action) {
      filtered = filtered.filter((log: LogEntryDTO) => log.action === filters.action);
    }
    if (filters.level) {
      filtered = filtered.filter((log: LogEntryDTO) => log.level === filters.level);
    }
    
    return filtered;
  }, [allLogs, filters.entityType, filters.action, filters.level]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'WARN':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'INFO':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'DEBUG':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR':
        return '❌';
      case 'WARN':
        return '⚠️';
      case 'INFO':
        return 'ℹ️';
      case 'DEBUG':
        return '🔍';
      default:
        return '📝';
    }
  };

  const getEntityIcon = (entityType?: string) => {
    switch (entityType) {
      case 'CLIENTE':
        return '👥';
      case 'MEDICAMENTO':
        return '💊';
      case 'ESTOQUE':
        return '📦';
      case 'VENDA':
        return '💰';
      case 'USUARIO':
        return '👤';
      case 'CATEGORIA':
        return '📁';
      case 'AUTH':
        return '🔐';
      default:
        return '📋';
    }
  };

  const getActionLabel = (action?: string) => {
    switch (action) {
      case 'CREATE':
        return 'Criar';
      case 'UPDATE':
        return 'Atualizar';
      case 'DELETE':
        return 'Excluir';
      case 'UPDATE_STATUS':
        return 'Alterar Status';
      case 'ENTRADA':
        return 'Entrada Estoque';
      case 'SAIDA':
        return 'Saída Estoque';
      case 'LOGIN':
        return 'Login';
      default:
        return action || '-';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      level: '',
      entityType: '',
      action: '',
      startDate: '',
      endDate: '',
    });
  };

  // Estatísticas
  const stats = useMemo(() => ({
    total: logs.length,
    errors: logs.filter((l: LogEntryDTO) => l.level === 'ERROR').length,
    warnings: logs.filter((l: LogEntryDTO) => l.level === 'WARN').length,
    info: logs.filter((l: LogEntryDTO) => l.level === 'INFO').length,
    byEntity: {
      CLIENTE: logs.filter((l: LogEntryDTO) => l.entityType === 'CLIENTE').length,
      MEDICAMENTO: logs.filter((l: LogEntryDTO) => l.entityType === 'MEDICAMENTO').length,
      ESTOQUE: logs.filter((l: LogEntryDTO) => l.entityType === 'ESTOQUE').length,
      VENDA: logs.filter((l: LogEntryDTO) => l.entityType === 'VENDA').length,
      USUARIO: logs.filter((l: LogEntryDTO) => l.entityType === 'USUARIO').length,
      CATEGORIA: logs.filter((l: LogEntryDTO) => l.entityType === 'CATEGORIA').length,
    },
  }), [logs]);

  // Data padrão: últimos 7 dias
  const defaultEndDate = new Date().toISOString().split('T')[0];
  const defaultStartDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Histórico de Operações</h1>
        <p className="text-gray-500">Registro de todas as operações realizadas pelos usuários</p>
      </div>

      <ErrorMessage error={error} />

      {/* Estatísticas Simplificadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total de Operações</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-lg flex items-center justify-center">
              <Icon name="log" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Operações Realizadas</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.info}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Icon name="check" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Tentativas Bloqueadas</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.warnings}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <Icon name="alert" className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros Avançados */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            Limpar Filtros
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="label">Tipo</label>
            <select
              className="input"
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
            >
              <option value="">Todas as operações</option>
              <option value="INFO">Operações Realizadas</option>
              <option value="WARN">Tentativas Bloqueadas</option>
            </select>
          </div>
          <div>
            <label className="label">Entidade</label>
            <select
              className="input"
              value={filters.entityType}
              onChange={(e) => handleFilterChange('entityType', e.target.value)}
            >
              <option value="">Todas as entidades</option>
              <option value="CLIENTE">Clientes</option>
              <option value="MEDICAMENTO">Medicamentos</option>
              <option value="ESTOQUE">Estoque</option>
              <option value="VENDA">Vendas</option>
              <option value="USUARIO">Usuários</option>
              <option value="CATEGORIA">Categorias</option>
              <option value="AUTH">Autenticação</option>
            </select>
          </div>
          <div>
            <label className="label">Ação</label>
            <select
              className="input"
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
            >
              <option value="">Todas as ações</option>
              <option value="CREATE">Criar</option>
              <option value="UPDATE">Atualizar</option>
              <option value="DELETE">Excluir</option>
              <option value="UPDATE_STATUS">Alterar Status</option>
              <option value="ENTRADA">Entrada Estoque</option>
              <option value="SAIDA">Saída Estoque</option>
              <option value="LOGIN">Login</option>
            </select>
          </div>
          <div>
            <label className="label">Data Inicial</label>
            <input
              type="date"
              className="input"
              value={filters.startDate || defaultStartDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Data Final</label>
            <input
              type="date"
              className="input"
              value={filters.endDate || defaultEndDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Exibindo <strong>{logs.length}</strong> registro(s)
          </span>
          <button
            onClick={() => refetch()}
            className="ml-auto text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            🔄 Atualizar
          </button>
        </div>
      </div>

      {/* Estatísticas por Entidade */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {Object.entries(stats.byEntity).map(([entity, count]) => (
          <div key={entity} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-center">
            <div className="text-2xl mb-1">{getEntityIcon(entity)}</div>
            <p className="text-xs text-gray-500">{entity}</p>
            <p className="text-lg font-bold text-gray-900">{count}</p>
          </div>
        ))}
      </div>

      {/* Lista de Logs */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando histórico de auditoria...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm text-center">
          <p className="text-gray-500 text-lg">Nenhum registro encontrado</p>
          <p className="text-gray-400 text-sm mt-2">
            Não há registros de auditoria para os filtros selecionados
          </p>
        </div>
      ) : (
        <>
          {/* Tabela Desktop/Tablet */}
          <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Entidade
                  </th>
                  <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Ação
                  </th>
                  <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Descrição
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log: LogEntryDTO) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 md:px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-3 md:px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>{getEntityIcon(log.entityType)}</span>
                        <span>
                          {log.entityType || '-'}
                          {log.entityId && <span className="text-gray-400"> (ID: {log.entityId})</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-3 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        log.level === 'WARN' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {getActionLabel(log.action)}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-3 text-sm text-gray-600">
                      {log.username || (log.userId ? `ID: ${log.userId}` : 'Sistema')}
                    </td>
                    <td className="px-3 md:px-4 py-3 text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{log.message}</p>
                        {log.details && (
                          <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cards Mobile */}
        <div className="md:hidden space-y-4">
          {logs.map((log: LogEntryDTO) => (
            <div key={log.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Data/Hora:</span>
                  <span className="text-sm text-gray-600 text-right flex-1 ml-4">{formatDate(log.timestamp)}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Entidade:</span>
                  <div className="text-right flex-1 ml-4 flex items-center justify-end gap-2">
                    <span>{getEntityIcon(log.entityType)}</span>
                    <span className="text-sm text-gray-600">
                      {log.entityType || '-'}
                      {log.entityId && <span className="text-gray-400"> (ID: {log.entityId})</span>}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Ação:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    log.level === 'WARN' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {getActionLabel(log.action)}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Usuário:</span>
                  <span className="text-sm text-gray-600 text-right flex-1 ml-4">{log.username || (log.userId ? `ID: ${log.userId}` : 'Sistema')}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Descrição:</span>
                  <div className="text-right flex-1 ml-4">
                    <p className="text-sm font-medium text-gray-900">{log.message}</p>
                    {log.details && (
                      <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Logs;
