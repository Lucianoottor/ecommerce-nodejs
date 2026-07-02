# E-commerce Fullstack — Guia de Evolução

## Objetivo

Evoluir este projeto de um backend Node.js/Express para um **e-commerce fullstack production-ready** que demonstre domínio de:
- **Node.js + JavaScript** (backend — manter como está)
- **React + TypeScript** (frontend — projeto separado em `/frontend`)
- **PostgreSQL** (banco relacional — Aurora na AWS, já provisionado)
- **Docker** (containerização backend + frontend)
- **Testes automatizados** (Jest, React Testing Library, Cypress)
- **RBAC** (já implementado, manter e expandir)
- **UX/UI** (design minimalista, clean, com princípios de usabilidade)

Este projeto serve como portfólio para vagas **Fullstack Node + React PL** (ex: MadeiraMadeira).

---

## Contexto da Vaga-Alvo (MadeiraMadeira — Fullstack Node + React PL)

A vaga pede:
- Node.js (JavaScript/TypeScript) + React (Hooks, Context API)
- REST APIs e integrações
- MySQL (temos PostgreSQL — ambos SQL relacional, demonstra o mesmo domínio)
- Docker
- Diferenciais: testes (Jest, Testing Library, Cypress), Redis, Clean Code, SOLID

---

## Estado Atual do Projeto

### Backend (`/Backend`) — JavaScript
- **Runtime:** Node.js + Express (JavaScript)
- **ORM:** Sequelize com PostgreSQL (Aurora AWS)
- **Auth:** JWT + bcryptjs + sessions
- **RBAC:** Sistema de roles (admin/user) com permissões granulares
- **Models:** User, Product, Cart, CartItem, Transaction
- **Routes:** `/api/v1/users`, `/api/v1/products`, `/api/v1/cart`, `/api/v1/payment`
- **Infra:** Docker + docker-compose, dotenv
- **Status:** Precisa de revisão rigorosa — pode ter bugs

### O que NÃO tem ainda
- Frontend (só um `public/index.html` estático)
- Testes
- README
- Campos em inglês (atualmente em PT: nome, preco, estoque, etc.)

---

## Estrutura de Pastas Final

```
/ecommerce-nodejs
├── Backend/                  # Node.js + Express (JavaScript)
│   ├── config/
│   ├── controllers/
│   ├── lib/rbac/
│   ├── middleware/
│   ├── models/
│   ├── routes/v1/
│   ├── services/
│   ├── seeds/                # NEW — seed data
│   ├── __tests__/            # NEW — Jest + supertest
│   ├── Dockerfile
│   ├── package.json
│   └── app.js
├── frontend/                 # NEW — React + TypeScript + Vite
│   ├── src/
│   │   ├── components/       # Reutilizáveis: Button, Input, Card, Modal, Layout, Toast
│   │   ├── pages/            # Login, Register, Products, ProductDetail, Cart, Checkout, Admin
│   │   ├── contexts/         # AuthContext, CartContext
│   │   ├── hooks/            # useAuth, useCart, useProducts
│   │   ├── services/         # api.ts (axios wrapper)
│   │   ├── types/            # Interfaces TypeScript
│   │   ├── utils/            # Formatters, validators
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
├── docker-compose.yml        # Raiz — orquestra backend + frontend
├── CLAUDE.md
└── README.md
```

---

## Pipeline de Execução — 7 Dias

### Formato de Checkpoints

Cada checkpoint é um estado funcional verificável. O Claude deve:
1. Marcar `[x]` ao completar cada item
2. Ao final de cada dia, listar o que foi feito e o que ficou pendente
3. NUNCA avançar para o próximo dia sem o checkpoint anterior estar verde
4. SEMPRE consultar o usuário antes de alterar código existente

---

### DIA 1: Revisão e Fix do Backend

**Objetivo:** Backend 100% funcional e padronizado em inglês.

#### 1.1 — Revisão de endpoints
- [x] Subir o backend localmente e testar CADA endpoint com curl/Postman
- [x] Documentar quais endpoints funcionam e quais estão quebrados
- [x] **CONSULTAR O USUÁRIO** antes de aplicar qualquer fix
- [x] Corrigir todos os bugs encontrados

