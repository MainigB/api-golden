# 🚀 Instruções - Railway CLI

## Passo a Passo para Aplicar Migrations

### 1. Fazer Login no Railway

Abra o PowerShell ou Terminal e execute:

```powershell
npx @railway/cli login
```

Isso vai:
- Abrir seu navegador
- Pedir para autorizar o Railway CLI
- Após autorizar, volte ao terminal

### 2. Conectar ao Projeto

Na pasta do projeto, execute:

```powershell
npx @railway/cli link
```

Selecione o projeto `api-golden` quando solicitado.

### 3. Aplicar Migrations

Execute:

```powershell
npx @railway/cli run npx prisma migrate deploy
```

Isso vai aplicar as migrations no banco de dados do Railway.

### 4. Verificar se Funcionou

Acesse sua API:
```
https://seu-projeto.up.railway.app/health
```

---

## 🎯 Ou Use o Script Automático

Execute o script que criei:

```powershell
.\aplicar-migrations.ps1
```

O script vai:
1. Verificar se você está logado
2. Conectar ao projeto
3. Aplicar as migrations automaticamente

---

## ⚠️ Se Der Erro

### Erro: "Not logged in"
Execute: `npx @railway/cli login`

### Erro: "No project linked"
Execute: `npx @railway/cli link`

### Erro: "DATABASE_URL not found"
- Verifique se o PostgreSQL foi criado no Railway
- Vá em "Variables" e confirme que `DATABASE_URL` existe

---

## 📝 Comandos Úteis

```powershell
# Ver status do projeto
npx @railway/cli status

# Ver logs
npx @railway/cli logs

# Ver variáveis de ambiente
npx @railway/cli variables

# Abrir dashboard
npx @railway/cli open
```




