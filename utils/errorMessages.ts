/**
 * Mapeamento de mensagens de erro do backend para mensagens amigáveis ao usuário
 */

interface ErrorMapping {
  pattern: RegExp;
  friendlyMessage: string;
  type: 'error' | 'warning' | 'info';
  icon?: string;
}

const errorMappings: ErrorMapping[] = [
  // Erros de Cliente
  {
    pattern: /Já existe um cliente cadastrado com este CPF/i,
    friendlyMessage: 'Este CPF já está cadastrado no sistema. Verifique se o cliente já existe.',
    type: 'warning',
    icon: '👤',
  },
  {
    pattern: /Já existe um cliente cadastrado com este e-mail/i,
    friendlyMessage: 'Este e-mail já está cadastrado. Tente usar outro e-mail ou verifique se o cliente já existe.',
    type: 'warning',
    icon: '📧',
  },
  {
    pattern: /É necessário ter 18 anos ou mais/i,
    friendlyMessage: 'O cliente deve ter pelo menos 18 anos para ser cadastrado no sistema.',
    type: 'warning',
    icon: '🔞',
  },
  {
    pattern: /Cliente não encontrado/i,
    friendlyMessage: 'Cliente não encontrado. Verifique o ID informado.',
    type: 'error',
    icon: '❌',
  },

  // Erros de Medicamento
  {
    pattern: /Já existe um medicamento com o nome/i,
    friendlyMessage: 'Já existe um medicamento com este nome. Use um nome diferente ou verifique o medicamento existente.',
    type: 'warning',
    icon: '💊',
  },
  {
    pattern: /Não é permitido cadastrar um medicamento já inativo/i,
    friendlyMessage: 'Não é possível cadastrar um medicamento como inativo. Ative o medicamento após o cadastro.',
    type: 'warning',
    icon: '⚠️',
  },
  {
    pattern: /medicamento está inativo e não pode ser vendido/i,
    friendlyMessage: 'Este medicamento está inativo e não pode ser vendido. Ative o medicamento primeiro.',
    type: 'warning',
    icon: '🚫',
  },
  {
    pattern: /data de validade vencida/i,
    friendlyMessage: 'Este medicamento está com a data de validade vencida. Não é possível realizar a operação.',
    type: 'error',
    icon: '📅',
  },
  {
    pattern: /Medicamento não encontrado/i,
    friendlyMessage: 'Medicamento não encontrado. Verifique o ID informado.',
    type: 'error',
    icon: '❌',
  },

  // Erros de Estoque
  {
    pattern: /Estoque insuficiente/i,
    friendlyMessage: 'Estoque insuficiente para realizar esta operação. Verifique a quantidade disponível.',
    type: 'error',
    icon: '📦',
  },
  {
    pattern: /Quantidade deve ser maior que zero/i,
    friendlyMessage: 'A quantidade deve ser maior que zero.',
    type: 'warning',
    icon: '🔢',
  },

  // Erros de Venda
  {
    pattern: /Venda deve conter ao menos um item/i,
    friendlyMessage: 'Adicione pelo menos um item à venda antes de finalizar.',
    type: 'warning',
    icon: '🛒',
  },
  {
    pattern: /Venda não encontrada/i,
    friendlyMessage: 'Venda não encontrada. Verifique o ID informado.',
    type: 'error',
    icon: '❌',
  },

  // Erros de Categoria
  {
    pattern: /Já existe uma categoria com o nome/i,
    friendlyMessage: 'Já existe uma categoria com este nome. Use um nome diferente.',
    type: 'warning',
    icon: '📁',
  },
  {
    pattern: /Não é possível excluir uma categoria que possui medicamentos vinculados/i,
    friendlyMessage: 'Não é possível excluir esta categoria pois existem medicamentos vinculados a ela. Remova os medicamentos primeiro.',
    type: 'warning',
    icon: '🔗',
  },
  {
    pattern: /Categoria não encontrada/i,
    friendlyMessage: 'Categoria não encontrada. Verifique o ID informado.',
    type: 'error',
    icon: '❌',
  },

  // Erros de Autenticação
  {
    pattern: /Nome de usuário já está em uso/i,
    friendlyMessage: 'Este nome de usuário já está em uso. Escolha outro nome.',
    type: 'warning',
    icon: '👤',
  },
  {
    pattern: /Authentication failed/i,
    friendlyMessage: 'Usuário ou senha incorretos. Verifique suas credenciais.',
    type: 'error',
    icon: '🔐',
  },
  {
    pattern: /Credenciais inválidas/i,
    friendlyMessage: 'Usuário ou senha incorretos. Tente novamente.',
    type: 'error',
    icon: '🔐',
  },

  // Erros de Validação
  {
    pattern: /não pode ser vazio/i,
    friendlyMessage: 'Este campo é obrigatório. Preencha todos os campos necessários.',
    type: 'warning',
    icon: '📝',
  },
  {
    pattern: /deve ser válido/i,
    friendlyMessage: 'O valor informado não é válido. Verifique o formato e tente novamente.',
    type: 'warning',
    icon: '✅',
  },
  {
    pattern: /deve conter \d+ dígitos/i,
    friendlyMessage: 'O CPF deve conter exatamente 11 dígitos numéricos.',
    type: 'warning',
    icon: '🔢',
  },
  {
    pattern: /deve ser no passado/i,
    friendlyMessage: 'A data de nascimento deve ser uma data no passado.',
    type: 'warning',
    icon: '📅',
  },

  // Erros genéricos
  {
    pattern: /Recurso Não Encontrado/i,
    friendlyMessage: 'O recurso solicitado não foi encontrado. Verifique se o ID está correto.',
    type: 'error',
    icon: '🔍',
  },
  {
    pattern: /Violação de Regra de Negócio/i,
    friendlyMessage: 'A operação não pode ser realizada devido a uma regra de negócio.',
    type: 'warning',
    icon: '⚠️',
  },
  {
    pattern: /Erro de Validação/i,
    friendlyMessage: 'Os dados informados não são válidos. Verifique os campos e tente novamente.',
    type: 'warning',
    icon: '📋',
  },
  {
    pattern: /Erro Interno/i,
    friendlyMessage: 'Ocorreu um erro interno no servidor. Tente novamente em alguns instantes.',
    type: 'error',
    icon: '🔧',
  },
];

/**
 * Converte uma mensagem de erro do backend em uma mensagem amigável
 */
export const getFriendlyErrorMessage = (errorMessage: string): { message: string; type: 'error' | 'warning' | 'info'; icon?: string } => {
  for (const mapping of errorMappings) {
    if (mapping.pattern.test(errorMessage)) {
      return {
        message: mapping.friendlyMessage,
        type: mapping.type,
        icon: mapping.icon,
      };
    }
  }

  // Se não encontrou mapeamento, retorna a mensagem original
  return {
    message: errorMessage || 'Ocorreu um erro inesperado. Tente novamente.',
    type: 'error',
    icon: '⚠️',
  };
};

/**
 * Extrai mensagens de validação de campo específico
 */
export const extractFieldErrors = (errorMessage: string): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};
  
  // Padrão: [campo]: mensagem
  const fieldPattern = /\[([^\]]+)\]:\s*([^|]+)/g;
  let match;
  
  while ((match = fieldPattern.exec(errorMessage)) !== null) {
    const field = match[1].trim();
    const message = match[2].trim();
    fieldErrors[field] = getFriendlyErrorMessage(message).message;
  }
  
  return fieldErrors;
};

