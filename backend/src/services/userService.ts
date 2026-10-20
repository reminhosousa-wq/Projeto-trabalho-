import { prisma } from '../config/prisma.js';
import { hashPassword } from '../utils/password.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { UserRole, AuthenticatedUserPayload } from '../types/roles.js';

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyId?: string;
}

export async function createUserService(dto: CreateUserDTO, currentUser: AuthenticatedUserPayload) {
  const normalizedEmail = dto.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw new AppError('Já existe um usuário cadastrado com este e-mail.', 409);
  }

  // Validação de permissões de quem pode criar quem
  if (currentUser.role !== UserRole.MASTER_ADMIN) {
    if (dto.role === UserRole.MASTER_ADMIN) {
      throw new AppError('Apenas o Usuário Mestre pode criar outro Usuário Mestre.', 403);
    }

    if (currentUser.role === UserRole.PROVIDER_ADMIN) {
      // Gestor da contabilidade pode criar contabilistas da sua empresa ou gestores de clientes atendidos
      if (dto.companyId && dto.companyId !== currentUser.companyId) {
        // Verifica se a empresa destino é cliente da prestadora atual
        const clientCompany = await prisma.company.findFirst({
          where: { id: dto.companyId, providerId: currentUser.companyId },
        });

        if (!clientCompany) {
          throw new AppError('Você não tem permissão para adicionar usuários nesta empresa.', 403);
        }
      }
    } else {
      throw new AppError('Você não possui permissão para cadastrar novos usuários.', 403);
    }
  }

  const passwordHash = await hashPassword(dto.password);

  const newUser = await prisma.user.create({
    data: {
      name: dto.name,
      email: normalizedEmail,
      passwordHash,
      role: dto.role,
      companyId: dto.companyId || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      companyId: true,
      isActive: true,
      createdAt: true,
      company: {
        select: {
          id: true,
          name: true,
          tradeName: true,
          companyType: true,
        },
      },
    },
  });

  return newUser;
}

export async function listUsersService(currentUser: AuthenticatedUserPayload) {
  if (currentUser.role === UserRole.MASTER_ADMIN) {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        company: {
          select: { id: true, name: true, companyType: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  if (currentUser.role === UserRole.PROVIDER_ADMIN) {
    return prisma.user.findMany({
      where: {
        OR: [
          { companyId: currentUser.companyId },
          { company: { providerId: currentUser.companyId } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        company: {
          select: { id: true, name: true, companyType: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  return prisma.user.findMany({
    where: { companyId: currentUser.companyId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      companyId: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}
