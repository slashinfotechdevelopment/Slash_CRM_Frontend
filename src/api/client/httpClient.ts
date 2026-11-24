import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/config/env';
import { STORAGE_KEYS } from '@/config/constants';
import { normalizeError } from './errorMapper';

// Single HTTP client for all API interactions
export const httpClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

function purgeAuthAndRedirect() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

// Request interceptor: injects bearer token
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(normalizeError(error))
);

// Response interceptor: synchronized token refresh & error normalization
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If no response or not 401, normalize and reject
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(normalizeError(error));
    }

    // Do not attempt refresh on auth endpoints (login, verify, refresh)
    const requestUrl = originalRequest.url || '';
    if (
      requestUrl.includes('/api/auth/send-otp') ||
      requestUrl.includes('/api/auth/verify-otp') ||
      requestUrl.includes('/api/auth/refresh') ||
      requestUrl.includes('/api/auth/bootstrap')
    ) {
      return Promise.reject(normalizeError(error));
    }

    if (originalRequest._retry) {
      return Promise.reject(normalizeError(error));
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return httpClient(originalRequest);
        })
        .catch((err) => Promise.reject(normalizeError(err)));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      isRefreshing = false;
      purgeAuthAndRedirect();
      return Promise.reject(normalizeError(error));
    }

    try {
      // Use raw axios call directly to refresh endpoint to avoid recursive interceptor loops
      const response = await axios.post(`${ENV.API_BASE_URL}/api/auth/refresh`, {
        refreshToken,
      });

      const data = response.data?.data || response.data;
      const newAccessToken = data.accessToken || data.token;
      const newRefreshToken = data.refreshToken;

      if (!newAccessToken) {
        throw new Error('Refresh response missing access token');
      }

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
      }

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      processQueue(null, newAccessToken);
      return httpClient(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      purgeAuthAndRedirect();
      return Promise.reject(normalizeError(refreshErr));
    } finally {
      isRefreshing = false;
    }
  }
);
