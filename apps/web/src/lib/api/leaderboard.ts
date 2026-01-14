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

export interface LeaderboardUser {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  totalValidations: number;
  validatedGrade?: string; // Couleur validée (3+ voies)
  flashRate: number;
}

export interface LeaderboardResponse {
  users: LeaderboardUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasMore: boolean;
  };
}

export interface LeaderboardFilters {
  tab?: 'global' | 'friends';
  page?: number;
  limit?: number;
}

export interface ValidationDetail {
  routeId: string;
  routeName: string;
  difficulty: string;
  sector: string;
  attempts: number;
  isFlashed: boolean;
  validatedAt: string;
  basePoints: number;
  routeDifficultyFactor: number;
  attemptsMultiplier: number;
  totalPoints: number;
}

export interface UserValidationDetails {
  totalPoints: number;
  validations: ValidationDetail[];
}

export const leaderboardAPI = {
  /**
   * Get leaderboard with optional filters
   */
  getLeaderboard: async (filters?: LeaderboardFilters) => {
    const params = {
      tab: filters?.tab || 'global',
      page: filters?.page || 1,
      limit: filters?.limit || 50,
    };

    const response = await api.get<{ data: LeaderboardResponse }>(
      '/api/leaderboard',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get current user's rank in the leaderboard
   */
  getCurrentUserRank: async () => {
    const response = await api.get<{ data: LeaderboardUser }>(
      '/api/leaderboard/current-user'
    );
    return response.data.data;
  },

  /**
   * Get user validation details with points calculation
   */
  getUserValidationDetails: async (userId: string) => {
    const response = await api.get<{ data: UserValidationDetails }>(
      `/api/leaderboard/user/${userId}/details`
    );
    return response.data.data;
  },
};
