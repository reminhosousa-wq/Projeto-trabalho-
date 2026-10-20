import { Router } from 'express';
import { createCompanyController, listCompaniesController } from '../controllers/companyController.js';
import { requireAuth, requireRoles } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createCompanySchema } from '../schemas/validationSchemas.js';
import { UserRole } from '../types/roles.js';

export const companyRoutes = Router();

// Todas as rotas de empresas exigem autenticação
companyRoutes.use(requireAuth);

// Listar empresas (filtradas automaticamente por papel do usuário)
companyRoutes.get('/', listCompaniesController);

// Criar empresa (Apenas MASTER_ADMIN e PROVIDER_ADMIN)
companyRoutes.post(
  '/',
  requireRoles(UserRole.MASTER_ADMIN, UserRole.PROVIDER_ADMIN),
  validateRequest(createCompanySchema),
  createCompanyController
);
