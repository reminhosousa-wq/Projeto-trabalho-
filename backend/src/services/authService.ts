import { prisma } from '../config/prisma.js';
import { comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { UserRole } from '../types/roles.js';

export async function loginService(email: string, plainPassword: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          tradeName: true,
          companyType: true,
          taxId: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('Credenciais inválidas. Verifique seu e-mail e senha.', 401);
  }

  if (!user.isActive) {
    throw new AppError('Esta conta de usuário está desativada no momento.', 403);
  }

  const isPasswordValid = await comparePassword(plainPassword, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Credenciais inválidas. Verifique seu e-mail e senha.', 401);
  }

  // Atualiza data do último login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role as UserRole,
    companyId: user.companyId,
  };

  const token = signToken(tokenPayload);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      company: user.company,
      lastLoginAt: user.lastLoginAt,
    },
  };
}

export async function getMeService(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      companyId: true,
      createdAt: true,
      lastLoginAt: true,
      company: {
        select: {
          id: true,
          name: true,
          tradeName: true,
          companyType: true,
          taxId: true,
          providerId: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('Usuário não encontrado.', 404);
  }

  return user;
}
