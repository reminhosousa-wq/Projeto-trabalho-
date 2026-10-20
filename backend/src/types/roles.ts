export enum UserRole {
  MASTER_ADMIN = 'MASTER_ADMIN',
  PROVIDER_ADMIN = 'PROVIDER_ADMIN',
  PROVIDER_ACCOUNTANT = 'PROVIDER_ACCOUNTANT',
  CLIENT_ADMIN = 'CLIENT_ADMIN',
  CLIENT_USER = 'CLIENT_USER',
}

export enum CompanyType {
  PROVIDER = 'PROVIDER',
  CLIENT = 'CLIENT',
}

export interface AuthenticatedUserPayload {
  userId: string;
  email: string;
  role: UserRole;
  companyId: string | null;
}
