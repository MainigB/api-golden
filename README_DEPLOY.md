# 🌐 Como Colocar a API Online

## ⚡ Método Mais Rápido: Railway (Recomendado)

### Passo 1: Colocar código no GitHub
```bash
git init
git add .
git commit -m "API Golden - Pronto para deploy"
git remote add origin https://github.com/SEU-USUARIO/api-golden.git
git push -u origin main
```

### Passo 2: Deploy no Railway
1. Acesse: https://railway.app
2. Login com GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecione seu repositório
5. Adicione PostgreSQL: "+ New" → "Database" → "Add PostgreSQL"
6. Railway faz deploy automático!

### Passo 3: Aplicar Migrations
Após o deploy, execute:
```bash
npx prisma migrate deploy
```

### Pronto! 🎉
Sua API estará em: `https://seu-projeto.up.railway.app`

---

## 📡 Testar API Online

### Health Check:
```
GET https://seu-projeto.up.railway.app/health
```

### Criar Pedido:
```bash
curl -X POST https://seu-projeto.up.railway.app/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"cliente":"João","tipo":"Venda","qtd":5}'
```

---

## 🔄 Desenvolvimento Local vs Produção

### Desenvolvimento Local (SQLite):
- Use: `DATABASE_URL="file:./dev.db"`
- Schema já configurado para PostgreSQL
- Para usar SQLite local, altere `prisma/schema.prisma`:
  - Mude `provider = "postgresql"` para `provider = "sqlite"`

### Produção (PostgreSQL):
- Railway/Render fornecem `DATABASE_URL` automaticamente
- Não precisa configurar nada
- Schema já está pronto para PostgreSQL

---

## 📚 Mais Opções de Deploy

Veja o arquivo `GUIA_DEPLOY.md` para:
- Render.com
- Fly.io
- Vercel
- Instruções detalhadas

---

## ⚠️ Importante

- ✅ Código está pronto para PostgreSQL (produção)
- ✅ Railway/Render configuram tudo automaticamente
- ✅ Apenas precisa fazer push para GitHub e conectar no serviço
- ✅ Migrations precisam ser aplicadas após primeiro deploy



