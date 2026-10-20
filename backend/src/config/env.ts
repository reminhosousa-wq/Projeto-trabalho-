import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3333,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'chave_secreta_padrao_para_desenvolvimento_123',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  MASTER_ADMIN_NAME: process.env.MASTER_ADMIN_NAME || 'Administrador Geral',
  MASTER_ADMIN_EMAIL: process.env.MASTER_ADMIN_EMAIL || 'admin@contabilidade.com',
  MASTER_ADMIN_PASSWORD: process.env.MASTER_ADMIN_PASSWORD || 'admin_master_123',
};
