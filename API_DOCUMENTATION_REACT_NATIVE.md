# 📱 Documentação Completa da API - React Native

Documentação completa para consumir a API Golden em aplicações React Native, incluindo upload de fotos.

## 🌐 URL Base da API

```
https://web-production-7e37e.up.railway.app
```

---

## 📦 Instalação

No seu projeto React Native, instale as dependências:

```bash
# Axios para requisições HTTP
npm install axios

# Para selecionar/tirar fotos (Expo)
npm install expo-image-picker

# OU para React Native puro
npm install react-native-image-picker
```

---

## 🔧 Configuração Inicial

### Criar arquivo de configuração da API

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://web-production-7e37e.up.railway.app',
  timeout: 30000, // 30 segundos (importante para uploads)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para FormData (não definir Content-Type automaticamente)
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // Deixar o navegador definir o Content-Type com boundary
    delete config.headers['Content-Type'];
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
```

---

## 📡 Endpoints Disponíveis

### 1. Health Check

Verifica se a API está funcionando.

**GET** `/health`

```javascript
import api from './services/api';

const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    console.log('API Status:', response.data);
    // { status: 'ok', message: 'API está funcionando' }
    return response.data;
  } catch (error) {
    console.error('Erro ao verificar saúde da API:', error);
    throw error;
  }
};
```

---

### 2. Criar Pedido (com Upload de Foto) ⭐

Cria um novo pedido no banco de dados com suporte a foto.

**POST** `/api/pedidos`

**Formato:** `multipart/form-data` (para upload de arquivo) ou `application/json` (para base64)

**Campos:**
- `cliente`: string (obrigatório)
- `tipo`: string (obrigatório)
- `qtd`: number (obrigatório)
- `data`: string (opcional, formato ISO)
- `desc`: string (opcional)
- `status`: string (opcional, padrão: 'pendente')
- `resumo`: string (opcional)
- `foto`: File (opcional) ou base64 string

#### Opção 1: Upload de Arquivo com FormData (Recomendado)

```javascript
import api from './services/api';
import * as ImagePicker from 'expo-image-picker';

const criarPedidoComFoto = async (dadosPedido, fotoUri) => {
  try {
    const formData = new FormData();
    
    // Adicionar dados do pedido
    formData.append('cliente', dadosPedido.cliente);
    formData.append('tipo', dadosPedido.tipo);
    formData.append('qtd', dadosPedido.qtd.toString());
    if (dadosPedido.desc) formData.append('desc', dadosPedido.desc);
    if (dadosPedido.status) formData.append('status', dadosPedido.status);
    if (dadosPedido.resumo) formData.append('resumo', dadosPedido.resumo);
    
    // Adicionar foto se fornecida
    if (fotoUri) {
      const filename = fotoUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append('foto', {
        uri: fotoUri,
        type: type,
        name: filename || 'foto.jpg',
      });
    }

    const response = await api.post('/api/pedidos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Pedido criado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pedido:', error.response?.data || error.message);
    throw error;
  }
};

// Exemplo de uso completo
const exemploCompleto = async () => {
  // 1. Solicitar permissão
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos');
    return;
  }

  // 2. Selecionar imagem
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled) {
    // 3. Criar pedido com foto
    const pedido = await criarPedidoComFoto(
      {
        cliente: 'João Silva',
        tipo: 'Venda',
        qtd: 5,
        desc: 'Produto especial',
        status: 'pendente',
        resumo: 'Pedido urgente'
      },
      result.assets[0].uri
    );
    
    console.log('Pedido criado com sucesso:', pedido);
  }
};
```

#### Opção 2: Enviar Base64 (JSON)

```javascript
import api from './services/api';
import * as ImagePicker from 'expo-image-picker';

const criarPedidoComBase64 = async (dadosPedido, fotoUri) => {
  try {
    // Converter imagem para base64
    let fotoBase64 = null;
    if (fotoUri) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true, // Importante: ativar base64
      });

      if (!result.canceled) {
        fotoBase64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      }
    }

    const response = await api.post('/api/pedidos', {
      cliente: dadosPedido.cliente,
      tipo: dadosPedido.tipo,
      qtd: dadosPedido.qtd,
      desc: dadosPedido.desc || null,
      status: dadosPedido.status || 'pendente',
      resumo: dadosPedido.resumo || null,
      foto: fotoBase64, // Base64 string
    });

    console.log('Pedido criado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pedido:', error.response?.data || error.message);
    throw error;
  }
};
```

#### Opção 3: Criar Pedido sem Foto

```javascript
import api from './services/api';

