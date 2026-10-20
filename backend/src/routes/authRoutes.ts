import { Router } from 'express';
import { loginController, getMeController } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { loginSchema } from '../schemas/validationSchemas.js';

export const authRoutes = Router();

authRoutes.post('/login', validateRequest(loginSchema), loginController);
authRoutes.get('/me', requireAuth, getMeController);
