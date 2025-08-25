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

export async function getCurrentUserProfile() {
  const response = await axios.get(`${appsettings.apiBaseUrl}/users/me`, { headers: authHeaders() });
  return response.data;
}

export async function updateCurrentUserProfile(values) {
  await axios.put(`${appsettings.apiBaseUrl}/users/me`, values, { headers: authHeaders() });
}