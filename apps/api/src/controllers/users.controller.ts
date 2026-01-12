import { Request, Response } from 'express';
import usersService from '../services/users.service';

class UsersController {
  /**
   * GET /api/users/:userId
   * Get user profile
   */
  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await usersService.getUserById(userId);

      res.json(user);
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(404).json({ message: error.message });
      } else {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * PUT /api/users/:userId
   * Update user profile
   */
  async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const requestUserId = req.user!.id;
      const userRole = req.user!.role;
      const {
        name,
        firstName,
        lastName,
        age,
        height,
        wingspan,
        bio,
        avatar,
        profilePhoto,
        additionalPhotos,
      } = req.body;

      const user = await usersService.updateUser(userId, requestUserId, userRole, {
        name,
        firstName,
        lastName,
        age,
        height,
        wingspan,
        bio,
        avatar,
        profilePhoto,
        additionalPhotos,
      });

      res.json(user);
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(404).json({ message: error.message });
      } else if (error.message === 'Unauthorized') {
        res.status(403).json({ message: error.message });
      } else {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * GET /api/users/:userId/stats
   * Get user statistics
   */
  async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const stats = await usersService.getUserStats(userId);

      res.json(stats);
    } catch (error: any) {
      console.error('Get user stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /api/users
   * Get all users (admin only)
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const result = await usersService.getAllUsers(page, limit);

      res.json(result);
    } catch (error: any) {
      console.error('Get all users error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /api/users/:userId/kiviat-data
   * Get Kiviat chart data for user performance by route type
   */
  async getUserKiviatData(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const data = await usersService.getUserKiviatData(userId);

      res.json(data);
    } catch (error: any) {
      console.error('Get kiviat data error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new UsersController();
