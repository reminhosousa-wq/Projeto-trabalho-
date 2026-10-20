import { Router } from 'express';
import { createUserController, listUsersController } from '../controllers/userController.js';
import { requireAuth, requireRoles } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createUserSchema } from '../schemas/validationSchemas.js';
import { UserRole } from '../types/roles.js';

export const userRoutes = Router();

userRoutes.use(requireAuth);

userRoutes.get('/', listUsersController);

userRoutes.post(
  '/',
  requireRoles(UserRole.MASTER_ADMIN, UserRole.PROVIDER_ADMIN),
  validateRequest(createUserSchema),
  createUserController
);
