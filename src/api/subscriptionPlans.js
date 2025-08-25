import axios from 'axios';
import appsettings from '../appsettings';

export async function fetchSubscriptionPlans() {
  const response = await axios.get(`${appsettings.apiBaseUrl}/subscriptionplans`);
  return response.data;
}