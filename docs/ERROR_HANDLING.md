# Guia de Tratamento de Erros

## 📋 Visão Geral

Este documento descreve o sistema profissional de tratamento de erros do PharmaSys, garantindo consistência, clareza e boa experiência do usuário em toda a aplicação.

## 🎯 Princípios Fundamentais

### ✅ O que fazer

- **Sempre confiar no backend**: O backend é a única fonte de verdade das regras de negócio
- **Centralizar mensagens**: Todas as mensagens de erro vêm de `businessErrors.ts`
- **Linguagem clara e profissional**: Mensagens devem ser compreensíveis por operadores de farmácia
- **Orientar o usuário**: Sempre fornecer dicas de ação quando possível
- **Consistência visual**: Usar os componentes padronizados (`ErrorDisplay`)

### ❌ O que NÃO fazer

- **Nunca duplicar regras de negócio** no frontend
- **Nunca expor mensagens técnicas** diretamente ao usuário
- **Nunca usar stacktraces** ou detalhes de implementação
- **Nunca criar validações críticas** que não existem no backend
- **Nunca assumir estados** sem confirmar com a API

## 📦 Estrutura do Sistema

```
pharmasystem-react/
├── constants/
│   └── businessErrors.ts      # Mapeamento centralizado de erros
├── utils/
│   └── errorHandler.ts        # Lógica de processamento de erros
├── components/
│   └── ErrorDisplay.tsx       # Componentes de exibição
└── hooks/
    └── useErrorHandler.ts     # Hook React para uso fácil
```

## 🔧 Uso Básico

### 1. Usando o Hook (Recomendado)

```typescript
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorDisplay } from '../components/ErrorDisplay';

function MeuComponente() {
  const { error, handleError, clearError } = useErrorHandler();

  const handleSubmit = async () => {
    try {
      await api.criarCliente(data);
    } catch (err) {
      handleError(err); // Processa e armazena o erro
    }
  };

  return (
    <>
      {error && (
        <ErrorDisplay 
          error={error} 
          onDismiss={clearError} 
        />
      )}
      {/* resto do componente */}
    </>
  );
}
```

### 2. Processamento Manual

```typescript
import { processError } from '../utils/errorHandler';
import { ErrorDisplay } from '../components/ErrorDisplay';

function MeuComponente() {
  const [error, setError] = useState<ProcessedError | null>(null);

  const handleSubmit = async () => {
    try {
      await api.criarCliente(data);
    } catch (err) {
      const processed = processError(err);
      setError(processed);
    }
  };

  return (
    <>
      {error && <ErrorDisplay error={error} />}
    </>
  );
}
```

### 3. Em Formulários (Erro Inline)

```typescript
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorInline } from '../components/ErrorDisplay';

function FormularioCliente() {
  const { error, handleError } = useErrorHandler();

  return (
    <form>
      <div>
        <label>CPF</label>
        <input type="text" />
        {error?.code === 'CLIENTE_CPF_DUPLICADO' && (
          <ErrorInline error={error} />
        )}
      </div>
    </form>
  );
}
```

## 🎨 Tipos de Feedback

O sistema determina automaticamente o tipo de feedback baseado no erro:

| Tipo | Quando Usar | Exemplo |
|------|-------------|---------|
| **Banner** | Erros críticos que afetam toda a aplicação | Erro de rede, servidor (5xx) |
| **Toast** | Erros de negócio que não bloqueiam | Validação de campo, regra de negócio |
| **Inline** | Erros de validação de formulário | Campo obrigatório, formato inválido |
| **Modal** | Erros que requerem atenção imediata | Não autorizado (401/403) |

## 📝 Mapeamento de Erros

### Adicionando Novos Erros

1. **Backend**: Garanta que o erro retorna um código no campo `error` do `ErrorResponse`
2. **Frontend**: Adicione o mapeamento em `constants/businessErrors.ts`:

```typescript
export const businessErrors: Record<string, BusinessErrorMapping> = {
  NOVO_ERRO_CODIGO: {
    message: 'Mensagem amigável para o usuário',
    severity: 'warning', // ou 'error' ou 'info'
    blocking: true, // se bloqueia a ação
    actionHint: 'Sugestão de ação para o usuário',
  },
};
```

### Códigos de Erro Existentes

#### Clientes
- `CLIENTE_CPF_DUPLICADO`
- `CLIENTE_EMAIL_DUPLICADO`
- `CLIENTE_MENOR_IDADE`
- `CLIENTE_NAO_ENCONTRADO`

#### Medicamentos
- `MEDICAMENTO_NOME_DUPLICADO`
- `MEDICAMENTO_CADASTRO_INATIVO`
- `MEDICAMENTO_INATIVO`
- `MEDICAMENTO_VENCIDO`
- `MEDICAMENTO_NAO_ENCONTRADO`

#### Estoque
- `ESTOQUE_INSUFICIENTE`
- `ESTOQUE_QUANTIDADE_INVALIDA`
- `ESTOQUE_MEDICAMENTO_INATIVO`

#### Vendas
- `VENDA_SEM_ITENS`
- `VENDA_NAO_ENCONTRADA`
- `VENDA_CLIENTE_INVALIDO`

#### Categorias
- `CATEGORIA_NOME_DUPLICADO`
- `CATEGORIA_COM_MEDICAMENTOS`
- `CATEGORIA_NAO_ENCONTRADA`

#### Autenticação
- `AUTH_CREDENCIAIS_INVALIDAS`
- `AUTH_USUARIO_DUPLICADO`
- `AUTH_USUARIO_INATIVO`
- `AUTH_NAO_AUTORIZADO`

## 🔍 Debugging

### Em Desenvolvimento

Todos os erros são logados no console com detalhes técnicos:

```typescript
{
  code: 'ESTOQUE_INSUFICIENTE',
  message: 'Estoque insuficiente para concluir a operação.',
  status: 422,
  technical: 'Estoque insuficiente para o medicamento: Paracetamol'
}
```

### Em Produção

Apenas erros críticos (5xx) são logados. Mensagens técnicas nunca são expostas ao usuário.

## 🎯 Boas Práticas

### 1. Sempre use o hook ou processError

```typescript
// ✅ Correto
const { error, handleError } = useErrorHandler();
try {
  await api.call();
} catch (err) {
  handleError(err);
}

// ❌ Incorreto
try {
  await api.call();
} catch (err) {
  alert('Erro!'); // Nunca faça isso
}
```

### 2. Forneça contexto quando possível

```typescript
// ✅ Correto - erro específico por campo
{error?.code === 'CLIENTE_CPF_DUPLICADO' && (
  <ErrorInline error={error} />
)}

// ❌ Incorreto - erro genérico sempre
<ErrorDisplay error={error} />
```

### 3. Limpe erros após ações do usuário

```typescript
const { error, clearError } = useErrorHandler();

// Limpar ao fechar modal
<button onClick={() => {
  clearError();
  closeModal();
}}>Fechar</button>

// Limpar ao mudar de campo
<input onChange={() => clearError()} />
```

## 📚 Referências

- [ErrorResponse do Backend](../farmacia-Java/farmacia-api/src/main/java/com/farmacia/api/infra/handler/dto/ErrorResponse.java)
- [GlobalExceptionHandler](../farmacia-Java/farmacia-api/src/main/java/com/farmacia/api/infra/handler/GlobalExceptionHandler.java)
- [BusinessErrors](../constants/businessErrors.ts)

