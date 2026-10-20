import { Router } from 'express';
import {
  createCompanyController,
  listCompaniesController,
  updateCompanyController,
  deleteCompanyController,
} from '../controllers/companyController.js';
import { requireAuth, requireRoles } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createCompanySchema } from '../schemas/validationSchemas.js';
import { UserRole } from '../types/roles.js';

export const companyRoutes = Router();

// Todas as rotas de empresas exigem autenticação
companyRoutes.use(requireAuth);

// Listar empresas
companyRoutes.get('/', listCompaniesController);

// Criar empresa (Apenas MASTER_ADMIN, PROVIDER_ADMIN ou PROVIDER_ACCOUNTANT)
companyRoutes.post(
  '/',
  requireRoles(UserRole.MASTER_ADMIN, UserRole.PROVIDER_ADMIN, UserRole.PROVIDER_ACCOUNTANT),
  validateRequest(createCompanySchema),
  createCompanyController
);

// Atualizar dados cadastrais da empresa
companyRoutes.put(
  '/:id',
  requireRoles(UserRole.MASTER_ADMIN, UserRole.PROVIDER_ADMIN, UserRole.PROVIDER_ACCOUNTANT),
  updateCompanyController
);

// Excluir empresa (se não possuir vínculos)
companyRoutes.delete(
  '/:id',
  requireRoles(UserRole.MASTER_ADMIN, UserRole.PROVIDER_ADMIN),
  deleteCompanyController
);
