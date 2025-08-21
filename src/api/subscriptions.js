// src/api/subscriptions.js
// API functions for fetching subscription status

import axios from 'axios';
import appsettings from '../appsettings';
import { UserContext } from '../context/UserContext';

export async function fetchSubscriptionStatus() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    const response = await axios.get(`${appsettings.apiBaseUrl}/Subscriptions/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    throw error;
  }
}

export async function purchaseSubscription(planId) {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    const response = await axios.post(
      `${appsettings.apiBaseUrl}/subscriptions/purchase`,
      { planId: planId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error purchasing subscription:', error);
    throw error;
  }
}