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

export async function login({ username, password }) {
  const { data } = await axios.post(`${appsettings.apiBaseUrl}/auth/login`, { username, password });
  return data; 
}

export async function register(values) {

  const payload = {
    username: values.username?.trim(),
    password: values.password,
    fullName: values.fullName?.trim(),
    email: values.email?.trim(),
    phone: values.phone ?? values.phoneNumber, 
  };
  const { data } = await axios.post(`${appsettings.apiBaseUrl}/auth/register`, payload);
  return data;
}

export async function logout() {
  await axios.post(`${appsettings.apiBaseUrl}/auth/logout`, {}, { headers: authHeaders() });
  localStorage.removeItem('user');
}