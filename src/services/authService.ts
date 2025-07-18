import apiService from './api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types';
import { jwtDecode } from 'jwt-decode';

// Helper to parse JWT token
const parseJwt = (token: string) => {
  try {
    return jwtDecode<{
      id: string;
      username: string;
      role?: string;
      exp: number;
    }>(token);
  } catch (e) {
    console.error('Invalid token:', e);
    return null;
  }
};

// Verify if token is expired
const isTokenExpired = (token: string): boolean => {
  const decodedToken = parseJwt(token);
  if (!decodedToken) return true;
  
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

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
  
  // Login with predefined admin token
  adminLogin(): AuthResponse | null {
    const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNjODhjZGViLTEyZDktNDQyNC1hMTNkLWE1OTQ4NDc4NTMxOSIsInVzZXJuYW1lIjoiam9obl9kb2UiLCJpYXQiOjE3NTI3ODM1NTQsImV4cCI6MTc1Mjc4NzE1NH0.OX6LWXg4ePFakiYa3fQVuH0xwQwO4jN7vGiZ3GDa6gM';
    
    if (isTokenExpired(ADMIN_TOKEN)) {
      console.error('Admin token is expired');
      return null;
    }
    
    const decodedToken = parseJwt(ADMIN_TOKEN);
    if (!decodedToken) return null;
    
    const adminUser: User = {
      id: decodedToken.id,
      username: decodedToken.username,
      email: 'admin@example.com', // Default email for admin
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('authToken', ADMIN_TOKEN);
    localStorage.setItem('user', JSON.stringify(adminUser));
    
    return { access_token: ADMIN_TOKEN, user: adminUser };
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
