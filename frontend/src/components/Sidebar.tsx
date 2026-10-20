import React from 'react';
import { LayoutDashboard, Building2, Users, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)'
        }}>
          FC
        </div>
        <div>
          <h2 style={{ fontSize: '1.05rem', margin: 0, color: '#fff' }}>Folha Contábil</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Módulo Empresarial</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-link ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Visão Geral</span>
        </button>

        <button
          className={`nav-link ${currentTab === 'companies' ? 'active' : ''}`}
          onClick={() => setCurrentTab('companies')}
        >
          <Building2 size={20} />
          <span>Empresas & Clientes</span>
        </button>

        <button
          className={`nav-link ${currentTab === 'users' ? 'active' : ''}`}
          onClick={() => setCurrentTab('users')}
        >
          <Users size={20} />
          <span>Gestão de Usuários</span>
        </button>

        <button
          className={`nav-link ${currentTab === 'payroll' ? 'active' : ''}`}
          onClick={() => setCurrentTab('payroll')}
        >
          <FileSpreadsheet size={20} />
          <span>Folhas & Holerites</span>
        </button>
      </nav>

      {/* Identificação de Permissão do Usuário no rodapé da Sidebar */}
      <div style={{
        padding: '1.25rem 1rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'var(--primary-light)',
          color: '#818cf8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f3f4f6', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user?.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            {user?.role === 'MASTER_ADMIN' && (
              <span className="badge badge-master" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                <ShieldAlert size={10} /> Mestre
              </span>
            )}
            {user?.role.startsWith('PROVIDER') && (
              <span className="badge badge-provider" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                Prestadora
              </span>
            )}
            {user?.role.startsWith('CLIENT') && (
              <span className="badge badge-client" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                Cliente
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
