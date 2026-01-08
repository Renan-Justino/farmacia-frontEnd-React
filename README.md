# PharmaSys - Sistema de Gestão Farmacêutica

<div align="center">

![Grupo DPSP](pharmasystem-react/public/grupodpsp_cover.jpg)

**Sistema completo de gestão para farmácias desenvolvido para o Grupo DPSP**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=spring)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Executando a Aplicação](#-executando-a-aplicação)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Autenticação e Segurança](#-autenticação-e-segurança)
- [Tratamento de Erros](#-tratamento-de-erros)
- [Análises e Relatórios](#-análises-e-relatórios)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Visão Geral

O **PharmaSys** é um sistema completo de gestão farmacêutica desenvolvido para o **Grupo DPSP** (Drogarias Pacheco, Drogaria São Paulo), oferecendo uma solução integrada para gerenciamento de clientes, medicamentos, vendas, estoque e análises estratégicas.

### Principais Características

- ✅ **Interface Moderna e Responsiva**: Design clean com identidade visual DPSP
- ✅ **Gestão Completa**: Clientes, Medicamentos, Vendas e Estoque
- ✅ **Sistema de Auditoria**: Logs detalhados de todas as operações
- ✅ **Análises Avançadas**: Gráficos interativos e sugestões estratégicas
- ✅ **Tratamento Inteligente de Erros**: Mensagens amigáveis e validações robustas
- ✅ **Busca Inteligente**: Filtros avançados para facilitar operações
- ✅ **Segurança**: Autenticação JWT e validações de regras de negócio

---

## 🏗️ Arquitetura

O sistema segue uma arquitetura **full-stack** moderna:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Pages   │  │Components │  │  Hooks   │  │   API   │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────┴──────────────────────────────────┐
│              Backend (Spring Boot)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │Controller│  │ Service  │  │Repository│  │  Model  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────┐
│              Database (PostgreSQL/MySQL)                │
└─────────────────────────────────────────────────────────┘
```

### Camadas da Aplicação

**Frontend:**
- **Pages**: Componentes de página principais
- **Components**: Componentes reutilizáveis (Toolbar, Footer, Modals, etc.)
- **Hooks**: Lógica de negócio e gerenciamento de estado (React Query)
- **API**: Camada de comunicação com o backend (Axios)
- **Utils**: Utilitários e helpers

**Backend:**
- **Controller**: Endpoints REST
- **Service**: Lógica de negócio e validações
- **Repository**: Acesso a dados (Spring Data JPA)
- **Model**: Entidades JPA
- **DTO**: Objetos de transferência de dados
- **Security**: Configuração de autenticação e autorização

---

## 🛠️ Tecnologias

### Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 18.2.0 | Biblioteca UI |
| **TypeScript** | 5.3.3 | Tipagem estática |
| **Vite** | 5.2.0 | Build tool e dev server |
| **React Router** | 6.22.3 | Roteamento |
| **React Query** | 5.45.0 | Gerenciamento de estado e cache |
| **Axios** | 1.6.8 | Cliente HTTP |
| **Tailwind CSS** | 3.4.17 | Framework CSS utility-first |
| **Recharts** | Latest | Biblioteca de gráficos |

### Backend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Java** | 17+ | Linguagem de programação |
| **Spring Boot** | 3.x | Framework Java |
| **Spring Security** | 6.x | Autenticação e autorização |
| **Spring Data JPA** | 3.x | Abstração de acesso a dados |
| **Hibernate** | 6.x | ORM |
| **JWT** | 0.12.x | Tokens de autenticação |
| **PostgreSQL/MySQL** | Latest | Banco de dados |
| **Maven** | 3.8+ | Gerenciamento de dependências |

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Frontend
- **Node.js** 18+ e **npm** 9+ (ou **yarn** 1.22+)
- Navegador moderno (Chrome, Firefox, Edge, Safari)

### Backend
- **Java JDK** 17 ou superior
- **Maven** 3.8 ou superior
- **PostgreSQL** 12+ ou **MySQL** 8+ (ou Docker para containerização)
- **IDE** (opcional): IntelliJ IDEA, Eclipse, VS Code

### Ferramentas Recomendadas
- **Git** para controle de versão
- **Postman** ou **Insomnia** para testes de API
- **Docker** (opcional) para containerização

---

## 🚀 Instalação

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd projetoFarmacia-Full
```

### 2. Configuração do Backend

#### 2.1. Configure o Banco de Dados

Edite o arquivo `farmacia-Java/farmacia-api/src/main/resources/application.properties`:

```properties
# Banco de Dados (PostgreSQL ou MySQL)
spring.datasource.url=jdbc:postgresql://localhost:5432/pharmasys
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Servidor
server.port=8080

# JWT (configure uma chave secreta forte em produção)
jwt.secret=sua-chave-secreta-super-segura-aqui
jwt.expiration=86400000
```

#### 2.2. Instale as Dependências

```bash
cd farmacia-Java/farmacia-api
mvn clean install
```

### 3. Configuração do Frontend

#### 3.1. Instale as Dependências

```bash
cd pharmasystem-react
npm install
```

#### 3.2. Configure a URL da API

Edite `pharmasystem-react/api/axios.ts` se necessário:

```typescript
baseURL: 'http://localhost:8080/api'
```

---

## ▶️ Executando a Aplicação

### Backend (Spring Boot)

```bash
cd farmacia-Java/farmacia-api
mvn spring-boot:run
```

Ou execute a classe principal `FarmaciaApiApplication.java` através da IDE.

**Backend estará disponível em:** `http://localhost:8080`

### Frontend (React + Vite)

```bash
cd pharmasystem-react
npm run dev
```

**Frontend estará disponível em:** `http://localhost:3000`

### Acessando a Aplicação

1. Abra o navegador em `http://localhost:3000`
2. Faça login ou registre um novo usuário
3. Explore as funcionalidades do sistema

---

## ✨ Funcionalidades

### 🏠 Dashboard

- **Visão Geral**: Estatísticas em tempo real
- **Cards de Resumo**: Total de clientes, medicamentos, vendas e receita
- **Alertas Inteligentes**: Estoque baixo e validade próxima
- **Vendas Recentes**: Últimas transações registradas
- **Análises Rápidas**: Cards clicáveis para análises detalhadas

### 👥 Gestão de Clientes

- ✅ Cadastro completo (nome, CPF, email, data de nascimento)
- ✅ Validação de CPF e idade mínima (18 anos)
- ✅ Listagem com busca e filtros
- ✅ Edição de dados
- ✅ Visualização detalhada em modal
- ✅ Tabela clicável para ver detalhes completos

### 💊 Gestão de Medicamentos

- ✅ Cadastro com informações completas
- ✅ Gestão de categorias
- ✅ Controle de preço e estoque
- ✅ Validade e status (ativo/inativo)
- ✅ Visualização detalhada com indicadores visuais
- ✅ Alertas de estoque baixo e validade próxima
- ✅ Tabela clicável para ver detalhes completos

### 💰 Gestão de Vendas

- ✅ Registro de vendas com múltiplos itens
- ✅ **Busca inteligente de clientes** (nome, CPF, email)
- ✅ **Busca inteligente de medicamentos** (nome, categoria)
- ✅ Validação automática de estoque
- ✅ Cálculo automático de totais
- ✅ Histórico completo de vendas
- ✅ Visualização detalhada com itens e valores
- ✅ Tabela clicável para ver detalhes completos

### 📦 Gestão de Estoque

- ✅ Entrada e saída de estoque
- ✅ Histórico completo de movimentações
- ✅ **Análise por período** (7, 30, 90 dias)
- ✅ **Identificação automática de transações** (Venda, Reposição, Ajuste)
- ✅ Gráficos de movimentação
- ✅ Alertas de estoque baixo
- ✅ Alertas de validade próxima
- ✅ Tabela clicável com informações detalhadas
- ✅ Modal de detalhes com análise de transação

### 📊 Análises e Relatórios

#### Análise de Vendas e Clientes
- 📈 Gráfico de vendas por período (7, 30, 90 dias, 1 ano)
- 👥 Top 10 clientes por valor
- 📅 Análise de vendas por dia da semana
- 📊 Distribuição de clientes
- 📉 Estatísticas de ticket médio

#### Estratégia de Medicamentos
- 🏆 Medicamento mais vendido em destaque
- 💡 **Sugestões automáticas de estratégia**:
  - Alerta de estoque baixo nos mais vendidos
  - Alta rotatividade (sugestão de aumentar estoque)
  - Baixa rotatividade em produtos de alto valor (sugestão de promoções)
  - Estoque alto com poucas vendas (sugestão de ajustar pedidos)
- 📊 Top 10 medicamentos com estoque atual
- 📈 Gráficos de vendas de medicamentos por período
- 🥧 Distribuições por quantidade e valor

### 📋 Sistema de Logs

- ✅ **Auditoria completa** de todas as operações
- ✅ Filtros por entidade, ação e tipo
- ✅ Histórico de tentativas bloqueadas (regras de negócio)
- ✅ Logs de operações realizadas
- ✅ Interface simplificada (sem alertas técnicos)
- ✅ Estatísticas de operações

### 🔐 Autenticação e Segurança

- ✅ Login e registro de usuários
- ✅ Autenticação JWT
- ✅ Rotas protegidas
- ✅ Interceptores de requisição
- ✅ Tratamento de erros 401/403

### 🎨 Interface e UX

- ✅ **Toolbar fixa** com identidade visual DPSP
- ✅ **Footer fixo** com mensagem institucional
- ✅ **Menu hambúrguer** responsivo
- ✅ **Modais de detalhes** para todas as entidades
- ✅ **Animações suaves** e transições
- ✅ **Design responsivo** (mobile-first)
- ✅ **Cores DPSP** aplicadas em toda interface
- ✅ **Ícones SVG** profissionais

---

## 📁 Estrutura do Projeto

```
projetoFarmacia-Full/
│
├── pharmasystem-react/          # Frontend React
│   ├── public/                   # Arquivos estáticos
│   │   ├── grupodpsp_cover.jpg   # Banner DPSP
│   │   ├── img1.jpg, img2.jpg, img3.jpg
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/                  # Camada de API
│   │   │   ├── axios.ts          # Configuração Axios
│   │   │   ├── auth.api.ts
│   │   │   ├── clientes.api.ts
│   │   │   ├── medicamentos.api.ts
│   │   │   ├── vendas.api.ts
│   │   │   ├── estoque.api.ts
│   │   │   └── logs.api.ts
│   │   ├── components/           # Componentes React
│   │   │   ├── Layout.tsx        # Layout principal
│   │   │   ├── Toolbar.tsx       # Toolbar fixa
│   │   │   ├── Footer.tsx        # Footer fixo
│   │   │   ├── Logo.tsx         # Logo DPSP
│   │   │   ├── Icon.tsx         # Ícones SVG
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ErrorDisplay.tsx
│   │   │   ├── DetailModal.tsx
│   │   │   ├── ClienteDetails.tsx
│   │   │   ├── VendaDetails.tsx
│   │   │   ├── MedicamentoDetails.tsx
│   │   │   └── MovimentacaoDetails.tsx
│   │   ├── pages/                # Páginas
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Home.tsx          # Dashboard
│   │   │   ├── Clientes.tsx
│   │   │   ├── Medicamentos.tsx
│   │   │   ├── Vendas.tsx
│   │   │   ├── Estoque.tsx
│   │   │   ├── Logs.tsx
│   │   │   ├── AnaliseVendas.tsx
│   │   │   └── EstrategiaMedicamentos.tsx
│   │   ├── hooks/                # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useClientes.ts
│   │   │   ├── useMedicamentos.ts
│   │   │   ├── useVendas.ts
│   │   │   ├── useLogs.ts
│   │   │   └── useErrorHandler.ts
│   │   ├── dtos/                 # Data Transfer Objects
│   │   ├── constants/            # Constantes
│   │   │   └── businessErrors.ts
│   │   ├── utils/                # Utilitários
│   │   │   └── errorHandler.ts
│   │   └── routes/               # Rotas
│   │       └── AppRoutes.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.cjs
│
└── farmacia-Java/                # Backend Spring Boot
    └── farmacia-api/
        ├── src/main/java/com/farmacia/api/
        │   ├── model/            # Entidades JPA
        │   │   ├── Cliente.java
        │   │   ├── Medicamento.java
        │   │   ├── Venda.java
        │   │   ├── MovimentacaoEstoque.java
        │   │   └── LogOperacao.java
        │   ├── repository/       # Repositories
        │   ├── service/          # Services
        │   │   ├── ClienteService.java
        │   │   ├── MedicamentoService.java
        │   │   ├── VendaService.java
        │   │   ├── EstoqueService.java
        │   │   ├── LogService.java
        │   │   └── AlertaService.java
        │   ├── web/              # Controllers
        │   │   ├── cliente/
        │   │   ├── medicamento/
        │   │   ├── venda/
        │   │   ├── estoque/
        │   │   ├── log/
        │   │   └── alerta/
        │   ├── auth/             # Autenticação
        │   ├── infra/            # Infraestrutura
        │   │   ├── security/
        │   │   └── handler/
        │   └── mapper/           # Mappers DTO
        ├── src/main/resources/
        │   └── application.properties
        └── pom.xml
```

---

## 🔌 API Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/auth/register` | Registrar novo usuário |
| `POST` | `/api/auth/login` | Login e obter token JWT |

### Clientes

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/clientes` | Listar todos os clientes |
| `GET` | `/api/clientes/{id}` | Obter cliente por ID |
| `POST` | `/api/clientes` | Criar novo cliente |
| `PUT` | `/api/clientes/{id}` | Atualizar cliente |

### Medicamentos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/medicamentos` | Listar todos os medicamentos |
| `GET` | `/api/medicamentos/{id}` | Obter medicamento por ID |
| `POST` | `/api/medicamentos` | Criar novo medicamento |
| `PUT` | `/api/medicamentos/{id}` | Atualizar medicamento |
| `PATCH` | `/api/medicamentos/{id}/status` | Atualizar status |
| `DELETE` | `/api/medicamentos/{id}` | Deletar medicamento |

### Vendas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/vendas` | Listar todas as vendas |
| `GET` | `/api/vendas/{id}` | Obter venda por ID |
| `GET` | `/api/vendas/cliente/{clienteId}` | Vendas por cliente |
| `POST` | `/api/vendas` | Registrar nova venda |

### Estoque

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/estoque/entrada` | Registrar entrada |
| `POST` | `/api/estoque/saida` | Registrar saída |
| `GET` | `/api/estoque/{medicamentoId}` | Histórico de movimentações |

### Logs

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/logs` | Listar todos os logs |

### Alertas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/alertas/estoque-baixo` | Medicamentos com estoque baixo |
| `GET` | `/api/alertas/validade-proxima` | Medicamentos próximos do vencimento |

---

## 🔐 Autenticação e Segurança

### Fluxo de Autenticação

1. **Registro/Login**: Usuário se autentica e recebe um token JWT
2. **Armazenamento**: Token salvo em `localStorage`
3. **Interceptação**: Axios adiciona token em todas as requisições
4. **Validação**: Backend valida token em cada requisição protegida
5. **Renovação**: Token expira após período configurado

### Rotas Protegidas

Todas as rotas exceto `/login` e `/register` requerem autenticação.

### Validações de Segurança

- ✅ Validação de CPF único
- ✅ Validação de email único
- ✅ Validação de idade mínima (18 anos)
- ✅ Validação de estoque antes de venda
- ✅ Validação de medicamento ativo
- ✅ Soft delete para clientes e medicamentos

---

## ⚠️ Tratamento de Erros

### Sistema de Erros Amigáveis

O sistema implementa um tratamento centralizado de erros com mensagens amigáveis ao usuário:

#### Backend

- **GlobalExceptionHandler**: Captura todas as exceções
- **BusinessException**: Regras de negócio violadas
- **ResourceNotFoundException**: Recursos não encontrados
- **ValidationException**: Erros de validação
- **ErrorResponse DTO**: Resposta padronizada com `code` e `message`

#### Frontend

- **ErrorHandler**: Processamento centralizado de erros
- **ErrorDisplay**: Componente para exibição de erros
- **useErrorHandler**: Hook simplificado para tratamento
- **Mapeamento de Códigos**: Tradução de códigos de erro para mensagens amigáveis

### Exemplo de Resposta de Erro

```json
{
  "code": "ESTOQUE_INSUFICIENTE",
  "message": "Estoque insuficiente para realizar a venda. Disponível: 5 unidades."
}
```

---

## 📊 Análises e Relatórios

### Dashboard Analítico

O sistema oferece duas páginas de análise completas:

#### 1. Análise de Vendas e Clientes (`/analise-vendas`)

- **Estatísticas Gerais**: Total de vendas, valor total, ticket médio, total de clientes
- **Gráfico de Vendas por Período**: Linha dupla (quantidade e valor) com filtros de 7, 30, 90 dias e 1 ano
- **Top 10 Clientes**: Gráfico de barras por valor total e número de compras
- **Vendas por Dia da Semana**: Análise de padrão semanal
- **Distribuição de Clientes**: Gráfico de pizza por valor

#### 2. Estratégia de Medicamentos (`/estrategia-medicamentos`)

- **Medicamento Mais Vendido**: Destaque com informações completas
- **Sugestões Automáticas de Estratégia**:
  - ⚠️ Alerta de estoque baixo nos mais vendidos
  - 📈 Alta rotatividade (sugestão de aumentar estoque)
  - 💰 Baixa rotatividade em produtos de alto valor (sugestão de promoções)
  - 📦 Estoque alto com poucas vendas (sugestão de ajustar pedidos)
- **Top 10 Medicamentos**: Gráfico de barras triplo (quantidade vendida, estoque atual, valor total)
- **Vendas de Medicamentos por Período**: Análise temporal
- **Distribuições**: Gráficos de pizza por quantidade e valor

### Gráficos Interativos

- **Recharts**: Biblioteca de gráficos responsivos
- **Tooltips Informativos**: Detalhes ao passar o mouse
- **Filtros de Período**: Análise temporal flexível
- **Exportação Visual**: Gráficos prontos para apresentação

---

## 🎨 Design System

### Cores DPSP

O sistema utiliza uma paleta de cores baseada na identidade visual do Grupo DPSP:

```css
--dpsp-dark: #1f2937        /* Cinza escuro */
--dpsp-dark-blue: #1e3a8a    /* Azul escuro (botões/links ativos) */
--dpsp-light-blue: #60a5fa   /* Azul claro (hover) */
--dpsp-red: #dc2626          /* Vermelho (botões de sair/alertas) */
```

### Componentes Reutilizáveis

- **Toolbar**: Header fixo com banner DPSP
- **Footer**: Rodapé fixo com mensagem institucional
- **Logo**: Componente SVG do logo DPSP
- **Icon**: Sistema de ícones SVG profissionais
- **DetailModal**: Modal reutilizável para detalhes
- **ErrorDisplay**: Componente de exibição de erros

---

## 🧪 Testes

### Executando Testes do Backend

```bash
cd farmacia-Java/farmacia-api
mvn test
```

### Executando Testes do Frontend

```bash
cd pharmasystem-react
npm test
```

---

## 🐛 Troubleshooting

### Problemas Comuns

#### Backend não inicia

- Verifique se o banco de dados está rodando
- Confirme as credenciais em `application.properties`
- Verifique se a porta 8080 está livre

#### Frontend não conecta ao backend

- Verifique se o backend está rodando
- Confirme a URL em `vite.config.ts` (proxy)
- Verifique CORS no backend

#### Erro 403 ao iniciar

- Limpe o `localStorage` do navegador
- Faça login novamente
- Verifique se o token JWT está válido

---

## 📝 Regras de Negócio

### Clientes

- ✅ CPF deve ser único
- ✅ Email deve ser único
- ✅ Cliente deve ter 18+ anos
- ✅ Cliente inativo não pode participar de novas vendas

### Medicamentos

- ✅ Nome deve ser único
- ✅ Preço deve ser positivo
- ✅ Quantidade de estoque não pode ser negativa
- ✅ Medicamento inativo não pode ser vendido

### Vendas

- ✅ Cliente deve estar ativo
- ✅ Medicamento deve estar ativo
- ✅ Estoque deve ser suficiente
- ✅ Venda deve ter pelo menos um item

### Estoque

- ✅ Entrada aumenta o estoque
- ✅ Saída diminui o estoque
- ✅ Não permite saída maior que estoque disponível
- ✅ Movimentações são registradas com observação

---

## 🚀 Deploy

### Backend (Produção)

```bash
cd farmacia-Java/farmacia-api
mvn clean package
java -jar target/farmacia-api-*.jar
```

### Frontend (Produção)

```bash
cd pharmasystem-react
npm run build
# Servir a pasta dist/ com servidor web (nginx, apache, etc.)
```

### Variáveis de Ambiente

Configure as seguintes variáveis para produção:

**Backend (`application.properties` ou variáveis de ambiente):**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/pharmasys
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
jwt.secret=chave-secreta-forte-minimo-32-caracteres
jwt.expiration=86400000
server.port=8080
```

**Frontend (`.env`):**
```env
VITE_API_URL=http://localhost:8080/api
```

### Docker (Opcional)

Para facilitar o desenvolvimento, você pode usar Docker para o banco de dados:

```bash
# PostgreSQL
docker run --name pharmasys-db -e POSTGRES_PASSWORD=senha -e POSTGRES_DB=pharmasys -p 5432:5432 -d postgres:latest

# MySQL (alternativa)
docker run --name pharmasys-db -e MYSQL_ROOT_PASSWORD=senha -e MYSQL_DATABASE=pharmasys -p 3306:3306 -d mysql:latest
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- **TypeScript**: Tipagem explícita
- **ESLint**: Seguir regras configuradas
- **Prettier**: Formatação automática
- **Conventional Commits**: Mensagens de commit padronizadas

---

## 📄 Licença

Este projeto é propriedade do **Grupo DPSP** e é destinado para uso interno.

---

## 👥 Equipe

Desenvolvido para o **Grupo DPSP** - Movidos pelo cliente.

**Drogarias Pacheco | Drogaria São Paulo**

---

## 📞 Suporte

Para suporte, entre em contato com a equipe de desenvolvimento.

---

<div align="center">

**PharmaSys** - Sistema de Gestão Farmacêutica

Desenvolvido com ❤️ para o Grupo DPSP

</div>

