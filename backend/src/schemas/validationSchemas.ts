import { z } from 'zod';
import { UserRole, CompanyType } from '../types/roles.js';

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'O e-mail é obrigatório.' })
      .email('Formato de e-mail inválido.'),
    password: z
      .string({ required_error: 'A senha é obrigatória.' })
      .min(6, 'A senha deve ter no mínimo 6 caracteres.'),
  }),
});

export const createCompanySchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Razão Social é obrigatória.' }).min(2, 'Nome muito curto.'),
    tradeName: z.string().optional(),
    taxId: z.string({ required_error: 'CNPJ é obrigatório.' }).min(14, 'CNPJ inválido.'),
    companyType: z.nativeEnum(CompanyType, {
      required_error: 'Tipo de empresa é obrigatório (PROVIDER ou CLIENT).',
    }),
    email: z.string().email('E-mail da empresa inválido.').optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    useTimeTracking: z.string().optional(),
    contactName: z.string().optional(),
    providerId: z.string().uuid('ID de prestadora inválido.').optional(),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Nome do usuário é obrigatório.' }).min(2),
    email: z.string({ required_error: 'E-mail é obrigatório.' }).email('E-mail inválido.'),
    password: z.string({ required_error: 'Senha é obrigatória.' }).min(6, 'Senha mínima de 6 caracteres.'),
    role: z.nativeEnum(UserRole, { required_error: 'Perfil de acesso (role) é obrigatório.' }),
    companyId: z.string().uuid('ID da empresa inválido.').optional(),
  }),
});
