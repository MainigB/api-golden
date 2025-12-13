# API Golden - Sistema de Gerenciamento de Pedidos

API REST para gerenciamento de pedidos com CRUD completo.

## 🚀 Tecnologias

- **Node.js** com **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados (pode ser facilmente migrado para PostgreSQL/MySQL)

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure o banco de dados:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

3. Inicie o servidor em modo desenvolvimento:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## 🗄️ Estrutura do Banco de Dados

### Modelo Pedido

- `id` - ID único (auto-incremento)
- `cliente` - Nome do cliente
- `data` - Data do pedido
- `tipo` - Tipo do pedido
- `qtd` - Quantidade
- `desc` - Descrição (opcional)
- `status` - Status do pedido (pendente, processando, concluido, cancelado)
- `resumo` - Resumo do pedido (opcional)

## 📡 Endpoints da API

### Base URL: `http://localhost:3000/api/pedidos`

#### 1. Criar Pedido
```
POST /api/pedidos
Content-Type: application/json

{
  "cliente": "João Silva",
  "data": "2024-01-15T10:30:00Z",
  "tipo": "Venda",
  "qtd": 2,
  "desc": "Produto especial",
  "status": "pendente",
  "resumo": "Pedido urgente para cliente VIP"
}
```

#### 2. Listar Todos os Pedidos
```
GET /api/pedidos
```

#### 3. Buscar Pedido por ID
```
GET /api/pedidos/:id
```

#### 4. Atualizar Pedido (Completo)
```
PUT /api/pedidos/:id
Content-Type: application/json

{
  "cliente": "João Silva",
  "tipo": "Venda",
  "qtd": 3,
  "status": "concluido",
  "resumo": "Pedido entregue com sucesso"
}
```

#### 5. Atualizar Status do Pedido (Apenas Status)
```
PATCH /api/pedidos/:id/status
Content-Type: application/json

{
  "status": "concluido"
}
```

#### 6. Deletar Pedido
```
DELETE /api/pedidos/:id
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm start` - Inicia o servidor em produção
- `npm run prisma:generate` - Gera o Prisma Client
- `npm run prisma:migrate` - Executa as migrations
- `npm run prisma:studio` - Abre o Prisma Studio (interface visual do banco)

## 📝 Exemplo de Uso

### Exemplos de Uso

#### Criar um pedido:
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": "Maria Santos",
    "data": "2024-01-15T10:30:00Z",
    "tipo": "Compra",
    "qtd": 5,
    "desc": "Mouse Gamer RGB",
    "status": "pendente",
    "resumo": "Pedido de equipamentos"
  }'
```

#### Listar todos os pedidos:
```bash
curl http://localhost:3000/api/pedidos
```

#### Buscar pedido por ID:
```bash
curl http://localhost:3000/api/pedidos/1
```

#### Atualizar status do pedido:
```bash
curl -X PATCH http://localhost:3000/api/pedidos/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "concluido"
  }'
```

#### Deletar pedido:
```bash
curl -X DELETE http://localhost:3000/api/pedidos/1
```

## 🔧 Configuração

O arquivo `.env` deve conter:
```
DATABASE_URL="file:./dev.db"
PORT=3000
```

Para usar PostgreSQL ou MySQL, altere o `DATABASE_URL` e o `provider` no `prisma/schema.prisma`.

