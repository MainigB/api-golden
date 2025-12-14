# ⚡ Deploy Rápido - API Online

## 🎯 Método Mais Rápido: Railway

### 1. Coloque seu código no GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/api-golden.git
git push -u origin main
```

### 2. Acesse Railway
- Vá em: https://railway.app
- Faça login com GitHub

### 3. Criar Projeto
- Clique em "New Project"
- Selecione "Deploy from GitHub repo"
- Escolha seu repositório

### 4. Adicionar PostgreSQL
- No projeto, clique em "+ New"
- Selecione "Database" → "Add PostgreSQL"
- Railway cria automaticamente e configura a `DATABASE_URL`

### 5. Deploy Automático
- Railway detecta automaticamente e faz deploy
- Aguarde alguns minutos

### 6. Aplicar Migrations
Após o deploy, no terminal do Railway ou localmente:
```bash
npx prisma migrate deploy
```

### 7. Pronto! 🎉
Sua API estará online em: `https://seu-projeto.up.railway.app`

---

## 📝 Testar API Online

### Health Check:
```
https://seu-projeto.up.railway.app/health
```

### Criar Pedido:
```bash
curl -X POST https://seu-projeto.up.railway.app/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"cliente":"Teste","tipo":"Venda","qtd":1}'
```

---

## 🔄 Alternativas Rápidas

### Render.com
1. Acesse: https://render.com
2. New → Web Service
3. Conecte GitHub
4. Build: `npm install && npm run build`
5. Start: `npm start`
6. Adicione PostgreSQL database
7. Configure `DATABASE_URL`

### Fly.io
```bash
fly launch
fly postgres create
fly deploy
```

---

## ⚠️ Importante

- O banco de dados agora é **PostgreSQL** (não SQLite)
- A `DATABASE_URL` é fornecida automaticamente pelos serviços
- Não precisa criar arquivo `.env` no servidor
- As migrations precisam ser aplicadas após o primeiro deploy

---

Para mais detalhes, veja: `GUIA_DEPLOY.md`


