import React, { useState, useEffect } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, User as UserIcon, CheckCircle2, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

declare global {
  interface Window {
    google?: any;
  }
}

export const LoginPage: React.FC = () => {
  const { login, register, loginWithGoogle } = useAuth();
  
  // Modo atual: 'login' ou 'register' com 2 botões claramente separados
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Campos do Formulário
  const [identifier, setIdentifier] = useState(''); // Aceita qualquer usuário ou e-mail
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Mensagens e Estados
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Google Modal
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // Inicializa o script oficial do Google Identity Services se houver Client ID
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (response: any) => {
              if (response.credential) {
                loginWithGoogle({ credential: response.credential });
              }
            },
          });
        }
      };
      document.body.appendChild(script);
    }
  }, [loginWithGoogle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Por favor, informe seu usuário ou e-mail.');
      return;
    }

    if (!password) {
      setErrorMessage('Por favor, digite uma senha.');
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'login') {
        await login(identifier, password);
      } else {
        await register(fullName, identifier, password);
        setSuccessMessage('Usuário cadastrado com sucesso e salvo no banco de dados!');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao processar sua solicitação.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId && window.google) {
      try {
        window.google.accounts.id.prompt();
        return;
      } catch (e) {
        console.warn('Google prompt fallback:', e);
      }
    }
    setShowGoogleModal(true);
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail) return;
    setLoading(true);
    setErrorMessage('');
    try {
      await loginWithGoogle({
        email: customGoogleEmail,
        name: customGoogleName || customGoogleEmail.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customGoogleEmail)}`,
      });
      setShowGoogleModal(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao conectar com conta Google.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (userLogin: string, userPass: string) => {
    setActiveTab('login');
    setIdentifier(userLogin);
    setPassword(userPass);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card" style={{ maxWidth: '480px' }}>
        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
            }}
          >
            {activeTab === 'login' ? <ShieldCheck size={32} /> : <UserPlus size={32} />}
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Portal de Folha Contábil
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Sistema de Gestão para Empresas Contábeis e Clientes
          </p>
        </div>

        {/* DOIS BOTÕES SEPARADOS EM DESTAQUE (LOGIN vs CADASTRO) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* Botão 1: ENTRAR / LOGIN */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              border: activeTab === 'login' ? '2px solid #6366f1' : '1px solid var(--border-color)',
              background: activeTab === 'login' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'rgba(255, 255, 255, 0.04)',
              color: activeTab === 'login' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'login' ? '0 4px 14px rgba(79, 70, 229, 0.4)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <LogIn size={18} />
            <span>Fazer Login</span>
          </button>

          {/* Botão 2: CADASTRAR-SE */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              border: activeTab === 'register' ? '2px solid #06b6d4' : '1px solid var(--border-color)',
              background: activeTab === 'register' ? 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' : 'rgba(255, 255, 255, 0.04)',
              color: activeTab === 'register' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'register' ? '0 4px 14px rgba(6, 182, 212, 0.4)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <UserPlus size={18} />
            <span>Cadastrar-se</span>
          </button>
        </div>

        {/* Mensagem Explicativa do Modo de Cadastro */}
        {activeTab === 'register' && (
          <div
            style={{
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.8rem',
              color: '#67e8f9',
              marginBottom: '1.25rem',
              lineHeight: '1.4',
            }}
          >
            📝 <strong>Cadastro Livre:</strong> Cadastre qualquer nome de usuário ou e-mail com sua senha. Os dados serão salvos no banco de dados para todos os seus logins futuros!
          </div>
        )}

        {/* Alertas */}
        {errorMessage && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#fda4af',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#6ee7b7',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* FORMULÁRIO DINÂMICO (LOGIN OU CADASTRO) */}
        <form onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <div className="form-group">
              <label className="form-label">Nome Completo (Opcional)</label>
              <div style={{ position: 'relative' }}>
                <UserIcon
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="Ex: Carlos Silva"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              {activeTab === 'login' ? 'Usuário ou E-mail' : 'Escolha seu Usuário ou E-mail *'}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                required
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder={activeTab === 'login' ? 'Seu usuário ou e-mail' : 'Ex: juan, admin2 ou juan@email.com'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {activeTab === 'login' ? 'Senha de Acesso' : 'Escolha uma Senha *'}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="password"
                required
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '0.75rem',
              height: '46px',
              fontSize: '0.95rem',
              background: activeTab === 'register' ? 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' : undefined,
            }}
          >
            {loading ? (
              <span>Salvando e Autenticando...</span>
            ) : activeTab === 'login' ? (
              <>
                <span>Entrar no Sistema</span>
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                <span>Salvar Cadastro e Entrar</span>
                <UserPlus size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divisor */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0 1rem', gap: '0.75rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            ou acesse com
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* Botão Oficial Google */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            background: '#ffffff',
            color: '#1f2937',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continuar com o Google</span>
        </button>

        {/* Atalhos Rápidos da Equipe */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginBottom: '0.75rem',
              textAlign: 'center',
            }}
          >
            ⚡ Acessos pré-configurados para testes do grupo:
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

      {/* Modal Interativo do Google */}
      {showGoogleModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'white',
                  margin: '0 auto 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Login com o Google</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Conecte-se com sua conta Google
              </p>
            </div>

            <form onSubmit={handleCustomGoogleSubmit}>
              <div className="form-group">
                <label className="form-label">E-mail do Google:</label>
                <input
                  type="email"
                  required
                  placeholder="seu.email@gmail.com"
                  className="form-input"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nome de Exibição:</label>
                <input
                  type="text"
                  placeholder="Nome no Google"
                  className="form-input"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowGoogleModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Conectando...' : 'Entrar com Google'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
