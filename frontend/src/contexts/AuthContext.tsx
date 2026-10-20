import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthResponse } from '../types';
import { api } from '../services/api';

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (data: { credential?: string; email?: string; name?: string; avatarUrl?: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const saveAuthSession = (authData: AuthResponse) => {
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem('@folha_contabil:token', authData.token);
    localStorage.setItem('@folha_contabil:user', JSON.stringify(authData.user));
  };

  useEffect(() => {
    async function loadStoredAuth() {
      const storedToken = localStorage.getItem('@folha_contabil:token');
      const storedUser = localStorage.getItem('@folha_contabil:user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));

        // Valida no backend se a sessão ainda está válida
        try {
          const freshUserData = await api.get<User>('/auth/me');
          setUser(freshUserData);
          localStorage.setItem('@folha_contabil:user', JSON.stringify(freshUserData));
        } catch {
          logout();
        }
      }
      setLoading(false);
    }

    loadStoredAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    saveAuthSession(response);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
    saveAuthSession(response);
  };

  const loginWithGoogle = async (googlePayload: {
    credential?: string;
    email?: string;
    name?: string;
    avatarUrl?: string;
  }) => {
    const response = await api.post<AuthResponse>('/auth/google', googlePayload);
    saveAuthSession(response);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('@folha_contabil:token');
    localStorage.removeItem('@folha_contabil:user');
  };

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'MASTER_ADMIN') return true;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
