# 🐛 Guia de Debug - Upload de Imagens

## Problemas Comuns e Soluções

### 1. Verificar se o arquivo está sendo enviado

Adicione logs no seu app React Native:

```javascript
const criarPedido = async () => {
  const formData = new FormData();
  
  formData.append('cliente', 'Teste');
  formData.append('tipo', 'Venda');
  formData.append('qtd', '5');
  
  if (foto) {
    console.log('📸 URI da foto:', foto);
    const filename = foto.split('/').pop();
    console.log('📁 Nome do arquivo:', filename);
    
    formData.append('foto', {
      uri: foto,
      type: 'image/jpeg',
      name: filename || 'foto.jpg',
    });
    
    console.log('✅ Foto adicionada ao FormData');
  }

  try {
    console.log('🚀 Enviando requisição...');
    const response = await api.post('/api/pedidos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('✅ Resposta:', response.data);
  } catch (error) {
    console.error('❌ Erro completo:', error);
    console.error('❌ Resposta do servidor:', error.response?.data);
    console.error('❌ Status:', error.response?.status);
  }
};
```

### 2. Verificar Content-Type

O Axios pode estar definindo o Content-Type incorretamente. Use:

```javascript
// src/services/api.js
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // Remover Content-Type para o navegador definir automaticamente
    delete config.headers['Content-Type'];
  }
  return config;
});
```

### 3. Testar com Base64 (Alternativa)

Se FormData não funcionar, teste com base64:

```javascript
import * as ImagePicker from 'expo-image-picker';

const criarPedidoBase64 = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
    base64: true, // IMPORTANTE: ativar base64
  });

  if (!result.canceled) {
    const fotoBase64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
    
    const response = await api.post('/api/pedidos', {
      cliente: 'Teste',
      tipo: 'Venda',
      qtd: 5,
      foto: fotoBase64, // Enviar como string base64
    });
  }
};
```

### 4. Verificar Logs do Servidor

Os logs agora mostram:
- Se o arquivo foi recebido
- Se foi processado pelo multer
- Qual URL foi gerada
- Erros específicos

### 5. Problema no Railway (Armazenamento)

O Railway pode não persistir arquivos no diretório `uploads`. Soluções:

**Opção A: Usar Base64 (Mais Simples)**
- Armazena a imagem como string no banco
- Não precisa de storage persistente
- Funciona em qualquer ambiente

**Opção B: Usar Storage Externo**
- AWS S3
- Cloudinary
- Railway Volumes (pago)

### 6. Testar Endpoint Diretamente

Use Postman ou curl para testar:

```bash
curl -X POST https://web-production-7e37e.up.railway.app/api/pedidos \
  -F "cliente=Teste" \
  -F "tipo=Venda" \
  -F "qtd=5" \
  -F "foto=@/caminho/para/imagem.jpg"
```

### 7. Verificar Tamanho do Arquivo

O limite é 5MB. Se sua imagem for maior:

```javascript
// Comprimir antes de enviar
const result = await ImagePicker.launchImageLibraryAsync({
  quality: 0.5, // Reduzir qualidade
  allowsEditing: true,
});
```

### 8. Verificar Permissões

No React Native, certifique-se de ter permissões:

```javascript
// Para galeria
const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

// Para câmera
const { status } = await ImagePicker.requestCameraPermissionsAsync();
```

---

## 🔍 Checklist de Debug

- [ ] Foto está sendo selecionada corretamente?
- [ ] FormData está sendo criado?
- [ ] Content-Type está correto?
- [ ] Arquivo não excede 5MB?
- [ ] Permissões foram concedidas?
- [ ] Logs do servidor mostram o arquivo?
- [ ] Erro específico está sendo retornado?

---

## 💡 Solução Rápida: Usar Base64

Se o upload de arquivo não funcionar, use base64 que é mais confiável:

```javascript
// Sempre funciona, armazena no banco
const fotoBase64 = `data:image/jpeg;base64,${base64String}`;
await api.post('/api/pedidos', { ...dados, foto: fotoBase64 });
```

