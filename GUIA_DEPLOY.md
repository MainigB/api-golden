# 🌐 Guia de Deploy - Colocar API Online

Este guia mostra como colocar sua API online usando diferentes serviços gratuitos.

---

## 🚀 Opção 1: Railway (Recomendado - Mais Fácil)

Railway é gratuito e muito fácil de usar!

### Passo a Passo:

1. **Criar conta no Railway:**
   - Acesse: https://railway.app
   - Faça login com GitHub

2. **Criar novo projeto:**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Conecte seu repositório GitHub

3. **Adicionar banco de dados PostgreSQL:**
   - No projeto, clique em "+ New"
   - Selecione "Database" → "Add PostgreSQL"
   - Railway criará automaticamente o banco

4. **Configurar variáveis de ambiente:**
   - Vá em "Variables"
   - Railway já adiciona automaticamente a `DATABASE_URL` do PostgreSQL
   - Adicione `PORT` (Railway define automaticamente, mas pode adicionar `PORT=3000`)

5. **Deploy automático:**
   - Railway detecta automaticamente o `package.json`
   - Executa `npm install` e `npm run build`
   - Inicia com `npm start`

6. **Aplicar migrations:**
   - Após o deploy, vá em "Deploy Logs"
   - Execute manualmente (ou adicione ao build):
   ```bash
   npx prisma migrate deploy
   ```

7. **Sua API estará online!**
   - Railway fornece uma URL como: `https://seu-projeto.up.railway.app`
   - Acesse: `https://seu-projeto.up.railway.app/health`

---

## 🚀 Opção 2: Render

Render também oferece plano gratuito!

### Passo a Passo:

1. **Criar conta no Render:**
   - Acesse: https://render.com
   - Faça login com GitHub

2. **Criar Web Service:**
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório GitHub
   - Configure:
     - **Name:** `api-golden`
     - **Environment:** `Node`
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npm start`
     - **Plan:** Free

3. **Criar banco de dados PostgreSQL:**
   - Clique em "New +" → "PostgreSQL"
   - Configure:
     - **Name:** `api-golden-db`
     - **Plan:** Free
   - Copie a "Internal Database URL"

4. **Configurar variáveis de ambiente:**
   - No Web Service, vá em "Environment"
   - Adicione:
     - `DATABASE_URL` = (URL do PostgreSQL que você copiou)
     - `NODE_ENV` = `production`
     - `PORT` = `10000` (Render usa porta 10000)

5. **Deploy:**
   - Render faz deploy automaticamente
   - Após o deploy, execute as migrations:
   ```bash
   npx prisma migrate deploy
   ```

6. **Sua API estará online!**
   - URL: `https://api-golden.onrender.com`
   - Acesse: `https://api-golden.onrender.com/health`

---

## 🚀 Opção 3: Fly.io

Fly.io é gratuito e muito rápido!

### Passo a Passo:

1. **Instalar Fly CLI:**
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Criar conta:**
   ```bash
   fly auth signup
   ```

3. **Criar app:**
   ```bash
   fly launch
   ```
   - Siga as instruções
   - Escolha região próxima ao Brasil (ex: `gru` - São Paulo)

4. **Criar banco de dados:**
   ```bash
   fly postgres create --name api-golden-db
   ```

5. **Conectar banco ao app:**
   ```bash
   fly postgres attach api-golden-db
   ```

6. **Deploy:**
   ```bash
   fly deploy
   ```

7. **Aplicar migrations:**
   ```bash
   fly ssh console
   npx prisma migrate deploy
   ```

---

## 🚀 Opção 4: Vercel (Para APIs Serverless)

Vercel é ótimo, mas requer ajustes para Prisma.

### Passo a Passo:

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Fazer login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

**Nota:** Vercel funciona melhor com serverless. Para Prisma, considere usar Railway ou Render.

---

## 📋 Checklist Antes do Deploy

- [ ] Código está no GitHub/GitLab
- [ ] Arquivo `.env` não está no repositório (já está no `.gitignore`)
- [ ] `package.json` tem script `build` e `start`
- [ ] Prisma schema está configurado para PostgreSQL
- [ ] Migrations estão criadas localmente

---

## 🔧 Configuração do Banco de Dados

### Para desenvolvimento local (SQLite):
```env
DATABASE_URL="file:./dev.db"
```

### Para produção (PostgreSQL):
```env
DATABASE_URL="postgresql://usuario:senha@host:porta/database?schema=public"
```

**Importante:** Os serviços de deploy fornecem automaticamente a `DATABASE_URL` do PostgreSQL.

---

## 🧪 Testar API Online

Após o deploy, teste sua API:

### Health Check:
```
GET https://sua-api.com/health
```

### Criar Pedido:
```bash
curl -X POST https://sua-api.com/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"cliente":"Teste","tipo":"Venda","qtd":1}'
```

### Listar Pedidos:
```
GET https://sua-api.com/api/pedidos
```

---

## 🆘 Solução de Problemas

### Erro: "Prisma Client not generated"
Adicione ao `package.json`:
```json
"postinstall": "prisma generate"
```

### Erro: "Database connection failed"
Verifique se a `DATABASE_URL` está correta nas variáveis de ambiente.

### Erro: "Migrations not applied"
Execute manualmente:
```bash
npx prisma migrate deploy
```

### API não responde
- Verifique os logs do serviço
- Confirme que a porta está correta
- Verifique se o build foi bem-sucedido

---

## 🎉 Pronto!

Sua API estará online e acessível de qualquer lugar do mundo!

**Recomendação:** Use **Railway** para começar - é o mais simples e gratuito!

