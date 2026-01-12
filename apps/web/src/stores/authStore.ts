import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, User, RegisterData, LoginData } from '../lib/api/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

// Flag to prevent concurrent checkAuth calls
let isCheckingAuth = false;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authAPI.register(data);

          localStorage.setItem('accessToken', response.tokens.accessToken);
          localStorage.setItem('refreshToken', response.tokens.refreshToken);

          set({
            user: response.user,
            accessToken: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      login: async (data: LoginData) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authAPI.login(data);

          localStorage.setItem('accessToken', response.tokens.accessToken);
          localStorage.setItem('refreshToken', response.tokens.refreshToken);

          set({
            user: response.user,
            accessToken: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      checkAuth: async () => {
        // Prevent concurrent checkAuth calls
        if (isCheckingAuth) {
          return;
        }

        const token = localStorage.getItem('accessToken');

        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        // Check if already authenticated
        const currentState = get();
        if (currentState.isAuthenticated && currentState.user) {
          return;
        }

        try {
          isCheckingAuth = true;
          set({ isLoading: true });
          const user = await authAPI.getCurrentUser();

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('checkAuth failed:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } finally {
          isCheckingAuth = false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
