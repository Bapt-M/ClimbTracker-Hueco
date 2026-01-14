import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { leaderboardService } from '../services/leaderboard.service';
import { successResponse } from '../utils/response';
import { NotFoundError } from '../utils/errors';

export class LeaderboardController {
  /**
   * GET /api/leaderboard
   * Récupère le classement global des utilisateurs
   */
  async getLeaderboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tab = (req.query.tab as string) || 'global';
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const userId = req.user?.id; // Optionnel, utilisé pour le filtrage par amis

      const leaderboard = await leaderboardService.getLeaderboard(tab, page, limit, userId);

      return successResponse(res, leaderboard, 'Leaderboard retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/leaderboard/current-user
   * Récupère le rang de l'utilisateur connecté
   */
  async getCurrentUserRank(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const userRank = await leaderboardService.getCurrentUserRank(req.user.id);

      if (!userRank) {
        throw new NotFoundError(
          'User not ranked yet. Complete routes to enter the leaderboard!'
        );
      }

      return successResponse(res, userRank, 'User rank retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/leaderboard/user/:userId/details
   * Récupère les détails des validations d'un utilisateur avec calcul des points
   */
  async getUserValidationDetails(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const details = await leaderboardService.getUserValidationDetails(userId);

      return successResponse(res, details, 'User validation details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const leaderboardController = new LeaderboardController();
