import axios from './axios';

export interface Route {
  id: string;
  name: string;
  difficulty: string;
  holdColorHex: string;
  holdColorCategory: string;
  sector: string;
  routeTypes?: string[];
  description?: string;
  tips?: string;
  openerId: string;
  opener: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  mainPhoto: string;
  openingVideo?: string;
  status: 'PENDING' | 'ACTIVE' | 'ARCHIVED';
  openedAt: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  validationsCount?: number;
  commentsCount?: number;
}

export interface RouteFilters {
  difficulty?: string | string[];
  holdColorCategory?: string | string[];
  sector?: string | string[];
  routeTypes?: string | string[];
  status?: string | string[];
  search?: string;
  page?: number;
  limit?: number;
  sortField?: 'createdAt' | 'openedAt' | 'name' | 'difficulty';
  sortOrder?: 'ASC' | 'DESC';
  openedAtFrom?: string;
  openedAtTo?: string;
}

export interface PaginatedRoutes {
  data: Route[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RouteCreateInput {
  name: string;
  difficulty: string;
  holdColorHex: string;
  holdColorCategory: string;
  sector: string;
  routeTypes?: string[];
  description?: string;
  tips?: string;
  mainPhoto: string;
  openingVideo?: string;
  openedAt?: string;
}

export interface RouteUpdateInput {
  name?: string;
  difficulty?: string;
  holdColorHex?: string;
  holdColorCategory?: string;
  sector?: string;
  routeTypes?: string[];
  description?: string;
  tips?: string;
  mainPhoto?: string;
  openingVideo?: string;
  openedAt?: string;
}

export const routesAPI = {
  getRoutes: async (filters: RouteFilters = {}) => {
    const response = await axios.get<{ data: PaginatedRoutes }>('/api/routes', {
      params: filters,
    });
    return response.data.data;
  },

  getRouteById: async (id: string) => {
    const response = await axios.get<{ data: { route: Route } }>(`/api/routes/${id}`);
    return response.data.data.route;
  },

  createRoute: async (data: RouteCreateInput) => {
    const response = await axios.post<{ data: { route: Route } }>('/api/routes', data);
    return response.data.data.route;
  },

  updateRoute: async (id: string, data: RouteUpdateInput) => {
    const response = await axios.put<{ data: { route: Route } }>(`/api/routes/${id}`, data);
    return response.data.data.route;
  },

  deleteRoute: async (id: string) => {
    await axios.delete(`/api/routes/${id}`);
  },

  updateRouteStatus: async (id: string, status: 'PENDING' | 'ACTIVE' | 'ARCHIVED') => {
    const response = await axios.put<{ data: { route: Route } }>(`/api/routes/${id}/status`, {
      status,
    });
    return response.data.data.route;
  },

  getRoutesStats: async () => {
    const response = await axios.get<{ data: { stats: any } }>('/api/routes/stats');
    return response.data.data.stats;
  },
};
