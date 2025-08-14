// src/api/auth.js
// API functions for authentication (login/register)

import axios from 'axios';
import appsettings from '../appsettings';

export async function login({ username, password }) {
  const response = await axios.post(
    `${appsettings.apiBaseUrl}/Auth/login`,
    { username, password },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
}

export async function register({ username, password, role }) {
  const response = await axios.post(
    `${appsettings.apiBaseUrl}/Auth/register`,
    { username, password, role: 'user' },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
}
