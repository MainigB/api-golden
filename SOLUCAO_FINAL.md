# 🔧 Solução Final - Aplicar Migrations

## ⚠️ Problema Atual
A API está online, mas há erro ao criar/listar pedidos porque as migrations não foram aplicadas no banco de dados.

## ✅ Solução: Aplicar Migrations Manualmente

### Opção 1: Via Railway Dashboard (Mais Simples)

1. **No Railway Dashboard:**
   - Clique no serviço **"web"**
   - Vá em **"Settings"** ou procure por **"Shell"** / **"Terminal"**
   - Se encontrar, abra o terminal

2. **No terminal, execute:**
   ```bash
   npm run prisma:migrate:deploy
   ```

### Opção 2: Via Railway CLI (Se tiver acesso)

```powershell
npx @railway/cli run --service web npm run prisma:migrate:deploy
```

### Opção 3: Verificar DATABASE_URL

1. **No serviço PostgreSQL:**
   - Copie a "Connection URL" ou "Internal Database URL"

2. **No serviço "web":**
   - Vá em "Variables"
   - Verifique se `DATABASE_URL` existe
   - Se não existir, adicione manualmente com a URL do PostgreSQL

### Opção 4: Usar Railway Connect (Mais Fácil)

1. No serviço **PostgreSQL**, clique em **"Connect"**
2. Copie a **"Connection URL"**
3. No serviço **"web"**, vá em **"Variables"**
4. Adicione:
   - **Key:** `DATABASE_URL`
   - **Value:** (cole a Connection URL do PostgreSQL)

5. O Railway vai fazer um novo deploy automaticamente
6. As migrations serão aplicadas automaticamente no próximo deploy

---

## 🧪 Após Aplicar Migrations

Teste criar um pedido:

```powershell
$body = @{cliente='Breno Mainig';tipo='Venda';qtd=10} | ConvertTo-Json
Invoke-WebRequest -Uri https://web-production-7e37e.up.railway.app/api/pedidos -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
```

---

## 📋 Checklist

- [ ] Verificar se `DATABASE_URL` existe no serviço "web"
- [ ] Se não existir, adicionar manualmente
- [ ] Aguardar novo deploy
- [ ] Verificar logs para confirmar que migrations foram aplicadas
- [ ] Testar criar pedido




