# 🔧 Solução: Foto chegando NULL no Banco

## 🔍 Como Diagnosticar

### 1. Verificar Logs do Servidor

No Railway, vá em **"Deploy Logs"** e procure por estas mensagens quando enviar um pedido:

```
📥 Recebendo requisição de criação de pedido
🔍 FileFilter - Verificando arquivo: {...}
✅ Arquivo aceito pelo fileFilter
✅ Multer processado sem erros
req.file após multer: existe/não existe
🔍 Processando foto...
📸 Foto final que será salva: ...
```

**Se você ver:**
- `req.file após multer: não existe` → O arquivo não está chegando
- `❌ Arquivo rejeitado pelo fileFilter` → Tipo de arquivo não aceito
- `ℹ️  Nenhuma foto enviada` → Foto não foi enviada

### 2. Verificar no App React Native

Adicione estes logs no seu código:

```javascript
const criarPedido = async () => {
  const formData = new FormData();
  
  formData.append('cliente', 'Teste');
  formData.append('tipo', 'Venda');
  formData.append('qtd', '5');
  
  if (foto) {
    console.log('📸 Foto selecionada:', foto);
    console.log('📸 Tipo da foto:', typeof foto);
    
    const filename = foto.split('/').pop();
    console.log('📁 Nome do arquivo:', filename);
    
    formData.append('foto', {
      uri: foto,
      type: 'image/jpeg',
      name: filename || 'foto.jpg',
    });
    
    console.log('✅ Foto adicionada ao FormData');
  } else {
    console.log('❌ Nenhuma foto selecionada');
  }

  try {
    console.log('🚀 Enviando requisição...');
    const response = await api.post('/api/pedidos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('✅ Resposta:', response.data);
  } catch (error) {
    console.error('❌ Erro completo:', error);
    console.error('❌ Dados do erro:', error.response?.data);
  }
};
```

---

## ✅ Solução 1: Usar Base64 (Mais Confiável)

**Recomendado para Railway** - Base64 armazena a imagem diretamente no banco, não precisa de storage de arquivos.

### No React Native:

```javascript
import * as ImagePicker from 'expo-image-picker';

const criarPedidoComBase64 = async (dadosPedido) => {
  // Selecionar imagem COM base64
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.7, // Comprimir para não ficar muito grande
    base64: true, // ⚠️ IMPORTANTE: ativar base64
  });

  if (!result.canceled) {
    // Criar string base64
    const fotoBase64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
    
    // Enviar como JSON normal (não FormData)
    const response = await api.post('/api/pedidos', {
      cliente: dadosPedido.cliente,
      tipo: dadosPedido.tipo,
      qtd: dadosPedido.qtd,
      desc: dadosPedido.desc || null,
      status: dadosPedido.status || 'pendente',
      resumo: dadosPedido.resumo || null,
      foto: fotoBase64, // String base64
    });

    return response.data;
  }
};
```

**Vantagens:**
- ✅ Funciona sempre
- ✅ Não depende de storage de arquivos
- ✅ Imagem fica no banco de dados
- ✅ Funciona em qualquer ambiente

**Desvantagens:**
- ⚠️ Aumenta tamanho do banco (~33% maior)
- ⚠️ Pode ser lento para imagens muito grandes

---

## ✅ Solução 2: Corrigir FormData

Se preferir usar FormData, verifique:

### 1. Configuração do Axios

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://web-production-7e37e.up.railway.app',
  timeout: 30000,
});

// ⚠️ IMPORTANTE: Remover Content-Type para FormData
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // Deixar o navegador definir automaticamente
    delete config.headers['Content-Type'];
  }
  return config;
});

export default api;
```

### 2. Enviar FormData Corretamente

```javascript
const criarPedido = async (dadosPedido, fotoUri) => {
  const formData = new FormData();
  
  // Adicionar campos como strings
  formData.append('cliente', String(dadosPedido.cliente));
  formData.append('tipo', String(dadosPedido.tipo));
  formData.append('qtd', String(dadosPedido.qtd));
  
  // Adicionar foto
  if (fotoUri) {
    const filename = fotoUri.split('/').pop() || 'foto.jpg';
    
    // Para React Native, use este formato
    formData.append('foto', {
      uri: fotoUri,
      type: 'image/jpeg', // ou 'image/png'
      name: filename,
    } as any); // TypeScript precisa do 'as any'
  }

  // NÃO defina Content-Type manualmente!
  const response = await api.post('/api/pedidos', formData);
  return response.data;
};
```

---

## 🎯 Solução Rápida (Recomendada)

**Use Base64** - É a solução mais confiável e funciona sempre:

```javascript
// 1. Selecionar imagem com base64
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 0.7,
  base64: true, // ⚠️ ATIVAR
});

// 2. Criar string base64
const fotoBase64 = `data:image/jpeg;base64,${result.assets[0].base64}`;

// 3. Enviar como JSON
await api.post('/api/pedidos', {
  cliente: 'João',
  tipo: 'Venda',
  qtd: 5,
  foto: fotoBase64, // String base64
});
```

---

## 📋 Checklist

- [ ] Logs do servidor mostram que o arquivo foi recebido?
- [ ] `req.file` existe nos logs?
- [ ] FileFilter aceitou o arquivo?
- [ ] Está usando `base64: true` no ImagePicker?
- [ ] Está removendo `Content-Type` para FormData?
- [ ] Foto está sendo adicionada ao FormData corretamente?

---

## 💡 Recomendação Final

**Para Railway, use Base64!** É mais simples, confiável e não depende de storage persistente.

