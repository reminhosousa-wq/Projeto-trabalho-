import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { CompanyType, UserRole, AuthenticatedUserPayload } from '../types/roles.js';

interface CreateCompanyDTO {
  name: string;
  tradeName?: string;
  taxId: string;
  companyType: CompanyType;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  providerId?: string;
}

export async function createCompanyService(dto: CreateCompanyDTO, currentUser: AuthenticatedUserPayload) {
  // Limpeza de CNPJ (apenas dígitos)
  const cleanTaxId = dto.taxId.replace(/\D/g, '');

  if (cleanTaxId.length !== 14) {
    throw new AppError('CNPJ inválido. Deve conter 14 dígitos numéricos.', 400);
  }

  // Verifica unicidade do CNPJ
  const existing = await prisma.company.findUnique({
    where: { taxId: cleanTaxId },
  });

  if (existing) {
    throw new AppError('Já existe uma empresa cadastrada com este CNPJ.', 409);
  }

  let finalProviderId: string | null = null;

  if (dto.companyType === CompanyType.CLIENT) {
    // Se for CLIENT, precisa estar vinculada a uma Prestadora
    if (currentUser.role === UserRole.MASTER_ADMIN) {
      if (!dto.providerId) {
        throw new AppError('Como Administrador Mestre, informe qual Prestadora atenderá esta empresa cliente.', 400);
      }
      finalProviderId = dto.providerId;
    } else if (currentUser.role === UserRole.PROVIDER_ADMIN) {
      // Automaticamente vincula à empresa do gestor da contabilidade
      if (!currentUser.companyId) {
        throw new AppError('Usuário gestor não está vinculado a uma empresa contábil.', 400);
      }
      finalProviderId = currentUser.companyId;
    } else {
      throw new AppError('Apenas administradores podem cadastrar empresas.', 403);
    }
  }

  const company = await prisma.company.create({
    data: {
      name: dto.name,
      tradeName: dto.tradeName,
      taxId: cleanTaxId,
      companyType: dto.companyType,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      postalCode: dto.postalCode,
      providerId: finalProviderId,
    },
    include: {
      provider: {
        select: { id: true, name: true, tradeName: true },
      },
    },
  });

  return company;
}

export async function listCompaniesService(currentUser: AuthenticatedUserPayload) {
  // MASTER_ADMIN: visualiza todas as empresas
  if (currentUser.role === UserRole.MASTER_ADMIN) {
    return prisma.company.findMany({
      include: {
        provider: { select: { id: true, name: true, tradeName: true } },
        _count: { select: { users: true, clients: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Prestadora (ADMIN ou ACCOUNTANT): visualiza a si mesma e suas empresas clientes
  if (
    currentUser.role === UserRole.PROVIDER_ADMIN ||
    currentUser.role === UserRole.PROVIDER_ACCOUNTANT
  ) {
    if (!currentUser.companyId) {
      return [];
    }

    return prisma.company.findMany({
      where: {
        OR: [
          { id: currentUser.companyId },
          { providerId: currentUser.companyId },
        ],
      },
      include: {
        provider: { select: { id: true, name: true, tradeName: true } },
        _count: { select: { users: true } },
      },
      orderBy: { companyType: 'asc' },
    });
  }

  // Cliente (CLIENT_ADMIN ou CLIENT_USER): visualiza apenas a própria empresa
  return prisma.company.findMany({
    where: { id: currentUser.companyId || '' },
    include: {
      provider: { select: { id: true, name: true, tradeName: true } },
    },
  });
}
