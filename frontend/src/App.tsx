import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { UsersPage } from './pages/UsersPage';
import { PayrollPage } from './pages/PayrollPage';

export const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(99, 102, 241, 0.2)',
            borderTopColor: '#6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p>Carregando ambiente seguro...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="app-layout">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="main-content">
        <Navbar />

        <main style={{ flex: 1 }}>
          {currentTab === 'dashboard' && <DashboardPage setCurrentTab={setCurrentTab} />}
          {currentTab === 'companies' && <CompaniesPage />}
          {currentTab === 'users' && <UsersPage />}
          {currentTab === 'payroll' && <PayrollPage />}
        </main>
      </div>
    </div>
  );
};
