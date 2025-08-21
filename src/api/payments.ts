import axios from 'axios';
import appsettings from '../appsettings';

export async function checkout(subscriptionId: number, amount: number) {
  try {
    const response = await axios.post(`${appsettings.apiBaseUrl}/payments/checkout`, {
      subscriptionId,
      amount,
    });
    const data = response.data;
    return {
      txId: data.txId,
      payUrl: data.payUrl ?? data.order?.order_url,
    };
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error;
  }
}

export async function getTxStatus(txId: number) {
  try {
    const response = await axios.get(`${appsettings.apiBaseUrl}/payments/tx/${txId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    throw error;
  }
}
