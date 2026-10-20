import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { UserRole } from '../types/roles.js';
import { prisma } from '../config/prisma.js';

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Token de autenticação não fornecido ou em formato inválido.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);

    // Validação extra: confirma se o usuário ainda existe e está ativo no banco
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, companyId: true, isActive: true },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Usuário desativado ou não encontrado no sistema.',
      });
      return;
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      companyId: user.companyId,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado. Faça login novamente.',
    });
  }
}

// Middleware de autorização baseada em Roles (Permissões)
export function requireRoles(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Acesso não autenticado.',
      });
      return;
    }

    // MASTER_ADMIN sempre tem acesso total
    if (req.user.role === UserRole.MASTER_ADMIN) {
      next();
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Acesso negado: seu perfil não possui permissão para este recurso.',
      });
      return;
    }

    next();
  };
}
