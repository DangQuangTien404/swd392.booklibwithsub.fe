import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import appsettings from '../appsettings';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const refetchUser = async () => {
    try {
      const token = user?.token;
      if (!token) return;
      const response = await axios.get(`${appsettings.apiBaseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...user, ...response.data });
    } catch (error) {
      console.error('Error refetching user:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, refetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
