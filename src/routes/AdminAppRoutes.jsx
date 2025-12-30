// src/routes/AppRoutes.jsx

import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from '../AdminPages/LoginPage.jsx';
import ForgetPasswordPage from '../AdminPages/ForgetPasswordPage.jsx';
import ChangePasswordPage from '../AdminPages/ChangePasswordPage.jsx';
import DashboardPage from '../AdminPages/DashboardPage.jsx';
import UserListPage from '../AdminPages/UserListPage.jsx';
import ErrorBoundary from '../AdminPages/ErrorBoundary.jsx';
import ProductsListPage from '../AdminPages/ProductsPage.jsx';
import OrderListPage from '../AdminPages/OrderListPage.jsx';
import RegisterAdminInfo from '../AdminPages/RegisterAdminInfo.jsx';
import OrderDetailsPage from '../AdminPages/OrderDetailsPage.jsx';
import NotFoundPage from '../AdminPages/NotFoundPage.jsx';
// Context
import { useAuth } from '../hooks/useAuth.js';
import VerifyAdmin from '../AdminPages/VerifyAdmin.jsx';
import VerifyLoginOTP from '../AdminPages/VerifyLoginOTP.jsx';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('accessToken');
  if (!isAuthenticated || !token) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('accessToken');
  const isAuth = isAuthenticated && token;

  return (
    <ErrorBoundary>
      <Routes>
        {/* Root: redirect based on auth */}
        <Route
          path="/"
          element={
            isAuth ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public Routes */}

        <Route path="/login" element={isAuth ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/verify/:token" element={<VerifyAdmin />} />
        <Route path="/verifyotp" element={<VerifyLoginOTP />} />
        <Route path="/registeradmininfo" element={isAuth ? <Navigate to="/dashboard" replace /> : <RegisterAdminInfo />} />
        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/users-list" element={<PrivateRoute><UserListPage /></PrivateRoute>} />
        <Route path="/products-list" element={<PrivateRoute><ProductsListPage /></PrivateRoute>} />
        {/* <Route path="/product/:id" element={<PrivateRoute><ProductDetails /></PrivateRoute>} /> */}
        <Route path="/orders-list" element={<PrivateRoute><OrderListPage /></PrivateRoute>} />
          <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </ErrorBoundary>
  );
};

export default AppRoutes;
