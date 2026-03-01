// Authentication Service - API calls for user authentication
import api, { setAuthToken, getAuthToken, ApiError } from './api';

const ENDPOINT = '/auth';
const USER_STORAGE_KEY = 'osintx_user';

// Helper functions for localStorage
const getStoredUser = () => {
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

const saveUser = (user) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

const clearUser = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem('osintx_token');
};

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post(`${ENDPOINT}/login`, { email, password });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    if (response.user) {
      saveUser(response.user);
    }
    
    return response;
  },

  // Register
  register: async (userData) => {
    const response = await api.post(`${ENDPOINT}/register`, userData);
    
    if (response.token) {
      setAuthToken(response.token);
    }
    if (response.user) {
      saveUser(response.user);
    }
    
    return response;
  },

  // Logout
  logout: async () => {
    try {
      await api.post(`${ENDPOINT}/logout`);
    } finally {
      clearUser();
    }
    
    return { success: true };
  },

  // Get current user
  getCurrentUser: async () => {
    return api.get(`${ENDPOINT}/me`);
  },

  // Update user profile
  updateProfile: async (updates) => {
    const response = await api.put(`${ENDPOINT}/profile`, updates);
    if (response.user) {
      saveUser(response.user);
    }
    return response;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    return api.post(`${ENDPOINT}/change-password`, {
      currentPassword,
      newPassword
    });
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    return api.post(`${ENDPOINT}/forgot-password`, { email });
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    return api.post(`${ENDPOINT}/reset-password`, { token, newPassword });
  },

  // Verify email
  verifyEmail: async (token) => {
    return api.post(`${ENDPOINT}/verify-email`, { token });
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!getAuthToken() && !!getStoredUser();
  },

  // Get stored user (synchronous)
  getUser: () => {
    return getStoredUser();
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post(`${ENDPOINT}/refresh-token`);
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  }
};

export default authService;
