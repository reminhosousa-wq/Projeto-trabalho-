import React from 'react';
import { LayoutDashboard, Building2, Users, FileSpreadsheet, ShieldAlert, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps { currentTab: string; setCurrentTab: (tab: string) => void; }

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { user } = useAuth();
  const items = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'companies', label: 'Empresas & Clientes', icon: Building2 },
    { id: 'users', label: 'Gestão de Usuários', icon: Users },
    { id: 'payroll', label: 'Folhas & Holerites', icon: FileSpreadsheet },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
  ];
  return <aside className="sidebar">
    <div className="sidebar-header"><div style={{ background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)' }}>FC</div><div><h2 style={{ fontSize: '1.05rem', margin: 0, color: '#fff' }}>Folha Contábil</h2><span style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Módulo Empresarial</span></div></div>
    <nav className="sidebar-nav">{items.map(item => { const Icon = item.icon; return <button key={item.id} className={'nav-link ' + (currentTab === item.id ? 'active' : '')} onClick={() => setCurrentTab(item.id)}><Icon size={20}/><span>{item.label}</span></button>; })}</nav>
    <div style={{ padding: '1.25rem 1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '.75rem', background: 'rgba(0, 0, 0, 0.15)' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '.9rem' }}>{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
      <div style={{ overflow: 'hidden' }}><div style={{ fontSize: '.85rem', fontWeight: 600, color: '#f3f4f6', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name}</div><div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
        {user?.role === 'MASTER_ADMIN' && <span className="badge badge-master" style={{ fontSize: '.65rem', padding: '.1rem .4rem' }}><ShieldAlert size={10}/> Mestre</span>}
        {user?.role.startsWith('PROVIDER') && <span className="badge badge-provider" style={{ fontSize: '.65rem', padding: '.1rem .4rem' }}>Prestadora</span>}
        {user?.role.startsWith('CLIENT') && <span className="badge badge-client" style={{ fontSize: '.65rem', padding: '.1rem .4rem' }}>Cliente</span>}
      </div></div>
    </div>
  </aside>;
};
