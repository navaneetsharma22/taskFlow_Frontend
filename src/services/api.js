import axios from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send httpOnly cookies for refresh tokens
});

/**
 * Request interceptor:
 * 1. Attach JWT from Redux store (not localStorage — avoids XSS exposure)
 * 2. Attach organizationId for tenant isolation on every request
 */
API.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    const organizationId = state.auth.organization?.id;
    const organizationCode = state.auth.organization?.code;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Tenant isolation: attach org context to every request
    if (organizationId) {
      config.headers['x-organization-id'] = organizationId;
    }
    if (organizationCode) {
      config.headers['x-organization-code'] = organizationCode;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor:
 * 1. On 401 (token expired), attempt silent refresh via /auth/refresh-token
 * 2. If refresh fails, dispatch logout and redirect cleanly via React Router
 * 3. On 403 (forbidden), log but don't force logout — it's a permissions issue
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 — token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until the refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token via httpOnly cookie
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data.token;
        // Update Redux store with new token (via action dispatch)
        // Note: In production, dispatch loginSuccess with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed — force logout
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 — forbidden (permissions issue, not auth issue)
    if (error.response?.status === 403) {
      console.warn('[API] Forbidden: Insufficient permissions for', originalRequest.url);
    }

    return Promise.reject(error);
  }
);

export default API;
