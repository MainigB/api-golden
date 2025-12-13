import { Router } from 'express';
import {
  criarPedido,
  listarPedidos,
  buscarPedido,
  atualizarPedido,
  atualizarStatus,
  deletarPedido
} from '../controllers/pedidos.controller';

const router = Router();

// Criar novo pedido
router.post('/', criarPedido);

// Listar todos os pedidos
router.get('/', listarPedidos);

// Buscar pedido por ID
router.get('/:id', buscarPedido);

// Atualizar pedido completo
router.put('/:id', atualizarPedido);

// Atualizar apenas o status do pedido
router.patch('/:id/status', atualizarStatus);

// Deletar pedido
router.delete('/:id', deletarPedido);

export default router;

