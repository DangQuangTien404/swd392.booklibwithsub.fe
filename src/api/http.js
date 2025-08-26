import axios from 'axios';
import appsettings from '../appsettings';

const http = axios.create({
  baseURL: appsettings.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' }
});

http.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export default http;
