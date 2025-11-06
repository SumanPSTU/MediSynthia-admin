// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from '../AdminPages/LoginPage.jsx';
import RegisterPage from '../AdminPages/RegisterPage.jsx';
import OtpVerificationPage from '../AdminPages/OtpVerificationPage.jsx';
import ForgetPasswordPage from '../AdminPages/ForgetPasswordPage.jsx';
import ChangePasswordPage from '../AdminPages/ChangePasswordPage.jsx';
import DashboardPage from '../AdminPages/DashboardPage.jsx';
import UserListPage from '../AdminPages/UserListPage.jsx';
import ErrorBoundary from '../AdminPages/ErrorBoundary.jsx';
import ProductsListPage from '../AdminPages/ProductsPage.jsx';
import OrderListPage from '../AdminPages/OrderListPage.jsx';
// Context
import { useAuth } from '../hooks/useAuth.js';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => (
  <ErrorBoundary>

    <Routes>

      {/* <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        /> */}

      {/* Public Routes */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OtpVerificationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forget-password" element={<ForgetPasswordPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />

      {/* Protected Routes */}
      {/* <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/users-list" element={<PrivateRoute><UserListPage /></PrivateRoute>} />
      <Route path="/products-list" element={<PrivateRoute><ProductsListPage /></PrivateRoute>} />
      <Route path="/orders-list" element={<PrivateRoute><OrderListPage /></PrivateRoute>} /> */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/users-list" element={<UserListPage />} />
      <Route path="/products-list" element={<ProductsListPage />} />
      <Route path="/orders-list" element={<OrderListPage />} />

    </Routes>

  </ErrorBoundary>
);

export default AppRoutes;
