import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import pedidosRoutes from './routes/pedidos.routes';

dotenv.config();

// Aplicar migrations automaticamente na inicialização (apenas em produção)
if (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT) {
  try {
    const { execSync } = require('child_process');
    const path = require('path');
    console.log('🔄 Aplicando migrations do banco de dados...');
    const prismaPath = path.join(process.cwd(), 'node_modules', '.bin', 'prisma');
    execSync(`"${prismaPath}" migrate deploy`, { 
      stdio: 'inherit', 
      env: process.env,
      cwd: process.cwd()
    });
    console.log('✅ Migrations aplicadas com sucesso!');
  } catch (error: any) {
    console.error('⚠️  Aviso: Erro ao aplicar migrations:', error.message);
    // Não bloqueia a inicialização se as migrations já foram aplicadas
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar Prisma Client
const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/pedidos', pedidosRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API está funcionando' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

