import axios from 'axios';
import Constants from 'expo-constants';

const BACKEND_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001';

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth APIs
export const authAPI = {
  login: (phone: string) => api.post('/auth/login', { phone }),
  verifyOTP: (phone: string, otp: string) => api.post('/auth/verify-otp', { phone, otp }),
  getMe: (customer_id: string) => api.get(`/auth/me?customer_id=${customer_id}`),
};

// Category APIs
export const categoryAPI = {
  getAll: (type?: string) => api.get('/categories', { params: { type } }),
  getServices: (category_id: string) => api.get(`/categories/${category_id}/services`),
};

// Service APIs
export const serviceAPI = {
  getById: (service_id: string) => api.get(`/services/${service_id}`),
};

// Cart APIs
export const cartAPI = {
  add: (customer_id: string, service_id: string, title: string, price: number) => 
    api.post('/cart/add', { customer_id, service_id, title, price }),
  get: (customer_id: string) => api.get(`/cart/${customer_id}`),
  remove: (customer_id: string, service_id: string) => 
    api.post('/cart/remove', { customer_id, service_id }),
  updateQuantity: (customer_id: string, service_id: string, quantity: number) => 
    api.post('/cart/update-quantity', null, { params: { customer_id, service_id, quantity } }),
  clear: (customer_id: string) => api.delete(`/cart/${customer_id}`),
};

// Booking APIs
export const bookingAPI = {
  create: (data: any) => api.post('/booking', data),
  getById: (booking_id: string) => api.get(`/booking/${booking_id}`),
  getCustomerBookings: (customer_id: string) => api.get(`/bookings/customer/${customer_id}`),
};

// User APIs
export const userAPI = {
  updateProfile: (customer_id: string, name?: string, preferred_language?: string) => 
    api.put('/user/profile', null, { params: { customer_id, name, preferred_language } }),
};