const criarPedido = async (dadosPedido) => {
  try {
    const response = await api.post('/api/pedidos', {
      cliente: dadosPedido.cliente,
      tipo: dadosPedido.tipo,
      qtd: dadosPedido.qtd,
      desc: dadosPedido.desc || null,
      status: dadosPedido.status || 'pendente',
      resumo: dadosPedido.resumo || null,
    });

    console.log('Pedido criado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pedido:', error.response?.data || error.message);
    throw error;
  }
};
```

---

### 3. Listar Todos os Pedidos

Retorna todos os pedidos cadastrados, incluindo as fotos.

**GET** `/api/pedidos`

```javascript
import api from './services/api';

const listarPedidos = async () => {
  try {
    const response = await api.get('/api/pedidos');
    console.log('Pedidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar pedidos:', error.response?.data || error.message);
    throw error;
  }
};

// Exemplo de uso com exibição de fotos
const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    listarPedidos().then(setPedidos);
  }, []);

  return (
    <FlatList
      data={pedidos}
      renderItem={({ item }) => (
        <View>
          <Text>{item.cliente}</Text>
          <Text>{item.tipo}</Text>
          {item.foto && (
            <Image 
              source={{ uri: item.foto }} 
              style={{ width: 200, height: 200 }} 
            />
          )}
        </View>
      )}
    />
  );
};
```

---

### 4. Buscar Pedido por ID

Retorna um pedido específico pelo ID, incluindo a foto.

**GET** `/api/pedidos/:id`

```javascript
import api from './services/api';

const buscarPedido = async (id) => {
  try {
    const response = await api.get(`/api/pedidos/${id}`);
    console.log('Pedido:', response.data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.error('Pedido não encontrado');
    } else {
      console.error('Erro ao buscar pedido:', error.response?.data || error.message);
    }
    throw error;
  }
};
```

---

### 5. Atualizar Pedido (com Upload de Nova Foto)

Atualiza todos os campos de um pedido, incluindo a foto.

**PUT** `/api/pedidos/:id`

**Formato:** `multipart/form-data` (com foto) ou `application/json` (sem foto ou base64)

```javascript
import api from './services/api';
import * as ImagePicker from 'expo-image-picker';

