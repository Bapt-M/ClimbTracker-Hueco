import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Configure axios with auth token
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Validation {
  id: string;
  userId: string;
  routeId: string;
  validatedAt: string;
  personalNote?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  route?: {
    id: string;
    name: string;
    grade: string;
    color: string;
  };
}

export interface ValidationCreateInput {
  personalNote?: string;
}

export const validationsAPI = {
  /**
   * Create a validation
   */
  async createValidation(routeId: string, data: ValidationCreateInput = {}): Promise<Validation> {
    const response = await api.post(`/api/routes/${routeId}/validate`, data);
    return response.data;
  },

  /**
   * Delete a validation
   */
  async deleteValidation(routeId: string): Promise<void> {
    await api.delete(`/api/routes/${routeId}/validate`);
  },

  /**
   * Get all validations for a route
   */
  async getRouteValidations(routeId: string): Promise<Validation[]> {
    const response = await api.get(`/api/routes/${routeId}/validations`);
    return response.data;
  },

  /**
   * Get all validations for a user
   */
  async getUserValidations(userId: string): Promise<Validation[]> {
    const response = await api.get(`/api/users/${userId}/validations`);
    return response.data;
  },

  /**
   * Get all validations for the current authenticated user
   */
  async getCurrentUserValidations(): Promise<Validation[]> {
    const response = await api.get(`/api/validations/user`);
    return response.data;
  },

  /**
   * Check if current user has validated a route
   */
  async checkUserValidation(routeId: string): Promise<{ hasValidated: boolean }> {
    const response = await api.get(`/api/routes/${routeId}/validate/check`);
    return response.data;
  },
};
