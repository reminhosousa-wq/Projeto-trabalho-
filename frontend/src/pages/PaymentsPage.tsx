import React, { useMemo, useState } from 'react';
import { CreditCard, CalendarDays, CheckCircle2, Clock3, Download, Plus, Search, X } from 'lucide-react';

type Status = 'Pago' | 'Pendente' | 'Atrasado';
type Payment = { id: string; description: string; company: string; dueDate: string; amount: number; status: Status; method: string };
const initial: Payment[] = [
  { id: 'PAG-010', description: 'Mensalidade contábil', company: 'Empresa Exemplo Ltda.', dueDate: '2026-10-05', amount: 890, status: 'Pago', method: 'PIX' },
  { id: 'PAG-011', description: 'Processamento de folha', company: 'Comércio São José', dueDate: '2026-10-15', amount: 650, status: 'Pendente', method: 'Boleto' },
  { id: 'PAG-012', description: 'Mensalidade contábil', company: 'Mercado Central ME', dueDate: '2026-10-20', amount: 720, status: 'Atrasado', method: 'Boleto' },
  { id: 'PAG-013', description: 'Serviços adicionais', company: 'Empresa Exemplo Ltda.', dueDate: '2026-10-28', amount: 240, status: 'Pendente', method: 'PIX' },
];
const money = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dateText = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('pt-BR');

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState(initial);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [formOpen, setFormOpen] = useState(false);
  const [description, setDescription] = useState('Mensalidade contábil');
  const [company, setCompany] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-10');
  const [method, setMethod] = useState('PIX');
  const [notice, setNotice] = useState('');

  const shown = useMemo(() => payments.filter(p =>
    (filter === 'Todos' || p.status === filter) &&
    [p.id, p.description, p.company].some(v => v.toLowerCase().includes(search.toLowerCase()))
  ), [payments, filter, search]);
  const total = (status: Status) => payments.filter(p => p.status === status).reduce((sum, p) => sum + p.amount, 0);

  const createPayment = (event: React.FormEvent) => {
    event.preventDefault();
    const value = Number(amount.replace(',', '.'));
    if (!company.trim() || !Number.isFinite(value) || value <= 0) {
      setNotice('Informe a empresa e um valor válido maior que zero.');
      return;
    }
    setPayments(current => [{
      id: 'PAG-' + Date.now().toString().slice(-6), description, company: company.trim(),
      dueDate, amount: value, status: 'Pendente', method
    }, ...current]);
    setFormOpen(false);
    setCompany('');
    setAmount('');
    setNotice('Cobrança adicionada como pendente. Este protótipo não processa transações bancárias.');
  };

  const exportCsv = () => {
    const rows = [['Código','Descrição','Empresa','Vencimento','Valor','Status','Método'], ...shown.map(p => [p.id,p.description,p.company,p.dueDate,String(p.amount).replace('.', ','),p.status,p.method])];
    const csv = '\uFEFF' + rows.map(row => row.map(value => '"' + String(value).replace(/"/g, '""') + '"').join(';')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'pagamentos.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return <div className="page-container">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
      <div><h1 style={{ fontSize: '1.875rem', marginBottom: '.5rem' }}>Pagamentos</h1><p style={{ color: 'var(--text-secondary)' }}>Acompanhe cobranças, vencimentos e recebimentos das empresas.</p></div>
      <div style={{ display: 'flex', gap: '.75rem' }}><button className="btn btn-secondary" onClick={exportCsv}><Download size={17}/> Exportar CSV</button><button className="btn btn-primary" onClick={() => { setNotice(''); setFormOpen(true); }}><Plus size={17}/> Nova cobrança</button></div>
    </div>
    {notice && <p role="status" style={{ padding: '.85rem 1rem', borderRadius: '10px', marginBottom: '1rem', background: 'rgba(16,185,129,.12)', color: '#6ee7b7' }}>{notice}</p>}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
      <div className="card"><div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '.8rem' }}>Total recebido <CheckCircle2 color="#34d399" size={19}/></div><div style={{ fontSize: '1.65rem', fontWeight: 700 }}>{money(total('Pago'))}</div><span style={{ color: '#34d399', fontSize: '.8rem' }}>Pagamentos confirmados</span></div>
      <div className="card"><div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '.8rem' }}>A receber <Clock3 color="#38bdf8" size={19}/></div><div style={{ fontSize: '1.65rem', fontWeight: 700 }}>{money(total('Pendente'))}</div><span style={{ color: 'var(--text-secondary)', fontSize: '.8rem' }}>Cobranças pendentes</span></div>
      <div className="card"><div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '.8rem' }}>Em atraso <CreditCard color="#fb7185" size={19}/></div><div style={{ fontSize: '1.65rem', fontWeight: 700 }}>{money(total('Atrasado'))}</div><span style={{ color: '#fb7185', fontSize: '.8rem' }}>Requer acompanhamento</span></div>
    </div>
    <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}><CreditCard size={20} color="#818cf8"/><h2 style={{ fontSize: '1.05rem' }}>Histórico de cobranças</h2></div>
        <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', minWidth: '200px', maxWidth: '320px', flex: 1 }}><Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}/><input className="form-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar empresa ou cobrança" aria-label="Buscar pagamentos" style={{ paddingLeft: '2.25rem' }}/></div>
          <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filtrar status" style={{ width: 'auto', minWidth: '140px' }}><option>Todos</option><option>Pago</option><option>Pendente</option><option>Atrasado</option></select>
        </div>
      </div>
      <div className="table-container" style={{ border: 0, borderRadius: 0 }}><table className="custom-table">
        <thead><tr><th>Cobrança</th><th>Empresa</th><th>Vencimento</th><th>Valor</th><th>Método</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>{shown.map(p => <tr key={p.id}>
          <td><div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p.description}</div><div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{p.id}</div></td><td>{p.company}</td>
          <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}><CalendarDays size={15}/>{dateText(p.dueDate)}</span></td>
          <td style={{ color: 'var(--text-primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>{money(p.amount)}</td><td>{p.method}</td>
          <td><span className={p.status === 'Pago' ? 'badge badge-client' : p.status === 'Pendente' ? 'badge badge-provider' : 'badge'} style={p.status === 'Atrasado' ? { background: 'rgba(244,63,94,.13)', color: '#fda4af' } : undefined}>{p.status}</span></td>
          <td>{p.status === 'Pago' ? <span style={{ color: '#34d399', fontSize: '.8rem' }}>Confirmado</span> : <button className="btn btn-secondary" style={{ padding: '.4rem .65rem', fontSize: '.78rem' }} onClick={() => { setPayments(current => current.map(item => item.id === p.id ? { ...item, status: 'Pago' } : item)); setNotice('Status atualizado para pago (registro demonstrativo).'); }}>Marcar pago</button>}</td>
        </tr>)}{shown.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum pagamento encontrado.</td></tr>}</tbody>
      </table></div>
      <div style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '.8rem', borderTop: '1px solid var(--border-color)' }}>{shown.length} cobrança(s) exibida(s)</div>
    </section>
    {formOpen && <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setFormOpen(false); }}>
      <section className="modal-content" role="dialog" aria-modal="true" aria-labelledby="payment-title">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><div><h2 id="payment-title" style={{ fontSize: '1.3rem' }}>Nova cobrança</h2><p style={{ color: 'var(--text-secondary)', fontSize: '.85rem' }}>Cadastre os dados do pagamento.</p></div><button className="btn btn-secondary" aria-label="Fechar" onClick={() => setFormOpen(false)}><X size={18}/></button></div>
        <form onSubmit={createPayment}>
          <div className="form-group"><label className="form-label" htmlFor="pay-description">Descrição</label><select id="pay-description" className="form-select" value={description} onChange={e => setDescription(e.target.value)}><option>Mensalidade contábil</option><option>Processamento de folha</option><option>Serviços adicionais</option><option>Consultoria</option></select></div>
          <div className="form-group"><label className="form-label" htmlFor="pay-company">Empresa</label><input id="pay-company" className="form-input" value={company} onChange={e => setCompany(e.target.value)} placeholder="Nome da empresa" required/></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}><div className="form-group"><label className="form-label" htmlFor="pay-amount">Valor (R$)</label><input id="pay-amount" className="form-input" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0,00" required/></div><div className="form-group"><label className="form-label" htmlFor="pay-date">Vencimento</label><input id="pay-date" type="date" className="form-input" value={dueDate} onChange={e => setDueDate(e.target.value)} required/></div></div>
          <div className="form-group"><label className="form-label" htmlFor="pay-method">Método de pagamento</label><select id="pay-method" className="form-select" value={method} onChange={e => setMethod(e.target.value)}><option>PIX</option><option>Boleto</option><option>Transferência</option><option>Cartão</option></select></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '.78rem', marginBottom: '1.25rem' }}>Protótipo demonstrativo: não realiza cobranças nem transações bancárias reais.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.75rem' }}><button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>Cancelar</button><button type="submit" className="btn btn-primary"><Plus size={16}/> Criar cobrança</button></div>
        </form>
      </section>
    </div>}
  </div>;
};
