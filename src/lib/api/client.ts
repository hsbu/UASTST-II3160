import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenManager } from '@/lib/auth';

// API Base URLs from environment variables
const CATALOGING_BASE_URL = process.env.NEXT_PUBLIC_CATALOGING_API_URL || 'http://localhost:3000';
const CIRCULATION_BASE_URL = process.env.NEXT_PUBLIC_CIRCULATION_API_URL || 'http://localhost:3002';

/**
 * Create an axios instance for the Cataloging Service (books)
 */
export const catalogingApi = axios.create({
  baseURL: CATALOGING_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Create an axios instance for the Circulation Service (loans, fines)
 */
export const circulationApi = axios.create({
  baseURL: CIRCULATION_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Request interceptor to attach JWT token to all requests
 */
const attachTokenInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = tokenManager.getToken();
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
};

/**
 * Response interceptor for successful responses
 */
const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

/**
 * Error interceptor to handle common error scenarios
 */
const errorInterceptor = (error: AxiosError): Promise<never> => {
  if (error.response) {
    const { status } = error.response;

    // Handle 401 Unauthorized - token expired or invalid
    if (status === 401) {
      tokenManager.removeToken();
      
      // Only redirect if we're in the browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden - insufficient permissions
    if (status === 403) {
      console.error('Access denied: insufficient permissions');
    }
  }

  return Promise.reject(error);
};

// Apply interceptors to cataloging API
catalogingApi.interceptors.request.use(attachTokenInterceptor, (error) => Promise.reject(error));
catalogingApi.interceptors.response.use(responseInterceptor, errorInterceptor);

// Apply interceptors to circulation API
circulationApi.interceptors.request.use(attachTokenInterceptor, (error) => Promise.reject(error));
circulationApi.interceptors.response.use(responseInterceptor, errorInterceptor);

/**
 * Helper to extract error message from API error response
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    return (
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      'An unexpected error occurred'
    );
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}
