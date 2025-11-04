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

// Attach access token if available
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
  verifyEmail: (token) =>
    apiClient.post('/admin/verify', {}, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  login: (data) => apiClient.post('/admin/login', data),
  verifyOtp: (email, data) => apiClient.post(`/admin/verify/${email}`, data),
  logout: () => apiClient.post('/admin/logout'),

  // Password Reset
  forgetPassword: (data) => apiClient.post('/admin/forget', data),
  verifyForgetOtp: (email, data) => apiClient.post(`/admin/verifyotp/${email}`, data),
  changePassword: (email, data) => apiClient.post(`/admin/changepass/${email}`, data),

  // Users
  getUsers: (page = 1, limit = 10) =>
    apiClient.get(`/admin/alluser?page=${page}&limit=${limit}`), // fixed: use apiClient
  searchUsers: (search) =>
    apiClient.get(`/admin/search-user?search=${encodeURIComponent(search)}`), // fixed

  // Prescriptions (optional)
  getAllPrescriptions: () => apiClient.get('/admin/get-all-prescription'),
  deletePrescription: (id) => apiClient.delete(`/admin/delete-prescription/${id}`),
  deleteOldPrescriptions: (date) =>
    apiClient.delete('/admin/delete-prescriptions-before-date', { data: { date } }),
};
