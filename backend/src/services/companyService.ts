import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { CompanyType, UserRole, AuthenticatedUserPayload } from '../types/roles.js';

export interface CreateCompanyDTO {
  name: string;
  tradeName?: string;
  taxId: string;
  companyType: CompanyType;
  email?: string;
  phone?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  useTimeTracking?: string;
  contactName?: string;
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
      if (dto.providerId) {
        finalProviderId = dto.providerId;
      } else {
        // Se o Master não escolheu, associa à primeira prestadora encontrada no sistema
        const defaultProvider = await prisma.company.findFirst({
          where: { companyType: CompanyType.PROVIDER },
        });
        finalProviderId = defaultProvider ? defaultProvider.id : null;
      }
    } else if (currentUser.role === UserRole.PROVIDER_ADMIN || currentUser.role === UserRole.PROVIDER_ACCOUNTANT) {
      // Automaticamente vincula à empresa contábil do usuário logado
      finalProviderId = currentUser.companyId;
    } else {
      throw new AppError('Apenas a contabilidade ou o administrador podem cadastrar novas empresas clientes.', 403);
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
      neighborhood: dto.neighborhood,
      city: dto.city,
      state: dto.state,
      postalCode: dto.postalCode,
      useTimeTracking: dto.useTimeTracking || 'Sim',
      contactName: dto.contactName,
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

export async function updateCompanyService(
  id: string,
  dto: Partial<CreateCompanyDTO>,
  _currentUser: AuthenticatedUserPayload
) {
  const existing = await prisma.company.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Empresa não encontrada.', 404);
  }

  let cleanTaxId = existing.taxId;
  if (dto.taxId) {
    cleanTaxId = dto.taxId.replace(/\D/g, '');
    if (cleanTaxId !== existing.taxId) {
      const duplicate = await prisma.company.findUnique({ where: { taxId: cleanTaxId } });
      if (duplicate) {
        throw new AppError('Já existe outra empresa com este CNPJ.', 409);
      }
    }
  }

  const updated = await prisma.company.update({
    where: { id },
    data: {
      name: dto.name ?? existing.name,
      tradeName: dto.tradeName !== undefined ? dto.tradeName : existing.tradeName,
      taxId: cleanTaxId,
      email: dto.email !== undefined ? dto.email : existing.email,
      phone: dto.phone !== undefined ? dto.phone : existing.phone,
      address: dto.address !== undefined ? dto.address : existing.address,
      neighborhood: dto.neighborhood !== undefined ? dto.neighborhood : existing.neighborhood,
      city: dto.city !== undefined ? dto.city : existing.city,
      state: dto.state !== undefined ? dto.state : existing.state,
      postalCode: dto.postalCode !== undefined ? dto.postalCode : existing.postalCode,
      useTimeTracking: dto.useTimeTracking !== undefined ? dto.useTimeTracking : existing.useTimeTracking,
      contactName: dto.contactName !== undefined ? dto.contactName : existing.contactName,
    },
    include: {
      provider: { select: { id: true, name: true, tradeName: true } },
    },
  });

  return updated;
}

export async function deleteCompanyService(id: string) {
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      _count: { select: { users: true, clients: true } },
    },
  });

  if (!company) {
    throw new AppError('Empresa não encontrada.', 404);
  }

  if (company._count.users > 0) {
    throw new AppError('Esta empresa possui usuários vinculados e não pode ser excluída.', 400);
  }

  if (company._count.clients > 0) {
    throw new AppError('Esta prestadora possui empresas clientes vinculadas e não pode ser excluída.', 400);
  }

  await prisma.company.delete({ where: { id } });

  return { message: 'Empresa removida com sucesso.' };
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