#### 1.2 — Migrar campos para inglês
- [x] Models: `nome` → `name`, `preco` → `price`, `estoque` → `stock`, `data_nasc` → `birthDate`, `valorTotal` → `totalAmount`, `metodoPagamento` → `paymentMethod`
- [x] Controllers e services: atualizar referências
- [x] RBAC config: manter (já está em inglês)
- [x] Variáveis, comentários, mensagens de erro: tudo para inglês
- [x] **CONSULTAR O USUÁRIO** sobre o impacto no banco Aurora (precisa recriar tabelas?)

#### 1.3 — Melhorias na API
- [x] Padronizar respostas: sucesso `{ data: ... }`, erro `{ error: string, statusCode: number }`
- [x] Adicionar validação de input nos controllers
- [x] Adicionar paginação no `GET /products` (`?page=1&limit=20`)
- [x] Criar seed script (`/Backend/seeds/seed.js`) com dados demo

#### 1.4 — Health check
- [x] Adicionar `GET /api/v1/health` → `{ status: "ok", uptime: ..., db: "connected" }`

**CHECKPOINT DIA 1:**
```
✅ Todos os endpoints respondem corretamente
✅ Campos e código 100% em inglês
✅ Respostas padronizadas
✅ Seed script funciona
✅ Health check respondendo
```

---

### DIA 2: Setup Frontend + Autenticação

**Objetivo:** Frontend React rodando com login/registro funcional.

#### 2.1 — Setup do projeto
- [x] Criar frontend com Vite: `npm create vite@latest frontend -- --template react-ts`
- [x] Instalar: `tailwindcss`, `axios`, `react-router-dom`
- [x] Configurar Tailwind CSS
- [x] Configurar proxy no `vite.config.ts` (`/api` → `http://localhost:3000`)
- [x] Criar `services/api.ts` (axios instance com baseURL e interceptor para JWT)

#### 2.2 — Design System base (UX/UI)
- [x] Definir paleta de cores no Tailwind config (neutros + 1 accent color)
- [x] Criar componentes base com design consistente:
  - `Button` (primary, secondary, danger, disabled states)
  - `Input` (com label, error state, focus ring)
  - `Card` (shadow, hover effect)
  - `Layout` (header com nav, main content, footer)
  - `Toast` (success, error, info — feedback visual)
  - `Spinner` (loading state)
  - `EmptyState` (quando lista está vazia)
- [x] Tipografia: hierarquia clara (h1-h4, body, caption)
- [x] Espaçamento consistente (usar scale do Tailwind: 4, 8, 12, 16, 24)

#### 2.3 — Autenticação
- [x] Criar `AuthContext` com: `user`, `token`, `login()`, `logout()`, `isAuthenticated`, `isAdmin`
- [x] Hook `useAuth()` que consome o context
- [x] Página **Login** — formulário com validação visual (campo vazio, email inválido)
- [x] Página **Register** — formulário com confirmação de senha
- [x] `ProtectedRoute` — redireciona para /login se não autenticado
- [x] `AdminRoute` — redireciona para /home se não admin
- [x] Persistir token no localStorage, restaurar ao recarregar

#### 2.4 — Rotas base
- [x] Configurar React Router:
  - `/login` — público
  - `/register` — público
  - `/products` — público (catálogo)
  - `/products/:id` — público (detalhe)
  - `/cart` — protegido
  - `/checkout` — protegido
  - `/admin` — protegido + admin only
  - `/admin/products` — protegido + admin only

**CHECKPOINT DIA 2:**
```
✅ Frontend sobe com Vite
✅ Tailwind funcionando
✅ Componentes base criados com design consistente
✅ Login e registro funcionam (conectam na API real)
✅ Token persiste no reload
✅ Rotas protegidas redirecionam corretamente
```

---

### DIA 3: Catálogo + Carrinho

**Objetivo:** Fluxo completo de navegação e carrinho funcional.

