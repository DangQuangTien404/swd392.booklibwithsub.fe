import axios from 'axios';
import appsettings from '../appsettings';

function getToken() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token;
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(values) {
  const response = await axios.post(`${appsettings.apiBaseUrl}/auth/login`, values);
  return response.data;
}

export async function register(values) {
  const response = await axios.post(`${appsettings.apiBaseUrl}/auth/register`, values);
  return response.data;
}

export async function logout() {
  await axios.post(`${appsettings.apiBaseUrl}/auth/logout`, {}, { headers: authHeaders() });
  localStorage.removeItem('user');
}

export async function updateUser(userId, values) {
  await axios.put(`${appsettings.apiBaseUrl}/auth/users/${userId}`, values, { headers: authHeaders() });
}