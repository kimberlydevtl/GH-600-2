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

