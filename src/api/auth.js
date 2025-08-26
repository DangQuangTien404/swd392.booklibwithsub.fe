import http from './http';

export async function login(values) {
  const res = await http.post('/auth/login', values);
  const data = res.data;
  if (data && data.token) localStorage.setItem('user', JSON.stringify(data));
  return data;
}

export async function register(values) {
  const res = await http.post('/auth/register', values);
  return res.data;
}

export async function logout() {
  try { await http.post('/auth/logout', {}); } finally { localStorage.removeItem('user'); }
}

export async function updateUser(userId, values) {
  const res = await http.put(`/auth/users/${userId}`, values);
  return res.data;
}
