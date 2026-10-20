import React from 'react';
import { LogOut, Building, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user?.company && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <Building size={16} color="#818cf8" />
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
              {user.company.tradeName || user.company.name}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({user.company.companyType === 'PROVIDER' ? 'Prestadora Contábil' : 'Empresa Cliente'})
            </span>
          </div>
        )}

        {!user?.company && user?.role === 'MASTER_ADMIN' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontSize: '0.875rem' }}>
            <ShieldCheck size={18} />
            <span style={{ fontWeight: 600 }}>Ambiente Global - Super Administrador</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={logout}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem', padding: '0.5rem 0.85rem' }}
          title="Encerrar Sessão"
        >
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
};