#### 3.1 — Catálogo de Produtos
- [x] Página **Products** — grid de cards responsivo (mobile: 1 col, tablet: 2, desktop: 3-4)
- [x] Cada card: imagem placeholder, nome, preço formatado (R$), botão "Add to Cart"
- [x] Barra de busca (filtro por nome, client-side)
- [x] Paginação (consumir `?page=&limit=` do backend)
- [x] Loading skeleton enquanto carrega
- [x] Empty state quando sem resultados

#### 3.2 — Detalhe do Produto
- [x] Página **ProductDetail** (`/products/:id`)
- [x] Info completa: nome, descrição, preço, estoque disponível
- [x] Seletor de quantidade
- [x] Botão "Add to Cart" (desabilitado se estoque = 0)
- [x] Breadcrumb: Home > Products > Nome do Produto

#### 3.3 — Carrinho
- [x] `CartContext` com: `items`, `addItem()`, `removeItem()`, `updateQuantity()`, `total`, `itemCount`, `clearCart()`
- [x] Página **Cart** — lista de itens com:
  - Nome, preço unitário, seletor de quantidade, subtotal, botão remover
  - Total geral no footer
  - Botão "Proceed to Checkout"
  - Botão "Continue Shopping"
- [x] Badge no header com contagem de itens
- [x] Persistir carrinho no localStorage (restaurar ao recarregar)
- [x] Toast ao adicionar item ("Product added to cart")

#### 3.4 — UX touches
- [x] Hover effects nos cards (scale sutil, shadow)
- [x] Transições suaves (opacity, transform — usar Tailwind `transition`)
- [x] Feedback visual em todas as ações (add, remove, error)
- [x] Scroll to top ao navegar entre páginas

**CHECKPOINT DIA 3:**
```
✅ Catálogo renderiza produtos do banco real
✅ Busca e paginação funcionam
✅ Detalhe do produto abre corretamente
✅ Carrinho adiciona, remove, atualiza quantidade
✅ Badge do header atualiza em tempo real
✅ Layout responsivo (testar em 320px, 768px, 1280px)
```

---

### DIA 4: Checkout + Painel Admin

**Objetivo:** Fluxo de compra completo + RBAC visual no admin.

#### 4.1 — Checkout
- [x] Página **Checkout** — resumo do pedido + formulário de pagamento
- [x] Campos: método de pagamento (select: credit_card, pix, bank_transfer)
- [x] Resumo: lista de itens, quantidades, subtotais, total
- [x] Botão "Place Order" → chama `POST /api/v1/payment`
- [x] Sucesso: tela de confirmação com número do pedido, limpar carrinho
- [x] Erro: toast com mensagem, manter dados do formulário

#### 4.2 — Painel Admin
- [x] Layout admin separado (sidebar com navegação: Dashboard, Products, Transactions)
- [x] **Dashboard** (`/admin`):
  - Total de pedidos (count)
  - Receita total (sum)
  - Produtos em estoque
  - Cards com números grandes, clean
- [x] **Products CRUD** (`/admin/products`):
  - Tabela com todos os produtos (nome, preço, estoque, ações)
  - Botão "New Product" → modal/formulário de criação
  - Botão "Edit" → modal/formulário de edição
  - Botão "Delete" → confirmação antes de deletar
- [x] **Transactions** (`/admin/transactions`):
  - Tabela de transações (ID, usuário, valor, método, status, data)
  - Filtro por status (pending, completed, cancelled)

#### 4.3 — RBAC visual
- [x] Menu do header muda baseado na role:
  - User: Products, Cart, My Orders
  - Admin: Products, Cart, Admin Panel
- [x] Acessar `/admin` como user → redireciona para `/products`
- [x] Botões de ação admin (edit, delete product) só aparecem para admin

**CHECKPOINT DIA 4:**
```
✅ Fluxo completo: login → catálogo → carrinho → checkout → confirmação
✅ Painel admin acessível só para admin
✅ CRUD de produtos funciona no admin
✅ Dashboard mostra métricas reais do banco
✅ Transações listadas com filtro
```

---

### DIA 5: Testes

