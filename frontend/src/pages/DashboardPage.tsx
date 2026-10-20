import React from 'react';
import { Building2, Users, FileCheck, Shield, GitBranch, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  setCurrentTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      {/* Boas-vindas */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>
          Bem-vindo, {user?.name}! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {user?.role === 'MASTER_ADMIN'
            ? 'Você está logado como Administrador Mestre com privilégios irrestritos sobre toda a plataforma.'
            : `Painel de controle para ${user?.company?.tradeName || user?.company?.name || 'sua organização'}.`}
        </p>
      </div>

      {/* Cards de Métricas Principais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>EMPRESAS ATENDIDAS</span>
            <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '8px', color: '#818cf8' }}>
              <Building2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>2</div>
          <div style={{ fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>1 Prestadora + 1 Cliente ativo</span>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>USUÁRIOS ATIVOS</span>
            <div style={{ padding: '8px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '8px', color: '#22d3ee' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>2</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Permissões Mestre & Cliente configuradas
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>COMPETÊNCIA ATUAL</span>
            <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', color: '#34d399' }}>
              <FileCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>10/2026</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Período aberto para lançamento de folha
          </div>
        </div>
      </div>

      {/* Grid de Informações e Arquitetura para a Equipe */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <Shield size={22} color="#818cf8" />
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Hierarquia e Permissões do Sistema</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
            A arquitetura inicial contempla uma separação segura entre a empresa contábil e as empresas clientes contratantes:
          </p>
          <ul style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.7' }}>
            <li><strong>MASTER_ADMIN:</strong> Superusuário do sistema que cria e monitora tudo.</li>
            <li><strong>PROVIDER_ADMIN:</strong> Gestor da contabilidade que adiciona clientes e analistas.</li>
            <li><strong>PROVIDER_ACCOUNTANT:</strong> Contador operador da folha dos clientes.</li>
            <li><strong>CLIENT_ADMIN:</strong> Gestor de RH da empresa cliente atendida.</li>
            <li><strong>CLIENT_USER:</strong> Colaborador que visualiza seu próprio holerite.</li>
          </ul>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <GitBranch size={22} color="#34d399" />
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Guia para o Time de Desenvolvimento (4 Pessoas)</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
            Sugestão de divisão de frentes de trabalho para o grupo:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
              👤 <strong>Membro 1 (Backend Core):</strong> Modelos de Funcionários, Cargos e Departamentos.
            </div>
            <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
              👤 <strong>Membro 2 (Motor de Cálculo):</strong> Regras de INSS, FGTS, IRRF e holerite.
            </div>
            <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
              👤 <strong>Membro 3 (Frontend Telas):</strong> Telas de cadastro de funcionários e contratos.
            </div>
            <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
              👤 <strong>Membro 4 (Frontend Relatórios):</strong> Visualização/download do holerite e dashboard analítico.
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setCurrentTab('companies')} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              <span>Ver Empresas</span>
              <ArrowUpRight size={14} />
            </button>
            <button onClick={() => setCurrentTab('users')} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              <span>Ver Usuários</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
