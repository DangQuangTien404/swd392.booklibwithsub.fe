
import http from './http';

export async function getCurrentUserProfile() {
  const res = await http.get('/users/me');
  return res.data;
}

export async function updateCurrentUserProfile(values) {
  const res = await http.put('/users/me', values);
  return res.data;
}
