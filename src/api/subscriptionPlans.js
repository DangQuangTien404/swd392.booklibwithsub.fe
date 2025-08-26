
import http from './http';

export async function fetchSubscriptionPlans() {
  const res = await http.get('/subscriptionplans');
  return res.data;
}
