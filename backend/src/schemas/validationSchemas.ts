import { z } from 'zod';
import { UserRole, CompanyType } from '../types/roles.js';

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'O usuário ou e-mail é obrigatório.' }).min(1, 'Informe o usuário ou e-mail.'),
    password: z.string({ required_error: 'A senha é obrigatória.' }).min(1, 'Informe a senha.'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string({ required_error: 'O usuário ou e-mail é obrigatório.' }).min(1, 'Informe o usuário ou e-mail.'),
    password: z.string({ required_error: 'A senha é obrigatória.' }).min(1, 'Informe a senha.'),
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
