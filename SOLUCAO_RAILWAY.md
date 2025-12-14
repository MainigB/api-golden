# 🔧 Solução para Erro no Railway

## ❌ Erro Encontrado:
```
Error: Environment variable not found: DATABASE_URL
```

## ✅ Solução Aplicada:

O problema era que o script de build tentava executar `prisma migrate deploy` antes da `DATABASE_URL` estar disponível.

### O que foi corrigido:

1. **Removido `prisma migrate deploy` do build**
   - O build agora só gera o Prisma Client e compila TypeScript
   - As migrations serão aplicadas manualmente após o deploy

2. **Criado script separado para migrations:**
   ```bash
   npm run prisma:migrate:deploy
   ```

## 📋 Passos para Resolver:

### 1. Fazer commit e push das correções:
```bash
git add .
git commit -m "Fix: Remover migrate deploy do build"
git push
```

### 2. No Railway:

**Opção A - Aplicar migrations via Railway CLI:**
1. Instale Railway CLI: https://railway.app/cli
2. Execute:
   ```bash
   railway login
   railway link
   railway run npx prisma migrate deploy
   ```

**Opção B - Aplicar migrations via Terminal do Railway:**
1. No projeto Railway, clique em "View Logs"
2. Vá em "Deployments" → Selecione o deployment
3. Clique em "Shell" ou "Terminal"
4. Execute:
   ```bash
   npx prisma migrate deploy
   ```

**Opção C - Aplicar migrations localmente:**
1. No Railway, vá em "Variables"
2. Copie a `DATABASE_URL`
3. No seu `.env` local, adicione temporariamente:
   ```
   DATABASE_URL="cole_aqui_a_url_do_railway"
   ```
4. Execute:
   ```bash
   npx prisma migrate deploy
   ```
5. Remova a linha do `.env` local

### 3. Verificar se funcionou:
Acesse: `https://seu-projeto.up.railway.app/health`

---

## 🎯 Próximos Passos:

1. ✅ Fazer push das correções
2. ✅ Aguardar novo deploy no Railway
3. ✅ Aplicar migrations (uma das opções acima)
4. ✅ Testar a API

---

## 💡 Dica:

Após aplicar as migrations uma vez, o Railway pode fazer deploy automático. Se quiser automatizar as migrations no futuro, você pode criar um script de inicialização que verifica e aplica migrations automaticamente.




