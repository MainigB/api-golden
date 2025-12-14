// Exemplo prático completo de uso da API em React Native
// Copie e adapte conforme necessário

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import api from './services/api'; // Configure conforme mostrado na documentação

const App = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState('');
  const [tipo, setTipo] = useState('');
  const [qtd, setQtd] = useState('');

  // Carregar pedidos ao iniciar
  useEffect(() => {
    carregarPedidos();
  }, []);

  // Listar todos os pedidos
  const carregarPedidos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/pedidos');
      setPedidos(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os pedidos');
    } finally {
      setLoading(false);
    }
  };

  // Criar novo pedido
  const criarPedido = async () => {
    if (!cliente || !tipo || !qtd) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/pedidos', {
        cliente,
        tipo,
        qtd: parseInt(qtd),
        status: 'pendente',
      });

      Alert.alert('Sucesso', 'Pedido criado com sucesso!');
      
      // Limpar campos
      setCliente('');
      setTipo('');
      setQtd('');

      // Recarregar lista
      carregarPedidos();
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.error || 'Erro ao criar pedido');
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status do pedido
  const atualizarStatus = async (id, novoStatus) => {
    try {
      await api.patch(`/api/pedidos/${id}/status`, { status: novoStatus });
      Alert.alert('Sucesso', 'Status atualizado!');
      carregarPedidos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o status');
    }
  };

  // Deletar pedido
  const deletarPedido = async (id) => {
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
              await api.delete(`/api/pedidos/${id}`);
              Alert.alert('Sucesso', 'Pedido deletado!');
              carregarPedidos();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar o pedido');
            }
          },
        },
      ]
    );
  };

  // Renderizar item da lista
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cliente}>{item.cliente}</Text>
      <Text style={styles.info}>Tipo: {item.tipo}</Text>
      <Text style={styles.info}>Qtd: {item.qtd}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSuccess]}
          onPress={() => atualizarStatus(item.id, 'concluido')}
        >
          <Text style={styles.buttonText}>Concluir</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.buttonDanger]}
          onPress={() => deletarPedido(item.id)}
        >
          <Text style={styles.buttonText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Golden - Pedidos</Text>

      {/* Formulário */}
      <View style={styles.form}>
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
        <Button
          title={loading ? 'Criando...' : 'Criar Pedido'}
          onPress={criarPedido}
          disabled={loading}
        />
      </View>

      {/* Lista de pedidos */}
      {loading && pedidos.length === 0 ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={pedidos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshing={loading}
          onRefresh={carregarPedidos}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum pedido encontrado</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
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
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});

export default App;


