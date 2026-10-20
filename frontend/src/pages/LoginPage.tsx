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
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Estados dos Formulários
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados de Carregamento e Mensagens
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modal Google
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

    if (mode === 'register') {
      if (password.length < 6) {
        setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('As senhas não coincidem. Por favor, confira a confirmação.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha na autenticação. Verifique os dados informados.');
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

  const fillQuickCredentials = (userEmail: string, userPass: string) => {
    setMode('login');
    setEmail(userEmail);
    setPassword(userPass);
    setErrorMessage('');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card" style={{ maxWidth: '460px' }}>
        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
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
            {mode === 'login' ? <ShieldCheck size={32} /> : <UserPlus size={30} />}
          </div>
          <h1 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>
            {mode === 'login' ? 'Portal de Folha Contábil' : 'Crie sua Conta'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {mode === 'login'
              ? 'Acesso integrado para Contabilidade e Empresas Clientes'
              : 'Cadastre-se para gerenciar ou consultar folhas de pagamento'}
          </p>
        </div>

        {/* Abas Superiores de Seleção: Entrar / Cadastrar-se */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '5px',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-color)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0.6rem',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'login' ? 'var(--primary)' : 'transparent',
              color: mode === 'login' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <LogIn size={16} />
            <span>Entrar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0.6rem',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'register' ? 'var(--primary)' : 'transparent',
              color: mode === 'register' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <UserPlus size={16} />
            <span>Cadastrar-se</span>
          </button>
        </div>

        {/* Botão Oficial: Entrar com o Google */}
        <div style={{ marginBottom: '1.25rem' }}>
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
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
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
            <span>{mode === 'login' ? 'Continuar com o Google' : 'Cadastrar com o Google'}</span>
          </button>
        </div>

        {/* Divisor */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', gap: '0.75rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            ou preencha com e-mail
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

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

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Nome Completo *</label>
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
                  required
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="Ex: Carlos Eduardo Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">E-mail corporativo ou pessoal *</label>
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
            <label className="form-label">Senha de acesso *</label>
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
                minLength={6}
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Confirme sua Senha *</label>
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
                  minLength={6}
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="Repita a senha digitada acima"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.75rem', height: '46px', fontSize: '0.95rem' }}
          >
            {loading ? (
              <span>Processando...</span>
            ) : mode === 'login' ? (
              <>
                <span>Acessar Painel</span>
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                <span>Criar Minha Conta</span>
                <UserPlus size={18} />
              </>
            )}
          </button>
        </form>

        {/* Links de Alternância no Rodapé */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          {mode === 'login' ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Ainda não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#818cf8',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  font: 'inherit',
                }}
              >
                Cadastre-se aqui
              </button>
            </p>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Já possui uma conta cadastrada?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#818cf8',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  font: 'inherit',
                }}
              >
                Faça login aqui
              </button>
            </p>
          )}
        </div>

        {/* Atalhos Rápidos para Testes da Equipe */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginBottom: '0.75rem',
              textAlign: 'center',
            }}
          >
            ⚡ Acessos pré-configurados para testes do time:
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

      {/* Modal Interativo de Autenticação com o Google */}
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
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Fazer login com o Google</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Conecte-se com sua conta Google com 1 clique
              </p>
            </div>

            {/* Contas Rápidas de Teste do Google */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={() => {
                  setCustomGoogleEmail('romulo.dev@gmail.com');
                  setCustomGoogleName('Rômulo Desenvolvedor');
                }}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '0.75rem' }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#4f46e5',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                  }}
                >
                  R
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Rômulo Desenvolvedor</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>romulo.dev@gmail.com</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCustomGoogleEmail('contabil.cliente@gmail.com');
                  setCustomGoogleName('Cliente Google RH');
                }}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '0.75rem' }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#06b6d4',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                  }}
                >
                  C
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Cliente Google RH</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>contabil.cliente@gmail.com</div>
                </div>
              </button>
            </div>

            <form onSubmit={handleCustomGoogleSubmit}>
              <div className="form-group">
                <label className="form-label">Ou digite qualquer e-mail do Google:</label>
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
                <label className="form-label">Seu Nome no Google:</label>
                <input
                  type="text"
                  placeholder="Nome de exibição"
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
