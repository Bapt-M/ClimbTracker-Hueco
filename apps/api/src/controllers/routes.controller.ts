import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { routesService } from '../services/routes.service';
import { successResponse } from '../utils/response';
import { RouteStatus } from '../database/entities/Route';

export class RoutesController {
  async getRoutes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { difficulty, holdColorCategory, sector, status, search, page, limit, sortField, sortOrder, openedAtFrom, openedAtTo } = req.query;

      const filters = {
        difficulty: difficulty as string | string[] | undefined,
        holdColorCategory: holdColorCategory as string | string[] | undefined,
        sector: sector as string | string[] | undefined,
        status: status as RouteStatus | RouteStatus[] | undefined,
        search: search as string | undefined,
        openedAtFrom: openedAtFrom as string | undefined,
        openedAtTo: openedAtTo as string | undefined,
      };

      const sort = {
        field: sortField as 'createdAt' | 'openedAt' | 'name' | 'difficulty' | undefined,
        order: sortOrder as 'ASC' | 'DESC' | undefined,
      };

      const pageNum = page ? parseInt(page as string) : 1;
      const limitNum = limit ? parseInt(limit as string) : 12;

      const result = await routesService.getRoutes(filters, sort, pageNum, limitNum);

      return successResponse(res, result, 'Routes retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getRouteById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const route = await routesService.getRouteById(id);

      return successResponse(res, { route }, 'Route retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async createRoute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const routeData = {
        ...req.body,
        openerId: req.user.id,
      };

      const route = await routesService.createRoute(routeData);

      return successResponse(res, { route }, 'Route created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateRoute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const { id } = req.params;
      const route = await routesService.updateRoute(id, req.user.id, req.user.role, req.body);

      return successResponse(res, { route }, 'Route updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteRoute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const { id } = req.params;
      await routesService.deleteRoute(id, req.user.role);

      return successResponse(res, null, 'Route deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateRouteStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const { id } = req.params;
      const { status } = req.body;

      const route = await routesService.updateRouteStatus(id, status, req.user.role);

      return successResponse(res, { route }, 'Route status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getRoutesStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await routesService.getRoutesStats();

      return successResponse(res, { stats }, 'Statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const routesController = new RoutesController();
