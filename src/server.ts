import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pedidosRoutes from './routes/pedidos.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

