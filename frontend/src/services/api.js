import { fetchWithRetry, checkCircuitBreaker } from '../utils/apiClient';
import { trackAPICall } from '../utils/analytics';
import { enqueueRequest } from '../utils/requestQueue';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API error class
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Token management
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('osintx_token', token);
  } else {
    localStorage.removeItem('osintx_token');
  }
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('osintx_token');
  }
  return authToken;
};

// Base fetch wrapper with authentication
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Check circuit breaker
  if (checkCircuitBreaker(url)) {
    throw new ApiError('Service temporarily unavailable', 503);
  }
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  };

  const startTime = performance.now();
  
  try {
    const response = await fetchWithRetry(url, config);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const duration = performance.now() - startTime;
      trackAPICall(endpoint, options.method || 'GET', response.status, duration);
      
      // Handle rate limiting - auto-queue request
      if (response.status === 429) {
        console.warn('[API] Rate limited, queueing request:', endpoint);
        enqueueRequest({
          endpoint,
          method: options.method || 'GET',
          body: options.body ? JSON.parse(options.body) : undefined,
        });
      }
      
      throw new ApiError(
        data.message || data.error || 'An error occurred',
        response.status,
        data
      );
    }

    // Track successful call
    const duration = performance.now() - startTime;
    trackAPICall(endpoint, options.method || 'GET', response.status, duration);
    
    return data;
  } catch (error) {
    const duration = performance.now() - startTime;
    trackAPICall(endpoint, options.method || 'GET', error.status || 0, duration);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error.message || 'Network error occurred',
      0,
      null
    );
  }
};

// HTTP method helpers
export const api = {
  get: (endpoint, options = {}) => fetchWithAuth(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, data, options = {}) => fetchWithAuth(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  put: (endpoint, data, options = {}) => fetchWithAuth(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  patch: (endpoint, data, options = {}) => fetchWithAuth(endpoint, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  
  delete: (endpoint, options = {}) => fetchWithAuth(endpoint, { ...options, method: 'DELETE' })
};

export default api;
