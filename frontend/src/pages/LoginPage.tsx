import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao autenticar. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setErrorMessage('');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)'
          }}>
            <ShieldCheck size={30} />
          </div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.35rem' }}>Portal de Folha Contábil</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Acesso integrado para Contabilidade e Empresas Clientes
          </p>
        </div>

        {errorMessage && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#fda4af',
            fontSize: '0.875rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-mail corporativo</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="seu.email@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Senha de acesso</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', height: '46px' }}
          >
            {loading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Acessar Painel</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Atalhos Rápidos para Testes da Equipe */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textAlign: 'center' }}>
            ⚡ Atalhos rápidos para o time de desenvolvimento:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => fillQuickCredentials('admin@contabilidade.com', 'admin_master_123')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.45rem' }}
            >
              👑 Usuário Mestre
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('rh@techsolutions.com.br', 'cliente_pass_123')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.45rem' }}
            >
              🏢 Cliente RH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
