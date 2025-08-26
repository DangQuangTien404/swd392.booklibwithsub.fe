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

export async function fetchSubscriptionStatus() {
  const response = await axios.get(`${appsettings.apiBaseUrl}/subscriptions/status`, { headers: authHeaders() });
  return response.data;
}

export async function purchaseSubscription(planId) {
  const response = await axios.post(
    `${appsettings.apiBaseUrl}/subscriptions/purchase`,
    { planId },
    { headers: authHeaders() }
  );
  return response.data;
}