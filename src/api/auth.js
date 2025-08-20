// src/api/auth.js
// API functions for authentication (login/register)

import appsettings from '../appsettings';

export async function login(values) {
  const response = await fetch(`${appsettings.apiBaseUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error('Login failed. Please check your credentials.');
  }

  return await response.json();
}

export async function register(values) {
  const response = await fetch(`${appsettings.apiBaseUrl}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error('Registration failed. Please try again.');
  }

  return await response.json();
}
