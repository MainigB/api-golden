# 🗄️ Aplicar Migrations via Dashboard do Railway

Como o CLI precisa de mais configuração, vamos usar o Dashboard que é mais simples:

## 📋 Passo a Passo:

### 1. Acesse o Dashboard do Railway
- Vá em: https://railway.app
- Faça login se necessário

### 2. Abra o Projeto
- Clique no projeto **outstanding-miracle** (ou o projeto da sua API)

### 3. Encontre o Serviço da API
- Você verá os serviços do projeto
- Clique no serviço da **API** (não no PostgreSQL)

### 4. Abra o Terminal/Shell
- No serviço da API, procure por:
  - **"Shell"** ou
  - **"Terminal"** ou
  - **"Deployments"** → Selecione o deployment → **"Shell"**

### 5. Execute as Migrations
No terminal que abrir, execute:

```bash
npx prisma migrate deploy
```

### 6. Verifique se Funcionou
Você deve ver algo como:
```
✅ Applied migration: 20240101000000_init
```

### 7. Teste a API
Acesse: `https://outstanding-miracle.up.railway.app/health`

---

## 🎯 Alternativa: Via PostgreSQL Service

Se preferir, você também pode:

1. No projeto, clique no serviço **PostgreSQL**
2. Vá em **"Connect"** ou **"Query"**
3. Ou use o terminal do PostgreSQL para executar as migrations

---

## ✅ Pronto!

Após aplicar as migrations, sua API estará totalmente funcional!