// Atualizar com nova foto (FormData)
const atualizarPedidoComFoto = async (id, dadosAtualizacao, novaFotoUri) => {
  try {
    const formData = new FormData();
    
    if (dadosAtualizacao.cliente) formData.append('cliente', dadosAtualizacao.cliente);
    if (dadosAtualizacao.tipo) formData.append('tipo', dadosAtualizacao.tipo);
    if (dadosAtualizacao.qtd) formData.append('qtd', dadosAtualizacao.qtd.toString());
    if (dadosAtualizacao.desc !== undefined) formData.append('desc', dadosAtualizacao.desc);
    if (dadosAtualizacao.status) formData.append('status', dadosAtualizacao.status);
    if (dadosAtualizacao.resumo !== undefined) formData.append('resumo', dadosAtualizacao.resumo);

    // Adicionar nova foto se fornecida
    if (novaFotoUri) {
      const filename = novaFotoUri.split('/').pop();
      formData.append('foto', {
        uri: novaFotoUri,
        type: 'image/jpeg',
        name: filename || 'foto.jpg',
      });
    }

    const response = await api.put(`/api/pedidos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('Pedido atualizado:', response.data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.error('Pedido não encontrado');
    } else {
      console.error('Erro ao atualizar pedido:', error.response?.data || error.message);
    }
    throw error;
  }
};

// Atualizar sem foto (JSON)
const atualizarPedido = async (id, dadosAtualizacao) => {
  try {
    const response = await api.put(`/api/pedidos/${id}`, dadosAtualizacao);
    console.log('Pedido atualizado:', response.data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.error('Pedido não encontrado');
    } else {
      console.error('Erro ao atualizar pedido:', error.response?.data || error.message);
    }
    throw error;
  }
};
```

---

### 6. Atualizar Status do Pedido

Atualiza apenas o status de um pedido (método mais rápido).

**PATCH** `/api/pedidos/:id/status`

**Body:**
```json
{
  "status": "string"
}
```

```javascript
import api from './services/api';

const atualizarStatus = async (id, novoStatus) => {
  try {
    const response = await api.patch(`/api/pedidos/${id}/status`, {
      status: novoStatus
    });
    console.log('Status atualizado:', response.data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.error('Pedido não encontrado');
    } else {
      console.error('Erro ao atualizar status:', error.response?.data || error.message);
    }
    throw error;
  }
};

// Uso
const statusAtualizado = await atualizarStatus(1, 'concluido');
```

**Status válidos:**
- `pendente`
- `processando`
- `concluido`
- `cancelado`

---

### 7. Deletar Pedido

Remove um pedido do banco de dados.

**DELETE** `/api/pedidos/:id`

```javascript
import api from './services/api';

const deletarPedido = async (id) => {
  try {
    const response = await api.delete(`/api/pedidos/${id}`);
    console.log('Pedido deletado:', response.data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.error('Pedido não encontrado');
    } else {
      console.error('Erro ao deletar pedido:', error.response?.data || error.message);
    }
    throw error;
  }
};
```

---

## 📸 Componente Completo - Criar Pedido com Foto

```javascript
// src/components/CriarPedidoComFoto.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

const CriarPedidoComFoto = ({ onPedidoCriado }) => {
  const [cliente, setCliente] = useState('');
  const [tipo, setTipo] = useState('');
  const [qtd, setQtd] = useState('');
  const [desc, setDesc] = useState('');
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
    // Validação
    if (!cliente || !tipo || !qtd) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (isNaN(parseInt(qtd)) || parseInt(qtd) <= 0) {
      Alert.alert('Erro', 'A quantidade deve ser um número positivo');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      
      formData.append('cliente', cliente);
      formData.append('tipo', tipo);
      formData.append('qtd', qtd);
      if (desc) formData.append('desc', desc);
      formData.append('status', 'pendente');

      // Adicionar foto se selecionada
      if (foto) {
        const filename = foto.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('foto', {
          uri: foto,
          type: type,
          name: filename || 'foto.jpg',
        });
      }

      const response = await api.post('/api/pedidos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Sucesso', 'Pedido criado com sucesso!');
      
      // Limpar formulário
      setCliente('');
      setTipo('');
      setQtd('');
      setDesc('');
      setFoto(null);

      // Callback para atualizar lista
      if (onPedidoCriado) {
        onPedidoCriado(response.data.pedido);
      }
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.error || 'Erro ao criar pedido');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Novo Pedido</Text>

      {/* Preview da foto */}
      {foto && (
        <Image source={{ uri: foto }} style={styles.preview} />
      )}

      {/* Botões de seleção de foto */}
      <View style={styles.fotoButtons}>
        <TouchableOpacity style={styles.fotoButton} onPress={selecionarImagem}>
          <Text style={styles.fotoButtonText}>📷 Galeria</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fotoButton} onPress={tirarFoto}>
          <Text style={styles.fotoButtonText}>📸 Câmera</Text>
        </TouchableOpacity>
      </View>

      {/* Formulário */}
      <TextInput
        style={styles.input}
        placeholder="Cliente *"
        value={cliente}
        onChangeText={setCliente}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo *"
        value={tipo}
        onChangeText={setTipo}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade *"
        value={qtd}
        onChangeText={setQtd}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descrição (opcional)"
        value={desc}
        onChangeText={setDesc}
        multiline
        numberOfLines={3}
      />

      {/* Botão criar */}
      {uploading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button
          title="Criar Pedido"
          onPress={criarPedido}
          disabled={!cliente || !tipo || !qtd}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#ddd',
  },
  fotoButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  fotoButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  fotoButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});

export default CriarPedidoComFoto;
```

---

## 🎯 Hook Personalizado - usePedidos

```javascript
// src/hooks/usePedidos.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Listar pedidos
  const listarPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/pedidos');
      setPedidos(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar pedidos');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Criar pedido com foto
  const criarPedido = async (dados, fotoUri) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      
      formData.append('cliente', dados.cliente);
      formData.append('tipo', dados.tipo);
      formData.append('qtd', dados.qtd.toString());
      if (dados.desc) formData.append('desc', dados.desc);
      if (dados.status) formData.append('status', dados.status);
      if (dados.resumo) formData.append('resumo', dados.resumo);

      if (fotoUri) {
        const filename = fotoUri.split('/').pop();
        formData.append('foto', {
          uri: fotoUri,
          type: 'image/jpeg',
          name: filename || 'foto.jpg',
        });
      }

      const response = await api.post('/api/pedidos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPedidos([response.data.pedido, ...pedidos]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status
  const atualizarStatus = async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/api/pedidos/${id}/status`, { status });
      setPedidos(pedidos.map(p => p.id === id ? response.data.pedido : p));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao atualizar status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Deletar pedido
  const deletarPedido = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/pedidos/${id}`);
      setPedidos(pedidos.filter(p => p.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao deletar pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Carregar pedidos ao montar
  useEffect(() => {
    listarPedidos();
  }, []);

  return {
    pedidos,
    loading,
    error,
    listarPedidos,
    criarPedido,
    atualizarStatus,
    deletarPedido,
  };
};
```

---

## 📱 Componente - Lista de Pedidos com Fotos

```javascript
// src/components/ListaPedidos.js
import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { usePedidos } from '../hooks/usePedidos';

const ListaPedidos = () => {
  const { pedidos, loading, error, atualizarStatus, deletarPedido } = usePedidos();

  const handleAtualizarStatus = async (id, novoStatus) => {
    try {
      await atualizarStatus(id, novoStatus);
      Alert.alert('Sucesso', 'Status atualizado com sucesso!');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar o status');
    }
  };

  const handleDeletar = async (id) => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente deletar este pedido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarPedido(id);
              Alert.alert('Sucesso', 'Pedido deletado com sucesso!');
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível deletar o pedido');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cliente}>{item.cliente}</Text>
      <Text style={styles.info}>Tipo: {item.tipo}</Text>
      <Text style={styles.info}>Quantidade: {item.qtd}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      
      {/* Exibir foto se existir */}
      {item.foto && (
        <Image 
          source={{ uri: item.foto }} 
          style={styles.foto}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSuccess]}
          onPress={() => handleAtualizarStatus(item.id, 'concluido')}
        >
          <Text style={styles.buttonText}>Concluir</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.buttonDanger]}
          onPress={() => handleDeletar(item.id)}
        >
          <Text style={styles.buttonText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && pedidos.length === 0) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text style={styles.error}>Erro: {error}</Text>;
  }

  return (
    <FlatList
      data={pedidos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={<Text style={styles.empty}>Nenhum pedido encontrado</Text>}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cliente: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 12,
    color: '#2196F3',
  },
  foto: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonSuccess: {
    backgroundColor: '#4CAF50',
  },
  buttonDanger: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});

export default ListaPedidos;
```

---

## 🔒 Tratamento de Erros

### Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação (campos obrigatórios faltando)
- `404` - Pedido não encontrado
- `500` - Erro interno do servidor

### Exemplo de tratamento completo

```javascript
const fazerRequisicao = async () => {
  try {
    const response = await api.post('/api/pedidos', dados);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Erro da API
      switch (error.response.status) {
        case 400:
          Alert.alert('Erro', 'Dados inválidos. Verifique os campos obrigatórios.');
          break;
        case 404:
          Alert.alert('Erro', 'Pedido não encontrado.');
          break;
        case 500:
          Alert.alert('Erro', 'Erro no servidor. Tente novamente mais tarde.');
          break;
        default:
          Alert.alert('Erro', error.response.data?.error || 'Erro desconhecido');
      }
    } else if (error.request) {
      // Erro de rede
      Alert.alert('Erro', 'Sem conexão com a internet.');
    } else {
      // Outro erro
      Alert.alert('Erro', 'Ocorreu um erro inesperado.');
    }
    throw error;
  }
};
```

---

## 📝 Resumo dos Endpoints

| Método | Endpoint | Descrição | Upload Foto |
|--------|---------|-----------|-------------|
| GET | `/health` | Verificar status da API | ❌ |
| POST | `/api/pedidos` | Criar novo pedido | ✅ |
| GET | `/api/pedidos` | Listar todos os pedidos | - |
| GET | `/api/pedidos/:id` | Buscar pedido por ID | - |
| PUT | `/api/pedidos/:id` | Atualizar pedido completo | ✅ |
| PATCH | `/api/pedidos/:id/status` | Atualizar apenas status | ❌ |
| DELETE | `/api/pedidos/:id` | Deletar pedido | ❌ |

---

## 🎯 Formato de Resposta

### Pedido com Foto

```json
{
  "id": 1,
  "cliente": "João Silva",
  "data": "2025-12-13T23:43:58.716Z",
  "tipo": "Venda",
  "qtd": 10,
  "desc": "Produto especial",
  "status": "pendente",
  "resumo": "Pedido urgente",
  "foto": "https://web-production-7e37e.up.railway.app/uploads/abc123.jpg"
}
```

**Nota:** O campo `foto` pode ser:
- URL completa (quando arquivo foi enviado)
- Base64 string (quando base64 foi enviado)
- `null` (quando não há foto)

---

## 🚀 Dicas de Performance

1. **Use FormData para arquivos grandes** - Mais eficiente que base64
2. **Comprima imagens antes de enviar** - Use `quality: 0.8` no ImagePicker
3. **Use cache para imagens** - Considere usar `react-native-fast-image`
4. **Lazy loading** - Carregue imagens apenas quando visíveis

---

## 🔗 Links Úteis

- **URL da API:** https://web-production-7e37e.up.railway.app
- **Health Check:** https://web-production-7e37e.up.railway.app/health
- **Documentação de Upload:** Veja `UPLOAD_FOTO_REACT_NATIVE.md`

---

**Pronto para usar!** 🎉
