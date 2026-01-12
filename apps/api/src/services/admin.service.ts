import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User, UserRole } from '../database/entities/User';
import { Route } from '../database/entities/Route';
import { Validation } from '../database/entities/Validation';
import { Comment } from '../database/entities/Comment';

export interface DashboardStats {
  totalUsers: number;
  totalRoutes: number;
  totalValidations: number;
  totalComments: number;
  usersByRole: {
    role: string;
    count: number;
  }[];
}

class AdminService {
  private userRepository: Repository<User>;
  private routeRepository: Repository<Route>;
  private validationRepository: Repository<Validation>;
  private commentRepository: Repository<Comment>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.routeRepository = AppDataSource.getRepository(Route);
    this.validationRepository = AppDataSource.getRepository(Validation);
    this.commentRepository = AppDataSource.getRepository(Comment);
  }

  /**
   * Get dashboard statistics
   * Returns overall counts and metrics for admin dashboard
   */
  async getDashboardStats(): Promise<DashboardStats> {
    // Get total counts
    const [totalUsers, totalRoutes, totalValidations, totalComments] =
      await Promise.all([
        this.userRepository.count(),
        this.routeRepository.count(),
        this.validationRepository.count(),
        this.commentRepository.count(),
      ]);

    // Get users grouped by role
    const usersByRole = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    return {
      totalUsers,
      totalRoutes,
      totalValidations,
      totalComments,
      usersByRole: usersByRole.map((row) => ({
        role: row.role,
        count: parseInt(row.count),
      })),
    };
  }

  /**
   * Update user role
   * Admin can promote/demote users
   */
  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    user.role = role;
    return await this.userRepository.save(user);
  }

  /**
   * Delete a user and all their associated data
   * CAUTION: This is a destructive operation
   */
  async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // TypeORM will cascade delete relations if configured
    // Otherwise, you may need to manually delete:
    // - User's validations
    // - User's comments
    // - User's routes (if they are an opener)
    // - User's videos

    await this.userRepository.remove(user);
  }

  /**
   * Bulk delete routes
   * Admin can delete multiple routes at once
   */
  async bulkDeleteRoutes(routeIds: string[]): Promise<void> {
    if (routeIds.length === 0) {
      throw new Error('No route IDs provided');
    }

    await this.routeRepository.delete(routeIds);
  }

  /**
   * Get detailed user information (admin view)
   * Includes sensitive data not exposed to regular users
   */
  async getUserDetails(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['routes', 'validations', 'comments'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Get all routes with full details for admin management
   */
  async getAllRoutes(
    page: number = 1,
    limit: number = 50
  ): Promise<{ routes: Route[]; total: number }> {
    const skip = (page - 1) * limit;

    const [routes, total] = await this.routeRepository.findAndCount({
      skip,
      take: limit,
      relations: ['opener'],
      order: { createdAt: 'DESC' },
    });

    return { routes, total };
  }

  /**
   * Ban a user (set a flag or change role)
   * You might want to add a 'banned' field to User entity
   */
  async banUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // For now, we'll just change their role to CLIMBER
    // In a real app, you'd add a 'banned' or 'status' field
    user.role = UserRole.CLIMBER;

    return await this.userRepository.save(user);
  }
}

export default new AdminService();
