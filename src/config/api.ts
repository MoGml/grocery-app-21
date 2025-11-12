import axios from 'axios';
import { getDeviceId } from '../utils/deviceId';
import i18n from '../i18n/config';

// Get base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://a2b.runasp.net';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add required headers
apiClient.interceptors.request.use(
  (config) => {
    // Add X-Device-Id header (required for all requests)
    const deviceId = getDeviceId();
    config.headers['X-Device-Id'] = deviceId;

    // Add Accept-Language header based on current language (default: 'en')
    const currentLanguage = i18n.language || 'en';
    config.headers['Accept-Language'] = currentLanguage;

    // Add JWT token if user is registered (not guest)
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        // Add authorization token if user has a token (registered user)
        if (userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('user');
          window.location.href = '/';
          break;
        case 403:
          console.error('Forbidden - insufficient permissions');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error - no response received');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
