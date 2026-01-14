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

export enum FriendshipStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface FriendUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface FriendshipWithUser {
  id: string;
  status: FriendshipStatus;
  createdAt: string;
  acceptedAt?: string;
  user: FriendUser;
  isRequester: boolean; // true si l'utilisateur actuel a envoyé la demande
}

export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  friendshipStatus: FriendshipStatus | null;
  friendshipId?: string;
  isRequester?: boolean;
}

export interface FriendshipStatusResponse {
  status: FriendshipStatus | null;
  friendshipId?: string;
  isRequester?: boolean;
}

export const friendshipsAPI = {
  /**
   * Send a friend request
   */
  sendFriendRequest: async (addresseeId: string): Promise<void> => {
    await api.post('/api/friendships/request', { addresseeId });
  },

  /**
   * Accept a friend request
   */
  acceptFriendRequest: async (friendshipId: string): Promise<void> => {
    await api.post(`/api/friendships/${friendshipId}/accept`);
  },

  /**
   * Reject a friend request
   */
  rejectFriendRequest: async (friendshipId: string): Promise<void> => {
    await api.post(`/api/friendships/${friendshipId}/reject`);
  },

  /**
   * Remove a friend
   */
  removeFriend: async (friendshipId: string): Promise<void> => {
    await api.delete(`/api/friendships/${friendshipId}`);
  },

  /**
   * Get all friends (accepted friendships)
   */
  getFriends: async (): Promise<FriendshipWithUser[]> => {
    const response = await api.get<{ data: FriendshipWithUser[] }>('/api/friendships/friends');
    return response.data.data;
  },

  /**
   * Get pending friend requests (received)
   */
  getPendingRequests: async (): Promise<FriendshipWithUser[]> => {
    const response = await api.get<{ data: FriendshipWithUser[] }>('/api/friendships/pending');
    return response.data.data;
  },

  /**
   * Get sent friend requests (pending)
   */
  getSentRequests: async (): Promise<FriendshipWithUser[]> => {
    const response = await api.get<{ data: FriendshipWithUser[] }>('/api/friendships/sent');
    return response.data.data;
  },

  /**
   * Get friendship status with another user
   */
  getFriendshipStatus: async (userId: string): Promise<FriendshipStatusResponse> => {
    const response = await api.get<{ data: FriendshipStatusResponse }>(
      `/api/friendships/status/${userId}`
    );
    return response.data.data;
  },

  /**
   * Search users to add as friends
   */
  searchUsers: async (searchTerm: string): Promise<UserSearchResult[]> => {
    const response = await api.get<{ data: UserSearchResult[] }>('/api/friendships/search', {
      params: { q: searchTerm },
    });
    return response.data.data;
  },
};
