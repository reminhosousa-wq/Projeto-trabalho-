import React, { useEffect, useState } from 'react';
import { Building2, Plus, RefreshCw, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { api } from '../services/api';
import { Company } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const CompaniesPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Formulário de Nova Empresa
  const [name, setName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [companyType, setCompanyType] = useState<'PROVIDER' | 'CLIENT'>('CLIENT');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [providerId, setProviderId] = useState('');

  const fetchCompanies = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await api.get<Company[]>('/companies');
      setCompanies(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao carregar lista de empresas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload: any = {
        name,
        tradeName: tradeName || undefined,
        taxId,
        companyType,
        email: email || undefined,
        phone: phone || undefined,
        city: city || undefined,
        state: state || undefined,
      };

      if (companyType === 'CLIENT' && providerId) {
        payload.providerId = providerId;
      }

      await api.post('/companies', payload);
      setSuccessMsg('Empresa cadastrada com sucesso!');
      setShowModal(false);
      resetForm();
      fetchCompanies();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao cadastrar empresa.');
    }
  };

  const resetForm = () => {
    setName('');
    setTradeName('');
    setTaxId('');
    setCompanyType('CLIENT');
    setEmail('');
    setPhone('');
    setCity('');
    setProviderId('');
  };

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj || cnpj.length !== 14) return cnpj;
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  const providerCompanies = companies.filter((c) => c.companyType === 'PROVIDER');

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Empresas & Organizações</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Gerenciamento das empresas contábeis prestadoras e das empresas clientes atendidas.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchCompanies} className="btn btn-secondary">
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Atualizar</span>
          </button>
          {hasRole('MASTER_ADMIN', 'PROVIDER_ADMIN') && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <Plus size={16} />
              <span>Nova Empresa</span>
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

      {/* Tabela de Empresas */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Razão Social / Nome Fantasia</th>
              <th>CNPJ</th>
              <th>Prestadora Responsável</th>
              <th>Localização</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 && !loading && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  Nenhuma empresa cadastrada ou visível para o seu usuário.
                </td>
              </tr>
            )}

            {companies.map((company) => (
              <tr key={company.id}>
                <td>
                  {company.companyType === 'PROVIDER' ? (
                    <span className="badge badge-provider">
                      <Building2 size={12} /> Prestadora
                    </span>
                  ) : (
                    <span className="badge badge-client">
                      <Shield size={12} /> Cliente
                    </span>
                  )}
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{company.name}</div>
                  {company.tradeName && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{company.tradeName}</div>
                  )}
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {formatCNPJ(company.taxId)}
                </td>
                <td>
                  {company.companyType === 'PROVIDER' ? (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Própria Contabilidade</span>
                  ) : company.provider ? (
                    <span style={{ color: '#93c5fd', fontWeight: 500 }}>{company.provider.tradeName || company.provider.name}</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>-</span>
                  )}
                </td>
                <td>
                  {company.city ? `${company.city} - ${company.state || 'UF'}` : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                </td>
                <td>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: company.isActive ? '#10b981' : '#f43f5e',
                    marginRight: '6px'
                  }} />
                  <span style={{ fontSize: '0.85rem' }}>{company.isActive ? 'Ativa' : 'Inativa'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Adicionar Empresa */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Cadastrar Nova Empresa</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Adicione uma nova empresa ao sistema para gerenciamento contábil.
            </p>

            <form onSubmit={handleCreateCompany}>
              <div className="form-group">
                <label className="form-label">Tipo de Empresa *</label>
                <select
                  className="form-select"
                  value={companyType}
                  onChange={(e) => setCompanyType(e.target.value as any)}
                >
                  <option value="CLIENT">Empresa Cliente (Atendida pela Contabilidade)</option>
                  <option value="PROVIDER">Empresa Prestadora (Contabilidade)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Razão Social *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alfa Comércio de Artigos Ltda"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nome Fantasia</label>
                  <input
                    type="text"
                    placeholder="Ex: Alfa Artigos"
                    className="form-input"
                    value={tradeName}
                    onChange={(e) => setTradeName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CNPJ (14 dígitos) *</label>
                  <input
                    type="text"
                    required
                    maxLength={18}
                    placeholder="00.000.000/0000-00"
                    className="form-input"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                  />
                </div>
              </div>

              {companyType === 'CLIENT' && providerCompanies.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Prestadora Contábil Responsável</label>
                  <select
                    className="form-select"
                    value={providerId}
                    onChange={(e) => setProviderId(e.target.value)}
                  >
                    <option value="">Selecione a Prestadora...</option>
                    {providerCompanies.map((prov) => (
                      <option key={prov.id} value={prov.id}>
                        {prov.name} ({formatCNPJ(prov.taxId)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">E-mail de Contato</label>
                  <input
                    type="email"
                    placeholder="contato@empresa.com"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Cidade</label>
                  <input
                    type="text"
                    placeholder="Ex: Campinas"
                    className="form-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">UF</label>
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="SP"
                    className="form-input"
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                  />
                </div>
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
                  Salvar Empresa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
