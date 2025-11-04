// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) setAdmin({ token });
  }, []);

  const login = (adminData) => {
    localStorage.setItem('accessToken', adminData.accessToken);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated: !!admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => useContext(AuthContext);
