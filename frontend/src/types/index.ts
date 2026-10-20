export type UserRole =
  | 'MASTER_ADMIN'
  | 'PROVIDER_ADMIN'
  | 'PROVIDER_ACCOUNTANT'
  | 'CLIENT_ADMIN'
  | 'CLIENT_USER';

export type CompanyType = 'PROVIDER' | 'CLIENT';

export interface Company {
  id: string;
  name: string;
  tradeName?: string | null;
  taxId: string;
  companyType: CompanyType;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  useTimeTracking?: string | null;
  contactName?: string | null;
  isActive: boolean;
  providerId?: string | null;
  provider?: {
    id: string;
    name: string;
    tradeName?: string | null;
  } | null;
  _count?: {
    users?: number;
    clients?: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  googleId?: string | null;
  companyId: string | null;
  company?: {
    id: string;
    name: string;
    tradeName?: string | null;
    companyType: CompanyType;
  } | null;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
