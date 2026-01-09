// src/api/adminApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token automatically from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin API calls
export const adminApi = {
  // Admin Auth
  register: (data) => apiClient.post('/admin/register', data),
  verifyEmail: () => apiClient.post('/admin/verify'), // token sent automatically by interceptor
  login: (data) => apiClient.post('/admin/login', data),
  verifyOtp: (email, data) => apiClient.post(`/admin/verify/${email}`, data),
  logout: () => apiClient.post('/admin/logout'),
  resendEmail: () => apiClient.post('/admin/resend-verification'),

  // Password Reset
  forgetPassword: (data) => apiClient.post('/admin/forget', data),
  verifyForgetOtp: (email, data) => apiClient.post(`/admin/verifyotp/${email}`, data),
  changePassword: (email, data) => apiClient.post(`/admin/changepass/${email}`, data),

  // Users
  getUsers: (page = 1, limit = 10) =>
    apiClient.get(`/admin/alluser?page=${page}&limit=${limit}`),
  searchUsers: (search) =>
    apiClient.get(`/admin/search-user?search=${encodeURIComponent(search)}`), // token auto via interceptor

  // Prescriptions (optional)
  getAllPrescriptions: () => apiClient.get('/admin/get-all-prescription'),
  deletePrescription: (id) => apiClient.delete(`/admin/delete-prescription/${id}`),
  deleteOldPrescriptions: (date) =>
    apiClient.delete('/admin/delete-prescriptions-before-date', { data: { date } }),
  // OTP / verification helpers
  resendOtp: (email) => apiClient.post(`/admin/resend-otp/${email}`),
  verifyWithToken: (token) => apiClient.post('/admin/verify', {}, { headers: { Authorization: `Bearer ${token}` } }),

  // Products
  getProducts: (page = 1, limit = 10) =>
    apiClient.get(`/product/getproduct?page=${page}&&limit=${limit}`),
  searchProducts: (search) =>
    apiClient.get(`product/search?search=${encodeURIComponent(search)}`),
  getProductById: (id) => apiClient.get(`/product/getproduct/${id}`),
  createProduct: (data) => {
    // If uploading an image (FormData), send multipart
    if (data instanceof FormData) {
      return apiClient.post('/product/addproduct', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    // fallback (no image)
    return apiClient.post('/product/addproduct', data);
  },

  updateProduct: (id, data) => {
    // support FormData (file upload) and JSON
    if (data instanceof FormData) {
      return apiClient.put(`/product/updateproduct/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return apiClient.put(`/product/updateproduct/${id}`, data);
  },
  // Toggle availability using the dedicated endpoint (server toggles value)
  toggleAvailability: (id) => apiClient.put(`/product/isavailable/${id}`),
  // Delete product (backend endpoint expects this path)
  deleteProduct: (id) => apiClient.delete(`product/deleteproduct/${id}`),
  // Categories / Subcategories
  getCategories: () => apiClient.get('/category'),
  getSubcategories: () => apiClient.get('/subcategory'),

  //order
  getOrders: (page = 1, limit = 10) =>
    apiClient.get(`/order/admin/orders?page=${page}&limit=${limit}`),
  // searchOrders: (search) =>
  //   apiClient.get(`order/search?search=${encodeURIComponent(search)}`),
  getOrderById: (id) => apiClient.get(`/order/getOrderById/${id}`),
  // createOrder: (data) => {
  //   if (data instanceof FormData) {
  //     return apiClient.post('/order/createOrder', data, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });
  //   },
};
