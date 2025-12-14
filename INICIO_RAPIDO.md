# ⚡ Início Rápido - API Golden

## 🎯 3 Passos para Começar

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Configurar Banco de Dados
```bash
# Criar arquivo .env (copie o conteúdo de env.example)
# Depois execute:
npx prisma generate
npx prisma migrate dev --name init
```

### 3️⃣ Iniciar Servidor
```bash
npm run dev
```

**Pronto!** A API estará rodando em `http://localhost:3000`

---

## 🧪 Teste Rápido

### Verificar se está funcionando:
Abra no navegador: `http://localhost:3000/health`

### Criar seu primeiro pedido:
```powershell
curl -Method POST -Uri "http://localhost:3000/api/pedidos" `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"cliente":"Teste","tipo":"Venda","qtd":1}'
```

---

## 📚 Para mais detalhes, veja o arquivo `GUIA_INSTALACAO.md`


