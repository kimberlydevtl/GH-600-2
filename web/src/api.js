// The web app only talks to /api. It never decides permissions; the API does.
let currentUser = localStorage.getItem('user') || 'tina';
export const getUser = () => currentUser;
export const setUser = (u) => { currentUser = u; localStorage.setItem('user', u); };
export async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'x-user': currentUser, ...(options.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(body.error || res.statusText), { status: res.status, body });
  return body;
}