**Objetivo:** Cobertura de testes em ambas as camadas + 1 E2E.

#### 5.1 — Testes do Backend (Jest + supertest)
- [x] Instalar: `jest`, `supertest` no Backend
- [x] Criar `Backend/__tests__/` com:
  - `users.test.js` — register (201), login (200 + token), login inválido (401)
  - `products.test.js` — listar (200), criar sem auth (401), criar como admin (201), criar como user (403)
  - `cart.test.js` — adicionar item (201), listar carrinho (200), carrinho sem auth (401)
  - `payment.test.js` — checkout com carrinho válido (201), checkout sem auth (401)
- [x] Usar banco de teste (env `NODE_ENV=test` com database separado ou SQLite in-memory)
- [x] Script: `"test": "jest --coverage --forceExit"`
- [x] Meta: coverage > 60% (67.66% achieved)

#### 5.2 — Testes do Frontend (Vitest + React Testing Library)
- [x] Instalar: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`
- [x] Configurar vitest no `vite.config.ts`
- [x] Testes de componentes:
  - `Button.test.tsx` — renderiza, click handler, disabled state
  - `ProductCard.test.tsx` — renderiza nome e preço, botão add funciona
  - `CartItem.test.tsx` — renderiza, alterar quantidade, remover
  - `LoginForm.test.tsx` — validação, submit
- [x] Testes de contexts:
  - `AuthContext.test.tsx` — login seta user, logout limpa, persiste token
  - `CartContext.test.tsx` — add/remove/update/clear
- [x] Script: `"test": "vitest run --coverage"`

#### 5.3 — Teste E2E (Cypress)
- [x] Instalar Cypress no frontend: `npm install -D cypress`
- [x] Criar 1 fluxo E2E completo:
  - **Fluxo de compra:** Login → Navegar catálogo → Adicionar 2 produtos → Ir ao carrinho → Checkout → Confirmação
- [x] Script: `"test:e2e": "cypress run"`

**CHECKPOINT DIA 5:**
```
✅ Testes backend passando (>= 6 test cases)
✅ Testes frontend passando (>= 8 test cases)
✅ E2E Cypress passando (1 fluxo completo)
✅ Coverage reports gerados
```

---

### DIA 6: Docker + Polish

**Objetivo:** Um comando sobe tudo. UX polida.

#### 6.1 — Docker
- [x] Criar `frontend/Dockerfile` (multi-stage: build com node, serve com nginx)
- [x] Criar `docker-compose.yml` na raiz:
  ```yaml
  services:
    api:
      build: ./Backend
      ports: ["3000:3000"]
      env_file: ./Backend/.env

    client:
      build: ./frontend
      ports: ["5173:80"]
      depends_on: [api]
  ```
- [ ] Testar: `docker compose up --build` sobe ambos (pendente: configurar Aurora)
- [x] Configurar nginx no frontend para fazer proxy de `/api` para o backend

#### 6.2 — Seed script
- [x] `Backend/seeds/seed.js` que popula:
  - 2 usuários (1 admin, 1 user)
  - 12+ produtos com dados realistas (nome, descrição, preço, estoque)
- [x] Executável via `npm run seed`

#### 6.3 — UX Polish
- [x] Revisar responsividade em todas as páginas (320px → 1440px)
- [x] Verificar loading states em todas as chamadas API
- [x] Verificar error states (API offline, 500, 404)
- [x] Favicon e título da aba
- [x] 404 page bonita
- [x] Animações sutis (page transitions, card hover, button press)

**CHECKPOINT DIA 6:**
```
✅ docker compose up sobe backend + frontend
✅ Seed popula banco com dados demo
✅ App funcional e polida em todas as resoluções
✅ Todos os edge cases tratados (loading, error, empty)
```

---

### DIA 7: README + Deploy + Finalização

**Objetivo:** Projeto pronto para o currículo.

#### 7.1 — README.md
- [ ] Header com nome do projeto + badges (Node.js, React, TypeScript, PostgreSQL, Docker, Jest)
- [ ] Screenshot ou GIF da aplicação
- [ ] Seções:
  - **About** — 2-3 frases sobre o projeto
  - **Tech Stack** — tabela com backend/frontend/infra
  - **Getting Started** — pré-requisitos, clone, env vars, docker compose up
  - **API Endpoints** — tabela com método, rota, descrição, auth required
  - **Architecture** — diagrama ASCII simples (client → API → DB)
  - **Testing** — como rodar testes, coverage
  - **Screenshots** — 3-4 screenshots (catálogo, carrinho, admin, mobile)

#### 7.2 — Deploy
- [ ] Frontend: Vercel (conectar repo GitHub)
- [ ] Backend: Railway ou Render (free tier)
- [ ] Banco: já está no Aurora AWS
- [ ] Testar deploy end-to-end
- [ ] Adicionar link do deploy no README

#### 7.3 — Git cleanup
- [x] Revisar `.gitignore` (node_modules, .env, dist, coverage)
- [ ] Commit history limpo e descritivo
- [ ] Remover arquivos desnecessários

**CHECKPOINT DIA 7:**
```
✅ README completo com screenshots
✅ Deploy funcionando (link público)
✅ Repo limpo e profissional
✅ Pronto para adicionar ao currículo
```

---

## Regras para o Claude durante a implementação

### Comunicação
- **SEMPRE consultar o usuário** antes de alterar código existente no backend
- Explicar O QUE vai fazer e POR QUÊ antes de executar
- Se encontrar um bug, reportar primeiro — não corrigir silenciosamente
- Ao completar um checkpoint, listar o que foi feito e perguntar se pode avançar

### Código — Backend
- Manter **JavaScript** (NÃO migrar para TypeScript)
- Manter **PostgreSQL** (NÃO migrar para MySQL)
- Código em **inglês** (variáveis, funções, mensagens)
- Seguir padrões já existentes (MVC, Sequelize, Express)

### Código — Frontend
- **TypeScript strict** — nada de `any` sem justificativa
- **React** com Hooks e Context API (sem Redux, sem Zustand)
- **Tailwind CSS** para estilização
- **Axios** para chamadas HTTP
- **React Router** para navegação
- Componentes funcionais (sem class components)
- Código em **inglês**

### UX/UI
- Design **minimalista e clean** — branco/cinza/neutros + 1 cor accent
- Mobile-first responsive
- Hierarquia visual clara (tipografia, espaçamento, contraste)
- Feedback em toda ação do usuário (loading, success, error)
- Micro-interações sutis (hover, focus, transitions)
- Acessibilidade básica (labels, alt text, focus management, contrast ratio)
- Whitespace generoso — não encher a tela de informação

### Geral
- Não instalar bibliotecas desnecessárias
- Commits atômicos e descritivos
- Testar antes de marcar checkpoint
- Não pular etapas

---

## Stack Final

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Estilização | Tailwind CSS |
| Estado | Context API + Hooks |
| HTTP Client | Axios |
| Roteamento | React Router |
| Backend | Node.js + Express (JavaScript) |
| ORM | Sequelize |
| Banco | PostgreSQL (Aurora AWS) |
| Auth | JWT + bcrypt + RBAC |
| Testes Backend | Jest + supertest |
| Testes Frontend | Vitest + React Testing Library |
| Testes E2E | Cypress |
| Infra | Docker + docker-compose |

---

## Extras (pós Dia 7)

### Upload de imagens de produtos via S3

**Objetivo:** Permitir upload de fotos reais para os produtos, armazenadas no AWS S3.

**Stack adicional:**
- `multer` — middleware para multipart/form-data no Express
- `@aws-sdk/client-s3` — AWS SDK v3 para upload ao S3

**Alterações necessárias:**
- Backend: adicionar campo `imageUrl` ao model Product, criar middleware de upload com multer (memory storage), integrar com S3 no service
- Frontend: alterar formulário de criação/edição de produto para aceitar arquivo de imagem, exibir imagem real nos ProductCard e ProductDetail (substituir placeholder SVG)
- `.env`: adicionar `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`

**Fluxo:** Frontend envia arquivo → Backend (multer) → S3 → salva URL no Product
