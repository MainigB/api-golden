# 📸 Guia Completo - Upload de Foto no React Native

## 📦 Instalação de Dependências

Para trabalhar com imagens no React Native, você precisará:

```bash
# Para selecionar imagem da galeria/câmera
npm install expo-image-picker
# ou
npm install react-native-image-picker

# Para manipular FormData
# (já incluído no React Native)
```

---

## 🎯 Método 1: Upload com FormData (Recomendado)

### Exemplo Completo com Expo Image Picker

```javascript
import React, { useState } from 'react';
import { View, Button, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from './services/api';

const CriarPedidoComFoto = () => {
  const [foto, setFoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Selecionar imagem da galeria
  const selecionarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  // Tirar foto com a câmera
  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para usar a câmera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  // Criar pedido com foto
  const criarPedido = async () => {
    if (!foto) {
      Alert.alert('Atenção', 'Selecione uma foto primeiro');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      
      formData.append('cliente', 'João Silva');
      formData.append('tipo', 'Venda');
      formData.append('qtd', '5');
      formData.append('desc', 'Produto com foto');
      formData.append('status', 'pendente');

      // Adicionar foto ao FormData
      const filename = foto.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append('foto', {
        uri: foto,
        type: type,
        name: filename || 'foto.jpg',
      } as any);

      const response = await api.post('/api/pedidos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Sucesso', 'Pedido criado com foto!');
      console.log('Pedido criado:', response.data);
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro', 'Não foi possível criar o pedido');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {foto && (
        <Image 
          source={{ uri: foto }} 
          style={{ width: 200, height: 200, marginBottom: 20 }} 
        />
      )}
      
      <Button title="Selecionar da Galeria" onPress={selecionarImagem} />
      <View style={{ marginVertical: 10 }} />
      <Button title="Tirar Foto" onPress={tirarFoto} />
      <View style={{ marginVertical: 10 }} />
      
      {uploading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Criar Pedido" onPress={criarPedido} disabled={!foto} />
      )}
    </View>
  );
};

export default CriarPedidoComFoto;
```

---

## 🎯 Método 2: Upload com Base64

### Exemplo com Base64

```javascript
import React, { useState } from 'react';
import { View, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from './services/api';

const CriarPedidoComBase64 = () => {
  const [foto, setFoto] = useState(null);
  const [fotoBase64, setFotoBase64] = useState(null);

  const selecionarImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true, // Importante: ativar base64
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
      setFotoBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const criarPedido = async () => {
    try {
      const response = await api.post('/api/pedidos', {
        cliente: 'João Silva',
        tipo: 'Venda',
        qtd: 5,
        desc: 'Produto com foto',
        foto: fotoBase64, // Enviar base64
      });

      Alert.alert('Sucesso', 'Pedido criado!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o pedido');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {foto && <Image source={{ uri: foto }} style={{ width: 200, height: 200 }} />}
      <Button title="Selecionar Foto" onPress={selecionarImagem} />
      <Button title="Criar Pedido" onPress={criarPedido} />
    </View>
  );
};
```

---

## 🎯 Método 3: Usando React Native Image Picker

```javascript
import React, { useState } from 'react';
import { View, Button, Image, Alert } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import api from './services/api';

const CriarPedidoComRNImagePicker = () => {
  const [foto, setFoto] = useState(null);

  const selecionarImagem = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets[0]) {
        setFoto(response.assets[0].uri);
      }
    });
  };

  const criarPedido = async () => {
    if (!foto) return;

    const formData = new FormData();
    formData.append('cliente', 'João Silva');
    formData.append('tipo', 'Venda');
    formData.append('qtd', '5');
    
    formData.append('foto', {
      uri: foto,
      type: 'image/jpeg',
      name: 'foto.jpg',
    });

    try {
      const response = await api.post('/api/pedidos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Sucesso', 'Pedido criado!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar pedido');
    }
  };

  return (
    <View>
      {foto && <Image source={{ uri: foto }} style={{ width: 200, height: 200 }} />}
      <Button title="Selecionar Foto" onPress={selecionarImagem} />
      <Button title="Criar Pedido" onPress={criarPedido} />
    </View>
  );
};
```

---

## 📱 Exibir Foto do Pedido

```javascript
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const PedidoCard = ({ pedido }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cliente}>{pedido.cliente}</Text>
      <Text>Tipo: {pedido.tipo}</Text>
      <Text>Qtd: {pedido.qtd}</Text>
      
      {pedido.foto && (
        <Image 
          source={{ uri: pedido.foto }} 
          style={styles.foto}
          resizeMode="cover"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  cliente: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  foto: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12,
  },
});

export default PedidoCard;
```

---

## ⚙️ Configuração do Axios para FormData

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://web-production-7e37e.up.railway.app',
  timeout: 30000, // Aumentar timeout para uploads
});

// Interceptor para FormData (não definir Content-Type automaticamente)
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // Deixar o navegador definir o Content-Type com boundary
    delete config.headers['Content-Type'];
  }
  return config;
});

export default api;
```

---

## 🔧 Atualizar Pedido com Nova Foto

```javascript
const atualizarFotoPedido = async (pedidoId, novaFotoUri) => {
  const formData = new FormData();
  
  const filename = novaFotoUri.split('/').pop();
  formData.append('foto', {
    uri: novaFotoUri,
    type: 'image/jpeg',
    name: filename || 'foto.jpg',
  });

  try {
    const response = await api.put(`/api/pedidos/${pedidoId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar foto:', error);
    throw error;
  }
};
```

---

## 📝 Resumo

### FormData (Recomendado para arquivos grandes)
- ✅ Melhor performance
- ✅ Menor uso de memória
- ✅ Suporta arquivos grandes
- ❌ Requer configuração especial do Axios

### Base64 (Recomendado para imagens pequenas)
- ✅ Mais simples de implementar
- ✅ Funciona com JSON normal
- ❌ Aumenta tamanho em ~33%
- ❌ Pode ser lento para imagens grandes

---

## 🎯 Recomendação

Para React Native, use **FormData** com **Expo Image Picker** ou **React Native Image Picker**. É a solução mais eficiente e nativa.

