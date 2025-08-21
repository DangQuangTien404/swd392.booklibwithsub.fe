
import axios from 'axios';
import appsettings from '../appsettings';

export async function fetchSubscriptionPlans() {
  try {
    const response = await axios.get(`${appsettings.apiBaseUrl}/SubscriptionPlans`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    throw error;
  }
}
