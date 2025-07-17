import apiService from './api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types';

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post('/auth/login', credentials);
      const { access_token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { access_token, user };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Register user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiService.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    try {
      const response = await apiService.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiService.put('/auth/profile', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Get stored user data
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get stored auth token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export const authService = new AuthService();
export default authService;
