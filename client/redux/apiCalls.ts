import axios from "axios";
import { User, Address, CheckoutData, Order } from "./types";
import Cookies from "js-cookie";

// Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Types
interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
}

interface AddressData {
  type: 'home' | 'office' | 'other';
  fullName: string;
  phone: string;
  street: string;
  locality: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// API Configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API Calls (Public)
export const login = async (credentials: { email: string; password: string }) => {
  const res = await api.post<LoginResponse>('/api/users/login', credentials);
  if (res.data.token) {
    Cookies.set('token', res.data.token, { expires: 7 });
  }
  return res.data;
};

export const register = async (data: RegisterData) => {
  const res = await api.post<{ message: string }>('/api/users/register', data);
  return res.data;
};

export const logout = () => {
  Cookies.remove('token');
  window.location.href = '/login';
};

// Profile API Calls (Protected)
export const getProfile = async () => {
  const res = await api.get<User>('/api/users/profile');
  return res.data;
};

export const updateProfile = async (data: { name?: string; phone?: string; dateOfBirth?: string }) => {
  const res = await api.put<User>('/api/users/profile', data);
  return res.data;
};

export const updatePassword = async (data: { currentPassword: string; newPassword: string }) => {
  const res = await api.put<{ message: string }>('/api/users/profile/password', data);
  return res.data;
};

// Wallet API Calls (Protected)
export const getWalletBalance = async () => {
  const res = await api.get<{ balance: number }>('/api/users/wallet');
  return res.data;
};

export const addWalletMoney = async (amount: number) => {
  const res = await api.post<{ balance: number }>('/api/users/wallet/add', { amount });
  return res.data;
};

export const getWalletTransactions = async (page: number = 1, limit: number = 10) => {
  const res = await api.get<{
    transactions: Array<{
      _id: string;
      type: 'credit' | 'debit';
      amount: number;
      description: string;
      createdAt: Date;
    }>;
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  }>(`/api/users/wallet/transactions?page=${page}&limit=${limit}`);
  return res.data;
};

// Points API Calls (Protected)
export const getPointsBalance = async () => {
  const res = await api.get<{ points: number }>('/api/users/points');
  return res.data;
};

export const redeemPoints = async (data: { points: number; rewardId: string }) => {
  const res = await api.post<{ points: number }>('/api/users/points/redeem', data);
  return res.data;
};

export const getPointsTransactions = async (page: number = 1, limit: number = 10) => {
  const res = await api.get<{
    transactions: Array<{
      _id: string;
      type: 'earned' | 'redeemed';
      points: number;
      description: string;
      createdAt: Date;
    }>;
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  }>(`/api/users/points/transactions?page=${page}&limit=${limit}`);
  return res.data;
};

// Address API Calls (Protected)
export const getAddresses = async () => {
  const res = await api.get<Address[]>('/api/users/addresses');
  return res.data;
};

export const addAddress = async (data: AddressData) => {
  const res = await api.post<Address[]>('/api/users/addresses', data);
  return res.data;
};

export const updateAddress = async (addressId: string, data: AddressData) => {
  const res = await api.put<Address[]>(`/api/users/addresses/${addressId}`, data);
  return res.data;
};

export const deleteAddress = async (addressId: string) => {
  await api.delete(`/api/users/addresses/${addressId}`);
};

export const setDefaultAddress = async (addressId: string) => {
  const res = await api.put<Address[]>(`/api/users/addresses/${addressId}/default`);
  return res.data;
};

// Product API Calls (Public)
export const getProducts = async () => {
  const res = await api.get('/api/products');
  return res.data;
};

export const getProduct = async (id: string) => {
  const res = await api.get(`/api/products/${id}`);
  return res.data;
};

// Cart API Calls (Protected)
export const getCart = async () => {
  const res = await api.get('/api/users/cart');
  return res.data;
};

export const addToCart = async (data: { productId: string; size: string; color: string; quantity: number }) => {
  const res = await api.post('/api/users/cart', data);
  return res.data;
};

export const updateCartItem = async (productId: string, data: { quantity: number }) => {
  const res = await api.put(`/api/users/cart/${productId}`, data);
  return res.data;
};

export const removeFromCart = async (productId: string) => {
  await api.delete(`/api/users/cart/${productId}`);
};

export const clearCart = async () => {
  const res = await api.delete('/api/users/cart');
  return res.data;
};

// Checkout & Order API Calls (Protected)
export const createOrder = async (checkoutData: CheckoutData) => {
  const res = await api.post<Order>('/api/orders', checkoutData);
  return res.data;
};

export const getOrders = async (page: number = 1, limit: number = 10) => {
  const res = await api.get<{
    orders: Order[];
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  }>(`/api/orders?page=${page}&limit=${limit}`);
  return res.data;
};

export const getOrder = async (orderId: string) => {
  const res = await api.get<Order>(`/api/orders/${orderId}`);
  return res.data;
};

export const cancelOrder = async (orderId: string, reason?: string) => {
  const res = await api.put<Order>(`/api/orders/${orderId}/cancel`, { reason });
  return res.data;
};

export const trackOrder = async (orderId: string) => {
  const res = await api.get<{
    order: Order;
    tracking: Array<{
      status: string;
      description: string;
      timestamp: Date;
      location?: string;
    }>;
  }>(`/api/orders/${orderId}/track`);
  return res.data;
};

export const requestReturn = async (orderId: string, data: { 
  items: Array<{ productId: string; quantity: number; reason: string }>;
  reason: string;
}) => {
  const res = await api.post<{ message: string }>(`/api/orders/${orderId}/return`, data);
  return res.data;
};

// Payment API Calls (Protected)
export const processPayment = async (data: {
  orderId: string;
  paymentMethod: 'card' | 'wallet';
  cardToken?: string;
}) => {
  const res = await api.post<{
    success: boolean;
    paymentId: string;
    order: Order;
  }>('/api/payments/create-intent', data);
  return res.data;
};

export const verifyPayment = async (paymentId: string) => {
  const res = await api.get<{
    verified: boolean;
    order: Order;
  }>(`/api/payments/verify/${paymentId}`);
  return res.data;
};

// Wishlist API Calls (Protected)
export const getWishlist = async () => {
  const res = await api.get('/api/users/wishlist');
  return res.data;
};

export const addToWishlist = async (productId: string) => {
  const res = await api.post('/api/users/wishlist', { productId });
  return res.data;
};

export const removeFromWishlist = async (productId: string) => {
  const res = await api.delete(`/api/users/wishlist/${productId}`);
  return res.data;
};

// Utility Functions
export const getToken = () => Cookies.get("token");
