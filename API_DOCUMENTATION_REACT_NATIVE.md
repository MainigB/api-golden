# 📱 Documentação da API - React Native

Documentação completa para consumir a API Golden em aplicações React Native.

## 🌐 URL Base da API

```
https://web-production-7e37e.up.railway.app
```

---

## 📦 Instalação

No seu projeto React Native, instale o Axios (ou use fetch nativo):

```bash
npm install axios
# ou
yarn add axios
```

---

## 🔧 Configuração Inicial

### Criar arquivo de configuração da API

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://web-production-7e37e.up.railway.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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

### 2. Criar Pedido (com Upload de Foto)

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

**Opção 1: Upload de Arquivo (FormData)**
```javascript
import api from './services/api';

const criarPedidoComFoto = async (dadosPedido, fotoUri) => {
  try {
    const formData = new FormData();
    
    formData.append('cliente', dadosPedido.cliente);
    formData.append('tipo', dadosPedido.tipo);
    formData.append('qtd', dadosPedido.qtd.toString());
    if (dadosPedido.desc) formData.append('desc', dadosPedido.desc);
    if (dadosPedido.status) formData.append('status', dadosPedido.status);
    if (dadosPedido.resumo) formData.append('resumo', dadosPedido.resumo);
    
    // Adicionar foto
    if (fotoUri) {
      formData.append('foto', {
        uri: fotoUri,
        type: 'image/jpeg', // ou 'image/png'
        name: 'foto.jpg',
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
```

**Opção 2: Enviar Base64 (JSON)**
```javascript
import api from './services/api';
import * as ImagePicker from 'expo-image-picker';

const criarPedidoComBase64 = async (dadosPedido, fotoUri) => {
  try {
    // Converter imagem para base64
    let fotoBase64 = null;
    if (fotoUri) {
      const response = await fetch(fotoUri);
      const blob = await response.blob();
      const reader = new FileReader();
      fotoBase64 = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
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

// Uso
const novoPedido = await criarPedidoComFoto({
  cliente: 'João Silva',
  tipo: 'Venda',
  qtd: 5,
  desc: 'Produto especial',
  status: 'pendente',
  resumo: 'Pedido urgente'
}, 'file:///path/to/image.jpg');
```

---

### 3. Listar Todos os Pedidos

Retorna todos os pedidos cadastrados.

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

// Uso
const pedidos = await listarPedidos();
```

---

### 4. Buscar Pedido por ID

Retorna um pedido específico pelo ID.

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

// Uso
const pedido = await buscarPedido(1);
```

---

### 5. Atualizar Pedido (Completo)

Atualiza todos os campos de um pedido.

**PUT** `/api/pedidos/:id`

**Body:** (todos os campos são opcionais, envie apenas os que deseja atualizar)
```json
{
  "cliente": "string",
  "tipo": "string",
  "qtd": "number",
  "data": "string",
  "desc": "string",
  "status": "string",
  "resumo": "string"
}
```

```javascript
import api from './services/api';

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

// Uso
const pedidoAtualizado = await atualizarPedido(1, {
  status: 'concluido',
  resumo: 'Pedido entregue com sucesso'
});
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

// Uso
await deletarPedido(1);
```

---

## 🎯 Exemplo Completo - Hook React Native

### Hook personalizado para gerenciar pedidos

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

  // Criar pedido
  const criarPedido = async (dados) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/pedidos', dados);
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

## 📱 Exemplo de Componente React Native

```javascript
// src/components/ListaPedidos.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
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
    <View style={styles.pedidoCard}>
      <Text style={styles.cliente}>{item.cliente}</Text>
      <Text style={styles.tipo}>Tipo: {item.tipo}</Text>
      <Text style={styles.qtd}>Quantidade: {item.qtd}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btnAtualizar}
          onPress={() => handleAtualizarStatus(item.id, 'concluido')}
        >
          <Text>Concluir</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.btnDeletar}
          onPress={() => handleDeletar(item.id)}
        >
          <Text>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
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
      ListEmptyComponent={<Text>Nenhum pedido encontrado</Text>}
    />
  );
};

const styles = {
  pedidoCard: {
    padding: 16,
    margin: 8,
    backgroundColor: '#fff',
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
  tipo: {
    fontSize: 14,
    color: '#666',
  },
  qtd: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  btnAtualizar: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 4,
  },
  btnDeletar: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
};

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

## 📝 Exemplo de Formulário para Criar Pedido

```javascript
// src/components/FormularioPedido.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import api from '../services/api';

const FormularioPedido = ({ onPedidoCriado }) => {
  const [cliente, setCliente] = useState('');
  const [tipo, setTipo] = useState('');
  const [qtd, setQtd] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validação
    if (!cliente || !tipo || !qtd) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (isNaN(qtd) || parseInt(qtd) <= 0) {
      Alert.alert('Erro', 'A quantidade deve ser um número positivo');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/pedidos', {
        cliente,
        tipo,
        qtd: parseInt(qtd),
        desc: desc || null,
        status: 'pendente',
      });

      Alert.alert('Sucesso', 'Pedido criado com sucesso!');
      
      // Limpar formulário
      setCliente('');
      setTipo('');
      setQtd('');
      setDesc('');

      // Callback para atualizar lista
      if (onPedidoCriado) {
        onPedidoCriado(response.data.pedido);
      }
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.error || 'Erro ao criar pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
        style={styles.input}
        placeholder="Descrição (opcional)"
        value={desc}
        onChangeText={setDesc}
        multiline
      />
      <Button
        title={loading ? 'Criando...' : 'Criar Pedido'}
        onPress={handleSubmit}
        disabled={loading}
      />
    </View>
  );
};

const styles = {
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
};

export default FormularioPedido;
```

---

## 🚀 Usando Fetch Nativo (sem Axios)

Se preferir não usar Axios:

```javascript
const API_BASE_URL = 'https://web-production-7e37e.up.railway.app';

const criarPedido = async (dados) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar pedido');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
```

---

## 📚 Resumo Rápido

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Verificar status da API |
| POST | `/api/pedidos` | Criar novo pedido |
| GET | `/api/pedidos` | Listar todos os pedidos |
| GET | `/api/pedidos/:id` | Buscar pedido por ID |
| PUT | `/api/pedidos/:id` | Atualizar pedido completo |
| PATCH | `/api/pedidos/:id/status` | Atualizar apenas status |
| DELETE | `/api/pedidos/:id` | Deletar pedido |

---

## 🔗 Links Úteis

- **URL da API:** https://web-production-7e37e.up.railway.app
- **Health Check:** https://web-production-7e37e.up.railway.app/health
- **Documentação:** Este arquivo

---

**Pronto para usar!** 🎉


