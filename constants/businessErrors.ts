/**
 * Mapeamento Centralizado de Erros de Negócio
 * 
 * Este arquivo contém o mapeamento de códigos de erro retornados pela API
 * para mensagens amigáveis ao usuário final.
 * 
 * IMPORTANTE:
 * - O backend é a única fonte de verdade das regras de negócio
 * - Este mapeamento apenas traduz códigos técnicos em mensagens UX
 * - Nunca duplicar regras de negócio críticas no frontend
 * 
 * @see ErrorResponse do backend: { timestamp, status, error, message, path }
 */

export type ErrorSeverity = 'error' | 'warning' | 'info';

export interface BusinessErrorMapping {
  /** Mensagem amigável para o usuário final */
  message: string;
  /** Severidade do erro (afeta cor e ícone) */
  severity: ErrorSeverity;
  /** Se o erro bloqueia a ação */
  blocking: boolean;
  /** Sugestão de ação para o usuário */
  actionHint?: string;
}

/**
 * Mapeamento de códigos de erro para mensagens amigáveis
 * 
 * Códigos devem corresponder ao campo 'error' do ErrorResponse do backend
 */
export const businessErrors: Record<string, BusinessErrorMapping> = {
  // ==========================================
  // CLIENTES
  // ==========================================
  CLIENTE_CPF_DUPLICADO: {
    message: 'Este CPF já está cadastrado no sistema.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Verifique se o cliente já existe ou utilize outro CPF.',
  },
  CLIENTE_EMAIL_DUPLICADO: {
    message: 'Este e-mail já está cadastrado no sistema.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Verifique se o cliente já existe ou utilize outro e-mail.',
  },
  CLIENTE_MENOR_IDADE: {
    message: 'O cliente deve ter pelo menos 18 anos para ser cadastrado.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Verifique a data de nascimento informada.',
  },
  CLIENTE_NAO_ENCONTRADO: {
    message: 'Cliente não encontrado.',
    severity: 'error',
    blocking: true,
    actionHint: 'Verifique o ID informado ou tente novamente.',
  },

  // ==========================================
  // MEDICAMENTOS
  // ==========================================
  MEDICAMENTO_NOME_DUPLICADO: {
    message: 'Já existe um medicamento com este nome.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Utilize um nome diferente ou verifique o medicamento existente.',
  },
  MEDICAMENTO_CADASTRO_INATIVO: {
    message: 'Não é permitido cadastrar um medicamento como inativo.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Cadastre o medicamento como ativo e altere o status posteriormente, se necessário.',
  },
  MEDICAMENTO_INATIVO: {
    message: 'Este medicamento está indisponível para venda no momento.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Ative o medicamento antes de realizar a operação.',
  },
  MEDICAMENTO_VENCIDO: {
    message: 'Este medicamento está com a data de validade vencida.',
    severity: 'error',
    blocking: true,
    actionHint: 'Não é possível realizar operações com medicamentos vencidos.',
  },
  MEDICAMENTO_NAO_ENCONTRADO: {
    message: 'Medicamento não encontrado.',
    severity: 'error',
    blocking: true,
    actionHint: 'Verifique o ID informado ou tente novamente.',
  },

  // ==========================================
  // ESTOQUE
  // ==========================================
  ESTOQUE_INSUFICIENTE: {
    message: 'Estoque insuficiente para concluir a operação.',
    severity: 'error',
    blocking: true,
    actionHint: 'Verifique a quantidade disponível e ajuste a solicitação.',
  },
  ESTOQUE_QUANTIDADE_INVALIDA: {
    message: 'A quantidade deve ser maior que zero.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Informe uma quantidade válida.',
  },
  ESTOQUE_MEDICAMENTO_INATIVO: {
    message: 'Não é possível movimentar estoque de medicamento inativo.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Ative o medicamento antes de realizar a movimentação.',
  },

  // ==========================================
  // VENDAS
  // ==========================================
  VENDA_SEM_ITENS: {
    message: 'A venda deve conter pelo menos um item.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Adicione pelo menos um medicamento à venda.',
  },
  VENDA_NAO_ENCONTRADA: {
    message: 'Venda não encontrada.',
    severity: 'error',
    blocking: true,
    actionHint: 'Verifique o ID informado ou tente novamente.',
  },
  VENDA_CLIENTE_INVALIDO: {
    message: 'Cliente inválido ou não encontrado.',
    severity: 'error',
    blocking: true,
    actionHint: 'Selecione um cliente válido.',
  },

  // ==========================================
  // CATEGORIAS
  // ==========================================
  CATEGORIA_NOME_DUPLICADO: {
    message: 'Já existe uma categoria com este nome.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Utilize um nome diferente.',
  },
  CATEGORIA_COM_MEDICAMENTOS: {
    message: 'Não é possível excluir uma categoria que possui medicamentos vinculados.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Remova ou altere a categoria dos medicamentos vinculados antes de excluir.',
  },
  CATEGORIA_NAO_ENCONTRADA: {
    message: 'Categoria não encontrada.',
    severity: 'error',
    blocking: true,
    actionHint: 'Verifique o ID informado ou tente novamente.',
  },

  // ==========================================
  // AUTENTICAÇÃO
  // ==========================================
  AUTH_CREDENCIAIS_INVALIDAS: {
    message: 'Usuário ou senha incorretos.',
    severity: 'error',
    blocking: true,
    actionHint: 'Verifique suas credenciais e tente novamente.',
  },
  AUTH_USUARIO_DUPLICADO: {
    message: 'Este nome de usuário já está em uso.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Escolha outro nome de usuário.',
  },
  AUTH_USUARIO_INATIVO: {
    message: 'Usuário inativo. Entre em contato com o administrador.',
    severity: 'error',
    blocking: true,
    actionHint: 'Sua conta pode ter sido desativada.',
  },
  AUTH_NAO_AUTORIZADO: {
    message: 'Você não tem permissão para realizar esta ação.',
    severity: 'error',
    blocking: true,
    actionHint: 'Entre em contato com o administrador se precisar de acesso.',
  },

  // ==========================================
  // VALIDAÇÕES GENÉRICAS
  // ==========================================
  VALIDACAO_CAMPO_OBRIGATORIO: {
    message: 'Preencha todos os campos obrigatórios.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Verifique os campos marcados e preencha as informações necessárias.',
  },
  VALIDACAO_FORMATO_INVALIDO: {
    message: 'O formato dos dados informados não é válido.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Verifique o formato dos campos e tente novamente.',
  },
  VALIDACAO_CPF_INVALIDO: {
    message: 'O CPF informado não é válido.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Verifique se o CPF contém 11 dígitos numéricos.',
  },
  VALIDACAO_DATA_INVALIDA: {
    message: 'A data informada não é válida.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Verifique o formato da data e tente novamente.',
  },

  // ==========================================
  // ERROS GENÉRICOS DO SISTEMA
  // ==========================================
  RECURSO_NAO_ENCONTRADO: {
    message: 'O recurso solicitado não foi encontrado.',
    severity: 'error',
    blocking: true,
    actionHint: 'Verifique se o ID está correto ou tente novamente.',
  },
  VIOLACAO_REGRA_NEGOCIO: {
    message: 'A operação não pode ser realizada devido a uma regra de negócio.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Verifique os dados informados e tente novamente.',
  },
  ERRO_VALIDACAO: {
    message: 'Os dados informados não são válidos.',
    severity: 'warning',
    blocking: true,
    actionHint: 'Verifique os campos e corrija os erros antes de continuar.',
  },
  ERRO_INTERNO: {
    message: 'Ocorreu um erro interno no servidor.',
    severity: 'error',
    blocking: true,
    actionHint: 'Tente novamente em alguns instantes. Se o problema persistir, entre em contato com o suporte.',
  },
  ERRO_REDE: {
    message: 'Não foi possível conectar ao servidor.',
    severity: 'error',
    blocking: true,
    actionHint: 'Verifique sua conexão com a internet e tente novamente.',
  },
};

