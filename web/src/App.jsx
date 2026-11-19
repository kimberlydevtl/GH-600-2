import { useEffect, useState } from 'react';
import { api, getUser, setUser } from './api.js';

export default function App() {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [user, setUserState] = useState(getUser());
  const [refresh, setRefresh] = useState(0);

  useEffect(() => { fetch('/api/users').then((r) => r.json()).then(setUsers); }, []);
  useEffect(() => { setUser(user); api('/me').then(setMe).catch(() => setMe(null)); }, [user]);
  const reload = () => setRefresh((n) => n + 1);

  return (
    <div>
      <header>
        <h1>Field Work Orders</h1>
        <label>Acting as{' '}
          <select value={user} onChange={(e) => setUserState(e.target.value)}>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role}{u.site ? `, ${u.site}` : ''})</option>)}
          </select>
        </label>
      </header>
      {me && <Dashboard key={`d${user}${refresh}`} />}
      {me?.can.create && <NewOrderForm onCreated={reload} />}
      {me && <OrderList key={`l${user}${refresh}`} me={me} onChange={reload} />}
      {!me && <p>Loading...</p>}
    </div>
  );
}

function OrderList({ me, onChange }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    const q = new URLSearchParams({ ...(status && { status }), ...(priority && { priority }) });
    api(`/workorders?${q}`).then((r) => setItems(r.items)).catch((e) => setError(e.message));
  }, [status, priority]);
  return (
    <section>
      <h2>Work orders</h2>
      <label>Status <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All</option><option value="open">Open</option><option value="in_progress">In progress</option>
        <option value="awaiting_hse">Awaiting HSE</option><option value="closed">Closed</option></select></label>{' '}
      <label>Priority <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="">All</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
      {error && <p className="error">{error}</p>}
      <table>
        <thead><tr><th>#</th><th>Title</th><th>Asset</th><th>Site</th><th>Priority</th><th>Risk</th><th>Status</th></tr></thead>
        <tbody>{items.map((w) => (
          <tr key={w.id}><td>{w.id}</td><td>{w.title}</td><td>{w.asset}</td><td>{w.site}</td><td>{w.priority}</td><td>{w.risk}</td><td>{w.status}</td>
          </tr>))}</tbody>
      </table>
    </section>
  );
}

function NewOrderForm({ onCreated }) {
  const empty = { title: '', asset: '', priority: 'medium', risk: 'normal' };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState([]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    api('/workorders', { method: 'POST', body: JSON.stringify(form) })
      .then(() => { setForm(empty); setErrors([]); onCreated(); })
      .catch((err) => setErrors(err.body?.details || [err.message]));
  };
  return (
    <section>
      <h2>New work order</h2>
      <form onSubmit={submit}>
        <label>Title <input value={form.title} onChange={set('title')} /></label>{' '}
        <label>Asset <input value={form.asset} onChange={set('asset')} /></label>{' '}
        <label>Priority <select value={form.priority} onChange={set('priority')}><option>high</option><option>medium</option><option>low</option></select></label>{' '}
        <label>Risk <select value={form.risk} onChange={set('risk')}><option>normal</option><option>high</option></select></label>{' '}
        <button type="submit">Create</button>
      </form>
      {errors.map((m) => <p key={m} className="error">{m}</p>)}
    </section>
  );
}

function Dashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { api('/stats').then(setS); }, []);
  if (!s) return null;
  const max = Math.max(1, ...Object.values(s.openByPriority));
  return (
    <section>
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', gap: 12 }}>
        <div>Total: <b>{s.total}</b></div><div>Open: <b>{s.byStatus.open}</b></div>
        <div>Awaiting HSE: <b>{s.byStatus.awaiting_hse}</b></div><div>Open high-risk: <b>{s.openHighRisk}</b></div>
      </div>
      <h3>Open by priority</h3>
      {Object.entries(s.openByPriority).map(([p, n]) => (
        <div key={p}>{p} <span style={{ display: 'inline-block', background: '#888', height: 10, width: `${(n / max) * 200}px` }} /> {n}</div>
      ))}
    </section>
  );
}

