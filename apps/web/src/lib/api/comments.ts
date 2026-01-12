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

export type MediaType = 'IMAGE' | 'VIDEO';

export interface Comment {
  id: string;
  content: string;
  userId: string;
  routeId: string;
  createdAt: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface CommentCreateInput {
  content: string;
  mediaUrl?: string;
  mediaType?: MediaType;
}

export interface CommentUpdateInput {
  content?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
}

export interface PaginatedComments {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const commentsAPI = {
  /**
   * Create a comment on a route
   */
  async createComment(routeId: string, data: CommentCreateInput): Promise<Comment> {
    const response = await api.post(`/api/routes/${routeId}/comments`, data);
    return response.data;
  },

  /**
   * Update a comment
   */
  async updateComment(commentId: string, data: CommentUpdateInput): Promise<Comment> {
    const response = await api.put(`/api/comments/${commentId}`, data);
    return response.data;
  },

  /**
   * Delete a comment
   */
  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/api/comments/${commentId}`);
  },

  /**
   * Get all comments for a route with pagination
   */
  async getRouteComments(
    routeId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedComments> {
    const response = await api.get(`/api/routes/${routeId}/comments`, {
      params: { page, limit },
    });
    return response.data;
  },
};
