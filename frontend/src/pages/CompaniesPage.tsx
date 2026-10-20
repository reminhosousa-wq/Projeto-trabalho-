import React, { useEffect, useState } from 'react';
import {
  Building2,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Shield,
  Eye,
  Pencil,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  Search,
} from 'lucide-react';
import { api } from '../services/api';
import { Company } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const CompaniesPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'CLIENT' | 'PROVIDER'>('CLIENT');

  // Modais
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Mensagens
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Formulário Completo de Cadastro de Empresa Cliente / Prestadora
  const [name, setName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [companyType, setCompanyType] = useState<'PROVIDER' | 'CLIENT'>('CLIENT');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [postalCode, setPostalCode] = useState('');
  const [useTimeTracking, setUseTimeTracking] = useState('Sim');
  const [contactName, setContactName] = useState('');
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

  const resetForm = () => {
    setName('');
    setTradeName('');
    setTaxId('');
    setCompanyType('CLIENT');
    setEmail('');
    setPhone('');
    setAddress('');
    setNeighborhood('');
    setCity('');
    setState('SP');
    setPostalCode('');
    setUseTimeTracking('Sim');
    setContactName('');
    setProviderId('');
    setEditingId(null);
  };

  const handleOpenCreateModal = (type: 'CLIENT' | 'PROVIDER' = 'CLIENT') => {
    resetForm();
    setCompanyType(type);
    setShowModal(true);
  };

  const handleOpenEditModal = (comp: Company) => {
    setEditingId(comp.id);
    setName(comp.name);
    setTradeName(comp.tradeName || '');
    setTaxId(comp.taxId);
    setCompanyType(comp.companyType);
    setEmail(comp.email || '');
    setPhone(comp.phone || '');
    setAddress(comp.address || '');
    setNeighborhood(comp.neighborhood || '');
    setCity(comp.city || '');
    setState(comp.state || 'SP');
    setPostalCode(comp.postalCode || '');
    setUseTimeTracking(comp.useTimeTracking || 'Sim');
    setContactName(comp.contactName || '');
    setProviderId(comp.providerId || '');
    setShowModal(true);
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
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
        address: address || undefined,
        neighborhood: neighborhood || undefined,
        city: city || undefined,
        state: state || undefined,
        postalCode: postalCode || undefined,
        useTimeTracking,
        contactName: contactName || undefined,
      };

      if (companyType === 'CLIENT' && providerId) {
        payload.providerId = providerId;
      }

      if (editingId) {
        await api.put(`/companies/${editingId}`, payload);
        setSuccessMsg('Dados da empresa atualizados com sucesso!');
      } else {
        await api.post('/companies', payload);
        setSuccessMsg('Empresa cliente cadastrada com sucesso!');
      }

      setShowModal(false);
      resetForm();
      fetchCompanies();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao salvar empresa.');
    }
  };

  const handleDeleteCompany = async (comp: Company) => {
    if (!window.confirm(`Tem certeza que deseja remover a empresa "${comp.tradeName || comp.name}"?`)) {
      return;
    }

    try {
      await api.delete(`/companies/${comp.id}`);
      setSuccessMsg('Empresa removida com sucesso!');
      fetchCompanies();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao excluir empresa.');
    }
  };

  const formatCNPJ = (cnpj: string) => {
    const digits = cnpj ? cnpj.replace(/\D/g, '') : '';
    if (digits.length !== 14) return cnpj;
    return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  const providerCompanies = companies.filter((c) => c.companyType === 'PROVIDER');

  // Filtragem
  const filteredCompanies = companies.filter((comp) => {
    const matchesFilter =
      filterType === 'ALL' || comp.companyType === filterType;
    const matchesSearch =
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (comp.tradeName && comp.tradeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      comp.taxId.includes(searchTerm.replace(/\D/g, ''));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="page-container">
      {/* Título e Ações */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Empresas Clientes & Organizações</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Cadastro completo das empresas clientes atendidas pela empresa de contabilidade.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={fetchCompanies} className="btn btn-secondary">
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Atualizar</span>
          </button>
          {hasRole('MASTER_ADMIN', 'PROVIDER_ADMIN', 'PROVIDER_ACCOUNTANT') && (
            <button onClick={() => handleOpenCreateModal('CLIENT')} className="btn btn-primary">
              <Plus size={16} />
              <span>Cadastrar Empresa Cliente</span>
            </button>
          )}
        </div>
      </div>

      {/* Alertas */}
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

      {/* Barra de Filtros e Busca */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => setFilterType('CLIENT')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              background: filterType === 'CLIENT' ? 'var(--primary)' : 'transparent',
              color: filterType === 'CLIENT' ? 'white' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🏢 Empresas Clientes ({companies.filter((c) => c.companyType === 'CLIENT').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('PROVIDER')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              background: filterType === 'PROVIDER' ? 'var(--primary)' : 'transparent',
              color: filterType === 'PROVIDER' ? 'white' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            📊 Prestadoras ({companies.filter((c) => c.companyType === 'PROVIDER').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('ALL')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              background: filterType === 'ALL' ? 'var(--primary)' : 'transparent',
              color: filterType === 'ALL' ? 'white' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Todas ({companies.length})
          </button>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar por Razão, Fantasia ou CNPJ..."
            className="form-input"
            style={{ paddingLeft: '36px', height: '38px', fontSize: '0.875rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de Empresas Clientes */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Razão Social / Nome Fantasia</th>
              <th>CNPJ</th>
              <th>Responsável / Contato</th>
              <th>Usa Ponto?</th>
              <th>Contabilidade Responsável</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length === 0 && !loading && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Nenhuma empresa encontrada com os filtros informados.
                </td>
              </tr>
            )}

            {filteredCompanies.map((comp) => (
              <tr key={comp.id}>
                <td>
                  {comp.companyType === 'CLIENT' ? (
                    <span className="badge badge-client">
                      <Shield size={12} /> Cliente
                    </span>
                  ) : (
                    <span className="badge badge-provider">
                      <Building2 size={12} /> Prestadora
                    </span>
                  )}
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{comp.name}</div>
                  {comp.tradeName && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{comp.tradeName}</div>
                  )}
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {formatCNPJ(comp.taxId)}
                </td>
                <td>
                  {comp.contactName ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                      <User size={13} color="var(--text-muted)" />
                      <span>{comp.contactName}</span>
                    </div>
                  ) : comp.email ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{comp.email}</div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </td>
                <td>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: comp.useTimeTracking === 'Sim' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      color: comp.useTimeTracking === 'Sim' ? '#34d399' : 'var(--text-muted)',
                      fontWeight: 600,
                    }}
                  >
                    {comp.useTimeTracking || 'Sim'}
                  </span>
                </td>
                <td>
                  {comp.companyType === 'PROVIDER' ? (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Própria Contabilidade</span>
                  ) : comp.provider ? (
                    <span style={{ color: '#93c5fd', fontWeight: 500, fontSize: '0.85rem' }}>
                      {comp.provider.tradeName || comp.provider.name}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                    <button
                      type="button"
                      title="Ver dados completos"
                      onClick={() => {
                        setSelectedCompany(comp);
                        setShowDetailsModal(true);
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.55rem', fontSize: '0.8rem' }}
                    >
                      <Eye size={14} />
                    </button>
                    {hasRole('MASTER_ADMIN', 'PROVIDER_ADMIN', 'PROVIDER_ACCOUNTANT') && (
                      <button
                        type="button"
                        title="Editar cadastro"
                        onClick={() => handleOpenEditModal(comp)}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.55rem', fontSize: '0.8rem' }}
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                    {hasRole('MASTER_ADMIN', 'PROVIDER_ADMIN') && (
                      <button
                        type="button"
                        title="Excluir empresa"
                        onClick={() => handleDeleteCompany(comp)}
                        className="btn btn-danger"
                        style={{ padding: '0.35rem 0.55rem', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: Formulário de Cadastro / Edição de Empresa */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>
              {editingId ? 'Editar Cadastro da Empresa' : 'Cadastrar Empresa Cliente'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Preencha os dados cadastrais da empresa atendida pela contabilidade.
            </p>

            <form onSubmit={handleSaveCompany}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tipo de Organização *</label>
                  <select
                    className="form-select"
                    value={companyType}
                    disabled={!!editingId}
                    onChange={(e) => setCompanyType(e.target.value as any)}
                  >
                    <option value="CLIENT">Empresa Cliente (Atendida)</option>
                    <option value="PROVIDER">Empresa Prestadora (Contabilidade)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Controle de Ponto Eletrônico *</label>
                  <select
                    className="form-select"
                    value={useTimeTracking}
                    onChange={(e) => setUseTimeTracking(e.target.value)}
                  >
                    <option value="Sim">Sim (Folha + Ponto integrado)</option>
                    <option value="Não">Não (Apenas Folha de Pagamento)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Razão Social *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Comercial Ferreira & Filhos Ltda"
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
                    placeholder="Ex: Ferreira Supermercados"
                    className="form-input"
                    value={tradeName}
                    onChange={(e) => setTradeName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CNPJ *</label>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Contato / Responsável de RH</label>
                  <input
                    type="text"
                    placeholder="Ex: Ana Paula Martins"
                    className="form-input"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefone de Contato</label>
                  <input
                    type="text"
                    placeholder="(11) 3456-7890"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">E-mail Corporativo de Contato</label>
                <input
                  type="email"
                  placeholder="rh@empresa.com.br"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Endereço */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Endereço & Localização
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Logradouro / Número</label>
                  <input
                    type="text"
                    placeholder="Av. Brasil, 1500"
                    className="form-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bairro</label>
                  <input
                    type="text"
                    placeholder="Centro"
                    className="form-input"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Cidade</label>
                  <input
                    type="text"
                    placeholder="São Paulo"
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
                <div className="form-group">
                  <label className="form-label">CEP</label>
                  <input
                    type="text"
                    placeholder="01234-567"
                    className="form-input"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
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
                    <option value="">Selecione a Prestadora Contábil...</option>
                    {providerCompanies.map((prov) => (
                      <option key={prov.id} value={prov.id}>
                        {prov.tradeName || prov.name} ({formatCNPJ(prov.taxId)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Salvar Alterações' : 'Cadastrar Empresa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Visualização Completa dos Dados da Empresa */}
      {showDetailsModal && selectedCompany && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <span className={`badge ${selectedCompany.companyType === 'CLIENT' ? 'badge-client' : 'badge-provider'}`}>
                  {selectedCompany.companyType === 'CLIENT' ? 'Empresa Cliente' : 'Prestadora Contábil'}
                </span>
                <h2 style={{ fontSize: '1.4rem', marginTop: '0.5rem', marginBottom: '0.2rem' }}>
                  {selectedCompany.tradeName || selectedCompany.name}
                </h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Razão Social: {selectedCompany.name}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CNPJ:</span>
                <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{formatCNPJ(selectedCompany.taxId)}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Controle de Ponto:</span>
                <div style={{ fontWeight: 600, color: selectedCompany.useTimeTracking === 'Sim' ? '#34d399' : 'var(--text-secondary)' }}>
                  <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {selectedCompany.useTimeTracking || 'Sim'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <User size={16} color="#818cf8" />
                <span>Responsável de RH:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedCompany.contactName || 'Não informado'}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Mail size={16} color="#818cf8" />
                <span>E-mail:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedCompany.email || 'Não informado'}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Phone size={16} color="#818cf8" />
                <span>Telefone:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedCompany.phone || 'Não informado'}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <MapPin size={16} color="#818cf8" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span>Endereço:</span>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {[selectedCompany.address, selectedCompany.neighborhood, selectedCompany.city && `${selectedCompany.city} - ${selectedCompany.state || ''}`, selectedCompany.postalCode && `CEP ${selectedCompany.postalCode}`]
                    .filter(Boolean)
                    .join(', ') || 'Endereço não cadastrado'}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDetailsModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
