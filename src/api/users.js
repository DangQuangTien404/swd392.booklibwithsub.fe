import appsettings from '../appsettings';

export async function getCurrentUserProfile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  const response = await fetch(`${appsettings.apiBaseUrl}/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch current user profile.');
  }

  return await response.json();
}

export async function updateCurrentUserProfile(values) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  const response = await fetch(`${appsettings.apiBaseUrl}/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error('Failed to update current user profile.');
  }
}
