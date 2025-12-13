import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Criar novo pedido
export const criarPedido = async (req: Request, res: Response) => {
  try {
    const { cliente, data, tipo, qtd, desc, status, resumo } = req.body;

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

    const pedido = await prisma.pedido.create({
      data: {
        cliente,
        data: data ? new Date(data) : new Date(),
        tipo,
        qtd: parseInt(qtd),
        desc: desc || null,
        status: status || 'pendente',
        resumo: resumo || null
      }
    });

    res.status(201).json({
      message: 'Pedido criado com sucesso',
      pedido
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
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
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ error: 'Erro ao listar pedidos' });
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
    const { cliente, data, tipo, qtd, desc, status, resumo } = req.body;

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

