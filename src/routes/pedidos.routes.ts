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

// Middleware para tratar erros do multer
const handleMulterError = (err: any, req: any, res: any, next: any) => {
  if (err) {
    console.error('Erro no multer:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Arquivo muito grande. Tamanho máximo: 5MB' });
    }
    if (err.message) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(400).json({ error: 'Erro ao processar arquivo' });
  }
  next();
};

// Criar novo pedido (com suporte a upload de foto)
router.post('/', upload.single('foto'), handleMulterError, criarPedido);

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

