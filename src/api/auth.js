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
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed. Please check your credentials.');
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
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed. Please try again.');
  }

  return await response.json();
}

export async function logout() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  const response = await fetch(`${appsettings.apiBaseUrl}/auth/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Logout failed.');
  }

  localStorage.removeItem('user');
}

export async function updateUser(userId, values) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  const response = await fetch(`${appsettings.apiBaseUrl}/auth/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to update this user.');
    } else if (response.status === 404) {
      throw new Error('User not found.');
    } else {
      throw new Error('Failed to update user.');
    }
  }
}
