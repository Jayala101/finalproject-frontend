import axios from 'axios';
import { API_CONFIG } from '../config/api';

// API Configuration
const API_BASE_URL = API_CONFIG.BASE_URL;

// Log API configuration in development mode
if (API_CONFIG.IS_DEV || API_CONFIG.DEBUG) {
  console.info('🌐 API Configuration:');
  console.info(`📡 API URL: ${API_BASE_URL}`);
  console.info(`🔄 Environment: ${API_CONFIG.IS_PROD ? 'Production' : 'Development'}`);
  console.info(`🧪 Mock Data: ${API_CONFIG.ENABLE_MOCK_DATA ? 'Enabled' : 'Disabled'}`);
  console.info(`📊 Analytics: ${API_CONFIG.ENABLE_ANALYTICS ? 'Enabled' : 'Disabled'}`);
  console.info(`🐛 Debug Mode: ${API_CONFIG.DEBUG ? 'Enabled' : 'Disabled'}`);
}

class ApiService {
  private api: any;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth token
    this.api.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic HTTP methods
  async get(url: string, params?: any): Promise<any> {
    return this.api.get(url, { params });
  }

  async post(url: string, data?: any): Promise<any> {
    return this.api.post(url, data);
  }

  async put(url: string, data?: any): Promise<any> {
    return this.api.put(url, data);
  }

  async patch(url: string, data?: any): Promise<any> {
    return this.api.patch(url, data);
  }

  async delete(url: string): Promise<any> {
    return this.api.delete(url);
  }

  // File upload
  async uploadFile(url: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const apiService = new ApiService();
export default apiService;
