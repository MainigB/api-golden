# 🚀 Guia de Instalação e Uso - API Golden

## Passo 1: Instalar as Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

Isso vai instalar todas as dependências necessárias (Express, Prisma, TypeScript, etc.)

## Passo 2: Criar o Arquivo .env

Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```
DATABASE_URL="file:./dev.db"
PORT=3000
```

**No Windows PowerShell:**
```powershell
echo 'DATABASE_URL="file:./dev.db"' > .env
echo 'PORT=3000' >> .env
```

**Ou crie manualmente:** Copie o conteúdo do arquivo `env.example` para um novo arquivo `.env`

## Passo 3: Configurar o Banco de Dados

Execute os seguintes comandos para criar o banco de dados:

```bash
# Gerar o Prisma Client
npx prisma generate

# Criar e aplicar a migration (cria o banco de dados)
npx prisma migrate dev --name init
```

## Passo 4: Iniciar o Servidor

Execute o comando para iniciar a API em modo desenvolvimento:

```bash
npm run dev
```

Você verá a mensagem:
```
🚀 Servidor rodando na porta 3000
```

## ✅ Pronto! A API está funcionando!

---

## 📡 Como Usar a API

### Testar se está funcionando:

Abra o navegador ou use o terminal:

```bash
# No navegador:
http://localhost:3000/health

# No terminal (PowerShell):
curl http://localhost:3000/health
```

Deve retornar: `{"status":"ok","message":"API está funcionando"}`

---

## 🎯 Exemplos Práticos de Uso

### 1. Criar um Novo Pedido

**No PowerShell:**
```powershell
curl -Method POST -Uri "http://localhost:3000/api/pedidos" `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"cliente":"João Silva","tipo":"Venda","qtd":5,"desc":"Produto especial","status":"pendente"}'
```

**Ou usando Postman/Insomnia:**
- Método: `POST`
- URL: `http://localhost:3000/api/pedidos`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "cliente": "João Silva",
  "tipo": "Venda",
  "qtd": 5,
  "desc": "Produto especial",
  "status": "pendente",
  "resumo": "Pedido urgente"
}
```

### 2. Listar Todos os Pedidos

**No PowerShell:**
```powershell
curl http://localhost:3000/api/pedidos
```

**No navegador:**
```
http://localhost:3000/api/pedidos
```

### 3. Buscar um Pedido Específico

**No PowerShell:**
```powershell
curl http://localhost:3000/api/pedidos/1
```

(Substitua `1` pelo ID do pedido que você quer buscar)

### 4. Atualizar o Status de um Pedido

**No PowerShell:**
```powershell
curl -Method PATCH -Uri "http://localhost:3000/api/pedidos/1/status" `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"status":"concluido"}'
```

### 5. Deletar um Pedido

**No PowerShell:**
```powershell
curl -Method DELETE -Uri "http://localhost:3000/api/pedidos/1"
```

---

## 🛠️ Comandos Úteis

### Ver o Banco de Dados Visualmente:
```bash
npm run prisma:studio
```
Isso abre uma interface web em `http://localhost:5555` onde você pode ver e editar os dados.

### Compilar para Produção:
```bash
npm run build
npm start
```

---

## 📋 Resumo dos Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/pedidos` | Criar novo pedido |
| GET | `/api/pedidos` | Listar todos os pedidos |
| GET | `/api/pedidos/:id` | Buscar pedido por ID |
| PUT | `/api/pedidos/:id` | Atualizar pedido completo |
| PATCH | `/api/pedidos/:id/status` | Atualizar apenas status |
| DELETE | `/api/pedidos/:id` | Deletar pedido |

---

## ⚠️ Solução de Problemas

### Erro: "Cannot find module"
Execute novamente: `npm install`

### Erro: "Prisma Client not generated"
Execute: `npx prisma generate`

### Erro: "Database not found"
Execute: `npx prisma migrate dev --name init`

### Porta 3000 já está em uso
Altere a porta no arquivo `.env` para outra (ex: `PORT=3001`)

---

## 🎉 Pronto para usar!

Agora você pode criar, listar, atualizar e deletar pedidos através da API!


