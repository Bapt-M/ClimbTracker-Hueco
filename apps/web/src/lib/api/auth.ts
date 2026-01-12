import axios from './axios';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CLIMBER' | 'OPENER' | 'ADMIN';
  avatar: string | null;
  bio: string | null;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authAPI = {
  register: async (data: RegisterData) => {
    const response = await axios.post<{ data: AuthResponse }>('/api/auth/register', data);
    return response.data.data;
  },

  login: async (data: LoginData) => {
    const response = await axios.post<{ data: AuthResponse }>('/api/auth/login', data);
    return response.data.data;
  },

  getCurrentUser: async () => {
    const response = await axios.get<{ data: { user: User } }>('/api/auth/me');
    return response.data.data.user;
  },

  logout: async () => {
    await axios.post('/api/auth/logout');
  },
};
