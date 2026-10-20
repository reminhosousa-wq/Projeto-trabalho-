import { Request, Response, NextFunction } from 'express';
import { createUserService, listUsersService } from '../services/userService.js';

export async function createUserController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Não autenticado.' });
      return;
    }

    const user = await createUserService(req.body, req.user);

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function listUsersController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Não autenticado.' });
      return;
    }

    const users = await listUsersService(req.user);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}
