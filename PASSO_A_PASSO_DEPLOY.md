# 🚀 Passo a Passo - Deploy no Railway

## ✅ Passo 1: Git Configurado (JÁ FEITO!)
O repositório Git foi inicializado e o commit foi feito.

## 📤 Passo 2: Criar Repositório no GitHub

1. **Acesse:** https://github.com/new
2. **Nome do repositório:** `api-golden` (ou outro nome de sua escolha)
3. **Descrição:** "API para gerenciamento de pedidos"
4. **Visibilidade:** Público ou Privado (sua escolha)
5. **⚠️ IMPORTANTE:** NÃO marque "Add a README file"
6. **Clique em:** "Create repository"

## 🔗 Passo 3: Conectar ao GitHub

Após criar o repositório, GitHub mostrará comandos. Execute no terminal:

**Substitua `SEU-USUARIO` pelo seu usuário do GitHub:**

```powershell
git remote add origin https://github.com/SEU-USUARIO/api-golden.git
git push -u origin main
```

**Ou execute o script:**
```powershell
.\deploy.ps1
```

## 🌐 Passo 4: Deploy no Railway

1. **Acesse:** https://railway.app
2. **Clique em:** "Login" ou "Start a New Project"
3. **Escolha:** "Login with GitHub"
4. **Autorize** o Railway a acessar seus repositórios

5. **Criar Projeto:**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório `api-golden`

6. **Adicionar Banco de Dados:**
   - No projeto criado, clique em "+ New"
   - Selecione "Database"
   - Escolha "Add PostgreSQL"
   - Railway criará automaticamente o banco

7. **Configurar Variáveis (Automático):**
   - Railway já adiciona automaticamente a `DATABASE_URL`
   - Não precisa fazer nada!

8. **Aguardar Deploy:**
   - Railway detecta automaticamente o `package.json`
   - Executa `npm install` e `npm run build`
   - Inicia com `npm start`
   - Aguarde alguns minutos (2-5 min)

## 🗄️ Passo 5: Aplicar Migrations

Após o deploy completar:

1. **No Railway:**
   - Vá em "Deploy Logs"
   - Clique em "View Logs"
   - Procure por erros

2. **Aplicar Migrations:**
   - No projeto Railway, clique em "PostgreSQL"
   - Vá em "Connect" ou "Query"
   - Ou use o terminal do Railway

   **Ou localmente (com DATABASE_URL do Railway):**
   ```bash
   # Copie a DATABASE_URL do Railway (em Variables)
   # Cole no seu .env local temporariamente
   npx prisma migrate deploy
   ```

## ✅ Passo 6: Testar API Online

Sua API estará em: `https://seu-projeto.up.railway.app`

### Teste Health Check:
```
https://seu-projeto.up.railway.app/health
```

### Teste Criar Pedido:
```bash
curl -X POST https://seu-projeto.up.railway.app/api/pedidos `
  -H "Content-Type: application/json" `
  -Body '{"cliente":"Teste","tipo":"Venda","qtd":1}'
```

## 🎉 Pronto!

Sua API está online e acessível de qualquer lugar!

---

## 🆘 Problemas Comuns

### Erro no Push para GitHub:
- Verifique se você está logado: `git config --global user.name`
- Configure se necessário: `git config --global user.email "seu@email.com"`

### Railway não encontra o projeto:
- Verifique se o repositório está público (ou você autorizou acesso)
- Tente fazer deploy manual: "New Project" → "Empty Project" → "Connect GitHub"

### Erro de Migrations:
- Certifique-se que o PostgreSQL foi criado
- Verifique se a `DATABASE_URL` está configurada
- Execute: `npx prisma migrate deploy`