/**
 * Obtém o mapeamento de erro baseado no código retornado pela API
 * 
 * @param errorCode Código de erro do backend (campo 'error' do ErrorResponse)
 * @returns Mapeamento do erro ou fallback genérico
 */
export function getBusinessError(errorCode: string | undefined): BusinessErrorMapping {
  if (!errorCode) {
    return businessErrors.ERRO_INTERNO;
  }

  // Normaliza o código (uppercase, remove espaços)
  const normalizedCode = errorCode.toUpperCase().trim();

  // Tenta encontrar o mapeamento exato
  if (businessErrors[normalizedCode]) {
    return businessErrors[normalizedCode];
  }

  // Fallback: tenta encontrar por padrão parcial
  const partialMatch = Object.keys(businessErrors).find(key =>
    normalizedCode.includes(key) || key.includes(normalizedCode)
  );

  if (partialMatch) {
    return businessErrors[partialMatch];
  }

  // Fallback genérico
  return businessErrors.ERRO_INTERNO;
}

/**
 * Extrai código de erro de mensagens do backend (para compatibilidade)
 * 
 * Alguns erros podem vir apenas com mensagem, sem código explícito.
 * Esta função tenta extrair o código baseado em padrões conhecidos.
 */
export function extractErrorCodeFromMessage(message: string): string | undefined {
  const messageUpper = message.toUpperCase();

  // Mapeamento de padrões de mensagem para códigos
  const patterns: Record<string, string> = {
    'JÁ EXISTE.*CLIENTE.*CPF': 'CLIENTE_CPF_DUPLICADO',
    'JÁ EXISTE.*CLIENTE.*E-MAIL': 'CLIENTE_EMAIL_DUPLICADO',
    '18 ANOS': 'CLIENTE_MENOR_IDADE',
    'CLIENTE NÃO ENCONTRADO': 'CLIENTE_NAO_ENCONTRADO',
    'JÁ EXISTE.*MEDICAMENTO.*NOME': 'MEDICAMENTO_NOME_DUPLICADO',
    'NÃO É PERMITIDO CADASTRAR.*INATIVO': 'MEDICAMENTO_CADASTRO_INATIVO',
    'MEDICAMENTO.*INATIVO': 'MEDICAMENTO_INATIVO',
    'VALIDADE VENCIDA': 'MEDICAMENTO_VENCIDO',
    'MEDICAMENTO NÃO ENCONTRADO': 'MEDICAMENTO_NAO_ENCONTRADO',
    'ESTOQUE INSUFICIENTE': 'ESTOQUE_INSUFICIENTE',
    'QUANTIDADE.*MAIOR QUE ZERO': 'ESTOQUE_QUANTIDADE_INVALIDA',
    'VENDA.*AO MENOS UM ITEM': 'VENDA_SEM_ITENS',
    'VENDA NÃO ENCONTRADA': 'VENDA_NAO_ENCONTRADA',
    'JÁ EXISTE.*CATEGORIA': 'CATEGORIA_NOME_DUPLICADO',
    'NÃO É POSSÍVEL EXCLUIR.*CATEGORIA.*MEDICAMENTOS': 'CATEGORIA_COM_MEDICAMENTOS',
    'CATEGORIA NÃO ENCONTRADA': 'CATEGORIA_NAO_ENCONTRADO',
    'NOME DE USUÁRIO.*EM USO': 'AUTH_USUARIO_DUPLICADO',
    'USUÁRIO INATIVO': 'AUTH_USUARIO_INATIVO',
  };

  for (const [pattern, code] of Object.entries(patterns)) {
    if (new RegExp(pattern).test(messageUpper)) {
      return code;
    }
  }

  return undefined;
}

