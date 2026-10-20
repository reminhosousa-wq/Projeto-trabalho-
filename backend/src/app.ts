import express from 'express';
import cors from 'cors';
import { appRouter } from './routes/index.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { env } from './config/env.js';

export const app = express();

app.use(
  cors({
    origin: [env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.use(express.json());

// Rotas da API
app.use('/api', appRouter);

// Tratamento 404 para rotas não encontradas
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada na API.',
  });
});

// Tratamento de erros centralizado
app.use(errorHandler);
