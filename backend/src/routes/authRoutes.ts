import { Router } from 'express';
import {
  loginController,
  registerController,
  googleAuthController,
  getMeController,
} from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { loginSchema } from '../schemas/validationSchemas.js';

export const authRoutes = Router();

authRoutes.post('/login', validateRequest(loginSchema), loginController);
authRoutes.post('/register', registerController);
authRoutes.post('/google', googleAuthController);
authRoutes.get('/me', requireAuth, getMeController);
