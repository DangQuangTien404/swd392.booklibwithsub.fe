import React, { createContext, useState, useEffect } from 'react';
import { fetchSubscriptionStatus } from '../api/subscriptions';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [basket, setBasket] = useState([]); 

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      const loadSubscriptionStatus = async () => {
        try {
          const status = await fetchSubscriptionStatus();
          setSubscriptionStatus(status);
        } catch (error) {
          console.error('Failed to fetch subscription status:', error);
        }
      };
      loadSubscriptionStatus();
    } else {
      localStorage.removeItem('user');
      setSubscriptionStatus(null);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, subscriptionStatus, setSubscriptionStatus, basket, setBasket }}>
      {children}
    </UserContext.Provider>
  );
};
