import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getImageUrl } from '../middleware/upload';

const prisma = new PrismaClient();

// Criar novo pedido
export const criarPedido = async (req: Request, res: Response) => {
  try {
    console.log('📥 Recebendo requisição de criação de pedido');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('Content-Type:', req.get('content-type'));

    const { cliente, data, tipo, qtd, desc, status, resumo, foto } = req.body;

    // Validações básicas
    if (!cliente || !tipo || !qtd) {
      return res.status(400).json({
        error: 'Campos obrigatórios: cliente, tipo, qtd'
      });
    }

    // Validar quantidade
    if (isNaN(parseInt(qtd)) || parseInt(qtd) <= 0) {
      return res.status(400).json({
        error: 'A quantidade deve ser um número positivo'
      });
    }

    // Processar foto
    let fotoUrl = null;
    
    // Se enviou arquivo via multer
    if (req.file) {
      console.log('✅ Arquivo recebido via multer:', req.file.filename);
      fotoUrl = getImageUrl(req, req.file.filename);
      console.log('📸 URL da foto gerada:', fotoUrl);
    }
    // Se enviou base64 no body
    else if (foto) {
      console.log('✅ Foto recebida como base64 ou URL');
      // Se já é uma URL, usa como está
      if (foto.startsWith('http://') || foto.startsWith('https://')) {
        fotoUrl = foto;
      }
      // Se é base64, salva como está
      else if (foto.startsWith('data:image/')) {
        fotoUrl = foto;
      }
    } else {
      console.log('ℹ️  Nenhuma foto enviada');
    }

    const pedido = await prisma.pedido.create({
      data: {
        cliente,
        data: data ? new Date(data) : new Date(),
        tipo,
        qtd: parseInt(qtd),
        desc: desc || null,
        status: status || 'pendente',
        resumo: resumo || null,
        foto: fotoUrl
      }
    });

    res.status(201).json({
      message: 'Pedido criado com sucesso',
      pedido
    });
  } catch (error: any) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ 
      error: 'Erro ao criar pedido',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Listar todos os pedidos
export const listarPedidos = async (req: Request, res: Response) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      orderBy: {
        data: 'desc'
      }
    });

    res.json(pedidos);
  } catch (error: any) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ 
      error: 'Erro ao listar pedidos',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Buscar pedido por ID
export const buscarPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pedido = await prisma.pedido.findUnique({
      where: { id: parseInt(id) }
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json(pedido);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
};

// Atualizar pedido
export const atualizarPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { cliente, data, tipo, qtd, desc, status, resumo, foto } = req.body;

    // Verificar se o pedido existe
    const pedidoExistente = await prisma.pedido.findUnique({
      where: { id: parseInt(id) }
    });

    if (!pedidoExistente) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const dadosAtualizacao: any = {};
    
    if (cliente) dadosAtualizacao.cliente = cliente;
    if (data) dadosAtualizacao.data = new Date(data);
    if (tipo) dadosAtualizacao.tipo = tipo;
    if (qtd) dadosAtualizacao.qtd = parseInt(qtd);
    if (desc !== undefined) dadosAtualizacao.desc = desc || null;
    if (status) dadosAtualizacao.status = status;
    if (resumo !== undefined) dadosAtualizacao.resumo = resumo || null;

    // Processar foto
    if (req.file) {
      dadosAtualizacao.foto = getImageUrl(req, req.file.filename);
    } else if (foto !== undefined) {
      if (foto && (foto.startsWith('http://') || foto.startsWith('https://') || foto.startsWith('data:image/'))) {
        dadosAtualizacao.foto = foto;
      } else if (foto === null || foto === '') {
        dadosAtualizacao.foto = null;
      }
    }

    const pedido = await prisma.pedido.update({
      where: { id: parseInt(id) },
      data: dadosAtualizacao
    });

    res.json(pedido);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
};

// Atualizar apenas o status do pedido
export const atualizarStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'Campo obrigatório: status'
      });
    }

    // Verificar se o pedido existe
    const pedidoExistente = await prisma.pedido.findUnique({
      where: { id: parseInt(id) }
    });

    if (!pedidoExistente) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const pedido = await prisma.pedido.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json({
      message: 'Status atualizado com sucesso',
      pedido
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
  }
};

// Deletar pedido
export const deletarPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar se o pedido existe
    const pedidoExistente = await prisma.pedido.findUnique({
      where: { id: parseInt(id) }
    });

    if (!pedidoExistente) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    await prisma.pedido.delete({
      where: { id: parseInt(id) }
    });

    res.json({ 
      message: 'Pedido deletado com sucesso',
      id: parseInt(id)
    });
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    res.status(500).json({ error: 'Erro ao deletar pedido' });
  }
};

