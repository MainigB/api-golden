import { Router } from 'express';
import {
  criarPedido,
  listarPedidos,
  buscarPedido,
  atualizarPedido,
  atualizarStatus,
  deletarPedido
} from '../controllers/pedidos.controller';
import { upload } from '../middleware/upload';

const router = Router();

// Criar novo pedido (com suporte a upload de foto)
router.post('/', upload.single('foto'), criarPedido);

// Listar todos os pedidos
router.get('/', listarPedidos);

// Buscar pedido por ID
router.get('/:id', buscarPedido);

// Atualizar pedido completo (com suporte a upload de foto)
router.put('/:id', upload.single('foto'), atualizarPedido);

// Atualizar apenas o status do pedido
router.patch('/:id/status', atualizarStatus);

// Deletar pedido
router.delete('/:id', deletarPedido);

export default router;

