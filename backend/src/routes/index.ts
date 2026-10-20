import { Router } from 'express';
import { authRoutes } from './authRoutes.js';
import { companyRoutes } from './companyRoutes.js';
import { userRoutes } from './userRoutes.js';

export const appRouter = Router();

// Rota de Health Check
appRouter.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

appRouter.use('/auth', authRoutes);
appRouter.use('/companies', companyRoutes);
appRouter.use('/users', userRoutes);
