import React from 'react';
import { FileSpreadsheet, PlusCircle, CheckCircle2, Calculator } from 'lucide-react';

export const PayrollPage: React.FC = () => {
  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Módulo de Folha de Pagamento</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Processamento de proventos, descontos legais (INSS, IRRF, FGTS) e emissão de holerites para clientes.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => alert('Pronto para o próximo sprint da equipe! Estrutura de rotas e banco preparada.')}>
          <PlusCircle size={16} />
          <span>Nova Competência</span>
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem', border: '1px solid rgba(99, 102, 241, 0.3)', background: 'radial-gradient(ellipse at top, rgba(79, 70, 229, 0.15) 0%, rgba(17, 24, 39, 0.9) 70%)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'var(--primary-light)', borderRadius: '12px', color: '#818cf8' }}>
            <Calculator size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Base Arquitetural Pronta para Expansão da Equipe</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              A estrutura do banco e autenticação criada suporta diretamente as próximas entidades de negócio que o grupo de 4 integrantes irá implementar:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>1. Employees (Funcionários)</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Vinculados à Empresa Cliente, CPF, Cargo, Salário Base, Admissão.</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: '#34d399', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>2. Payroll / Competência</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Mês/Ano de referência (ex: 10/2026), status (Aberta, Fechada, Paga).</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>3. Payroll Items / Rubricas</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Proventos (Horas extras, Comissões) e Descontos (INSS, IRRF, VT).</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: '#c084fc', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>4. Holerites & Relatórios</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Visualização direta pelo Cliente e exportação em PDF.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileSpreadsheet size={18} color="#818cf8" />
          Demonstrativo de Folhas Cadastradas (Exemplo de Fluxo)
        </h3>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Competência</th>
                <th>Empresa Cliente</th>
                <th>Qtd. Colaboradores</th>
                <th>Total Bruto</th>
                <th>Líquido a Pagar</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>10/2026</td>
                <td>Tech Solutions Comércio e Serviços Ltda</td>
                <td>12 colaboradores</td>
                <td>R$ 48.500,00</td>
                <td>R$ 39.840,00</td>
                <td>
                  <span className="badge badge-client">
                    <CheckCircle2 size={12} /> Pronta para Envio
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
