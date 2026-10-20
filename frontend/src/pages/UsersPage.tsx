import React, { useEffect, useState } from 'react';
import { Users, Plus, RefreshCw, AlertCircle, CheckCircle, ShieldCheck, Briefcase } from 'lucide-react';
import { api } from '../services/api';
import { User, Company, UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const UsersPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Formulário de Novo Usuário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CLIENT_USER');
  const [companyId, setCompanyId] = useState('');

  const fetchUsersAndCompanies = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [usersData, companiesData] = await Promise.all([
        api.get<User[]>('/users'),
        api.get<Company[]>('/companies'),
      ]);
      setUsers(usersData);
      setCompanies(companiesData);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao carregar lista de usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndCompanies();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await api.post('/users', {
        name,
        email,
        password,
        role,
        companyId: companyId || undefined,
      });

      setSuccessMsg('Usuário cadastrado com sucesso!');
      setShowModal(false);
      resetForm();
      fetchUsersAndCompanies();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao cadastrar usuário.');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('CLIENT_USER');
    setCompanyId('');
  };

  const getRoleBadge = (userRole: UserRole) => {
    switch (userRole) {
      case 'MASTER_ADMIN':
        return <span className="badge badge-master"><ShieldCheck size={12} /> Mestre Geral</span>;
      case 'PROVIDER_ADMIN':
        return <span className="badge badge-provider"><Briefcase size={12} /> Gestor Contábil</span>;
      case 'PROVIDER_ACCOUNTANT':
        return <span className="badge badge-provider"><Briefcase size={12} /> Contador Operador</span>;
      case 'CLIENT_ADMIN':
        return <span className="badge badge-client"><Users size={12} /> Gestor RH Cliente</span>;
      case 'CLIENT_USER':
        return <span className="badge badge-client"><Users size={12} /> Colaborador Cliente</span>;
      default:
        return <span className="badge">{userRole}</span>;
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Gestão de Usuários & Acessos</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Controle de contas, credenciais e níveis de privilégio da contabilidade e dos clientes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchUsersAndCompanies} className="btn btn-secondary">
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Atualizar</span>
          </button>
          {hasRole('MASTER_ADMIN', 'PROVIDER_ADMIN') && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <Plus size={16} />
              <span>Novo Usuário</span>
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fda4af', marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#6ee7b7', marginBottom: '1.5rem' }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabela de Usuários */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Perfil / Papel</th>
              <th>Empresa Associada</th>
              <th>Status</th>
              <th>Último Acesso</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && !loading && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  Nenhum usuário localizado.
                </td>
              </tr>
            )}

            {users.map((item) => (
              <tr key={item.id}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.email}</div>
                </td>
                <td>{getRoleBadge(item.role)}</td>
                <td>
                  {item.company ? (
                    <div>
                      <span style={{ fontWeight: 500, color: '#93c5fd' }}>
                        {item.company.tradeName || item.company.name}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.company.companyType === 'PROVIDER' ? 'Prestadora Contábil' : 'Empresa Cliente'}
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Global / Sem Empresa</span>
                  )}
                </td>
                <td>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: item.isActive ? '#10b981' : '#f43f5e',
                    marginRight: '6px'
                  }} />
                  <span style={{ fontSize: '0.85rem' }}>{item.isActive ? 'Ativo' : 'Inativo'}</span>
                </td>
                <td>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {item.lastLoginAt ? new Date(item.lastLoginAt).toLocaleString('pt-BR') : 'Nunca acessou'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Adicionar Usuário */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Cadastrar Novo Usuário</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Crie credenciais e atribua papéis operacionais ou administrativos.
            </p>

            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label className="form-label">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-mail de Acesso *</label>
                <input
                  type="email"
                  required
                  placeholder="carlos@empresa.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Senha Inicial *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Perfil de Acesso *</label>
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                  >
                    <option value="CLIENT_USER">Colaborador Cliente</option>
                    <option value="CLIENT_ADMIN">Gestor RH Cliente</option>
                    <option value="PROVIDER_ACCOUNTANT">Contador Operador</option>
                    <option value="PROVIDER_ADMIN">Gestor Contabilidade</option>
                    {hasRole('MASTER_ADMIN') && (
                      <option value="MASTER_ADMIN">Super Admin (Mestre)</option>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Empresa Vinculada</label>
                  <select
                    className="form-select"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                  >
                    <option value="">Nenhuma / Global</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.tradeName || c.name} ({c.companyType === 'PROVIDER' ? 'Prestadora' : 'Cliente'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Criar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
