// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const email = localStorage.getItem('email');
    if (token) setAdmin({ accessToken: token, email });
  }, []);

  const login = (adminData) => {
    if (adminData?.accessToken) localStorage.setItem('accessToken', adminData.accessToken);
    if (adminData?.refreshToken) localStorage.setItem('refreshToken', adminData.refreshToken);
    if (adminData?.email) localStorage.setItem('email', adminData.email);
    setAdmin({ ...adminData });
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // call backend to invalidate session
        await adminApi.logout();
      }
    } catch (err) {
      // ignore network errors but log for debugging
      console.error('Logout request failed', err?.response || err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('email');
      // keep any adminName if separate, but clear for safety
      localStorage.removeItem('adminName');
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated: !!admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => useContext(AuthContext);
