import { Request, Response, NextFunction } from 'express';
import { loginService, registerService, googleLoginService, getMeService } from '../services/authService.js';

export async function loginController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);

    res.status(200).json({
      success: true,
      message: 'Autenticação realizada com sucesso!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function registerController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password } = req.body;
    const result = await registerService(name, email, password);

    res.status(201).json({
      success: true,
      message: 'Conta criada e autenticada com sucesso!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function googleAuthController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await googleLoginService(req.body);

    res.status(200).json({
      success: true,
      message: 'Autenticação com o Google realizada com sucesso!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMeController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Não autenticado.' });
      return;
    }

    const user = await getMeService(req.user.userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
