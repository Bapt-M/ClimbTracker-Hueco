import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { authService } from '../services/auth.service';
import { successResponse } from '../utils/response';

export class AuthController {
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      const result = await authService.register(email, password, name);

      return successResponse(res, result, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      return successResponse(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      const tokens = await authService.refreshToken(refreshToken);

      return successResponse(res, { tokens }, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const user = await authService.getCurrentUser(req.user.id);

      return successResponse(res, { user }, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // In a real app, you might want to blacklist the token
      // For now, we just return a success message
      return successResponse(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
