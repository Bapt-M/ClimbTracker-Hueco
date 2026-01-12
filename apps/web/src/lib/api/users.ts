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

export interface UserPublicProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface UserUpdateInput {
  name?: string;
  bio?: string;
  avatar?: string;
}

export interface UserStats {
  totalValidations: number;
  totalComments: number;
  totalRoutesCreated: number;
  totalPoints: number;
  validationsByGrade: { grade: string; count: number; points: number }[];
  validationsByDifficulty: { difficulty: string; gradeLabel: string; count: number }[];
  recentValidations: {
    id: string;
    validatedAt: string;
    route: {
      id: string;
      name: string;
      grade?: string;
      difficulty?: string;
      gradeLabel?: string;
      color?: string;
      holdColorHex?: string;
    };
  }[];
  recentComments: {
    id: string;
    content: string;
    createdAt: string;
    route: {
      id: string;
      name: string;
    };
  }[];
}

export const usersAPI = {
  /**
   * Get user profile by ID
   */
  async getUserById(userId: string): Promise<UserPublicProfile> {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateUser(userId: string, data: UserUpdateInput): Promise<UserPublicProfile> {
    const response = await api.put(`/api/users/${userId}`, data);
    return response.data;
  },

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<UserStats> {
    const response = await api.get(`/api/users/${userId}/stats`);
    return response.data;
  },

  /**
   * Get all users (admin only)
   */
  async getAllUsers(page: number = 1, limit: number = 50): Promise<{ users: UserPublicProfile[]; total: number }> {
    const response = await api.get('/api/users', {
      params: { page, limit },
    });
    return response.data;
  },
};
