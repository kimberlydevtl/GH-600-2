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
      {me && <section><p>Welcome, {me.name}. There are no pages yet. Agents will build them, one layer at a time.</p></section>}
      {!me && <p>Loading...</p>}
    </div>
  );
}

