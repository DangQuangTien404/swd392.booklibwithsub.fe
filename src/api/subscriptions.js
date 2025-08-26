
import http from './http';

export async function fetchSubscriptionStatus() {
  const res = await http.get('/subscriptions/status');
  return res.data;
}

export async function purchaseSubscription(planId) {
  const res = await http.post('/subscriptions/purchase', { planId });
  return res.data;
}
