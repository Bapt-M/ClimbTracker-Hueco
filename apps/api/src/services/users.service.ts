import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../database/entities/User';
import { Validation, ValidationStatus } from '../database/entities/Validation';
import { Comment } from '../database/entities/Comment';
import { Route, DifficultyColor } from '../database/entities/Route';
import { pointsService } from './points.service';
import { cacheService, CACHE_KEYS, CACHE_TTL } from './cache.service';

export interface UserUpdateInput {
  name?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  height?: number;
  wingspan?: number;
  bio?: string;
  avatar?: string;
  profilePhoto?: string;
  additionalPhotos?: string[];
}

export interface UserPublicProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  height?: number;
  wingspan?: number;
  profilePhoto?: string;
  additionalPhotos?: string[];
  createdAt: Date;
}

export interface KiviatData {
  routeType: string;
  successRate: number;
  averageGrade: number;
  totalAttempts: number;
  completedCount: number;
}

export interface UserStats {
  totalValidations: number;
  totalComments: number;
  totalRoutesCreated: number;
  totalPoints: number;
  validationsByDifficulty: { difficulty: string; count: number }[];
  validationsByGrade: { grade: string; count: number; points: number }[];
  recentValidations: {
    id: string;
    validatedAt: Date;
    route: {
      id: string;
      name: string;
      difficulty: string;
      sector: string;
      holdColorHex: string;
    };
  }[];
  recentComments: {
    id: string;
    content: string;
    createdAt: Date;
    route: {
      id: string;
      name: string;
    };
  }[];
}

// Valeur numérique pour chaque difficulté (pour le graphique Kiviat)
const DIFFICULTY_VALUES: Record<DifficultyColor, number> = {
  [DifficultyColor.VERT]: 1,
  [DifficultyColor.VERT_CLAIR]: 2,
  [DifficultyColor.BLEU_CLAIR]: 3,
  [DifficultyColor.BLEU_FONCE]: 4,
  [DifficultyColor.VIOLET]: 5,
  [DifficultyColor.ROSE]: 6,
  [DifficultyColor.ROUGE]: 7,
  [DifficultyColor.ORANGE]: 8,
  [DifficultyColor.JAUNE]: 9,
  [DifficultyColor.BLANC]: 10,
  [DifficultyColor.GRIS]: 11,
  [DifficultyColor.NOIR]: 12,
};

class UsersService {
  private userRepository: Repository<User>;
  private validationRepository: Repository<Validation>;
  private commentRepository: Repository<Comment>;
  private routeRepository: Repository<Route>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.validationRepository = AppDataSource.getRepository(Validation);
    this.commentRepository = AppDataSource.getRepository(Comment);
    this.routeRepository = AppDataSource.getRepository(Route);
  }

  /**
   * Get user by ID (public profile)
   */
  async getUserById(userId: string): Promise<UserPublicProfile> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      height: user.height,
      wingspan: user.wingspan,
      profilePhoto: user.profilePhoto,
      additionalPhotos: user.additionalPhotos,
      createdAt: user.createdAt,
    };
  }

  /**
   * Update user profile (only by owner or admin)
   */
  async updateUser(
    userId: string,
    requestUserId: string,
    userRole: string,
    data: UserUpdateInput
  ): Promise<UserPublicProfile> {
    if (userId !== requestUserId && userRole !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Update fields
    Object.assign(user, {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.firstName !== undefined && { firstName: data.firstName }),
      ...(data.lastName !== undefined && { lastName: data.lastName }),
      ...(data.age !== undefined && { age: data.age }),
      ...(data.height !== undefined && { height: data.height }),
      ...(data.wingspan !== undefined && { wingspan: data.wingspan }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.avatar !== undefined && { avatar: data.avatar }),
      ...(data.profilePhoto !== undefined && { profilePhoto: data.profilePhoto }),
      ...(data.additionalPhotos !== undefined && { additionalPhotos: data.additionalPhotos }),
    });

    await this.userRepository.save(user);

    // Invalidate cache
    cacheService.delete(CACHE_KEYS.USER_STATS(userId));

    return this.getUserById(userId);
  }

  /**
   * Get user statistics (optimized with cache)
   */
  async getUserStats(userId: string): Promise<UserStats> {
    // Check cache
    const cacheKey = CACHE_KEYS.USER_STATS(userId);
    const cached = cacheService.get<UserStats>(cacheKey);
    if (cached) {
      return cached;
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Get difficulty factors (cached)
    const difficultyFactors = await pointsService.getRouteDifficultyFactors();

    // Parallel queries for better performance
    const [
      totalValidations,
      totalComments,
      totalRoutesCreated,
      validations,
      recentValidationsData,
      recentCommentsData,
    ] = await Promise.all([
      // Count validations (last 6 months)
      this.validationRepository
        .createQueryBuilder('v')
        .where('v.userId = :userId', { userId })
        .andWhere('v.validatedAt >= :sixMonthsAgo', { sixMonthsAgo })
        .getCount(),

      // Count comments
      this.commentRepository.count({ where: { userId } }),

      // Count routes created
      this.routeRepository.count({ where: { openerId: userId } }),

      // Get validations with route info
      this.validationRepository
        .createQueryBuilder('v')
        .leftJoinAndSelect('v.route', 'r')
        .where('v.userId = :userId', { userId })
        .andWhere('v.validatedAt >= :sixMonthsAgo', { sixMonthsAgo })
        .getMany(),

      // Recent validations
      this.validationRepository.find({
        where: { userId },
        relations: ['route'],
        order: { validatedAt: 'DESC' },
        take: 5,
      }),

      // Recent comments
      this.commentRepository.find({
        where: { userId },
        relations: ['route'],
        order: { createdAt: 'DESC' },
        take: 5,
      }),
    ]);

    // Calculate points and group by difficulty
    let totalPoints = 0;
    const difficultyMap = new Map<string, { count: number; points: number }>();

    for (const v of validations) {
      if (v.route) {
        const difficulty = v.route.difficulty;
        const routeFactor = difficultyFactors.get(v.route.id) || 1.0;
        const points = pointsService.calculatePoints(difficulty, routeFactor, v.attempts);

        totalPoints += points;

        if (difficultyMap.has(difficulty)) {
          const data = difficultyMap.get(difficulty)!;
          data.count++;
          data.points += points;
        } else {
          difficultyMap.set(difficulty, { count: 1, points });
        }
      }
    }

    // Sort by difficulty order
    const difficultyOrder = Object.values(DifficultyColor);
    const validationsByDifficulty = Array.from(difficultyMap.entries())
      .map(([difficulty, data]) => ({ difficulty, count: data.count }))
      .sort((a, b) =>
        difficultyOrder.indexOf(a.difficulty as DifficultyColor) -
        difficultyOrder.indexOf(b.difficulty as DifficultyColor)
      );

    const validationsByGrade = Array.from(difficultyMap.entries())
      .map(([grade, data]) => ({ grade, count: data.count, points: data.points }))
      .sort((a, b) => b.points - a.points);

    const recentValidations = recentValidationsData.map((v) => ({
      id: v.id,
      validatedAt: v.validatedAt,
      route: {
        id: v.route.id,
        name: v.route.name,
        difficulty: v.route.difficulty,
        sector: v.route.sector,
        holdColorHex: v.route.holdColorHex,
      },
    }));

    const recentComments = recentCommentsData.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      route: {
        id: c.route.id,
        name: c.route.name,
      },
    }));

    const stats: UserStats = {
      totalValidations,
      totalComments,
      totalRoutesCreated,
      totalPoints,
      validationsByDifficulty,
      validationsByGrade,
      recentValidations,
      recentComments,
    };

    // Cache for 2 minutes
    cacheService.set(cacheKey, stats, CACHE_TTL.USER_STATS);

    return stats;
  }

  /**
   * Get all users (admin only, for moderation)
   */
  async getAllUsers(
    page: number = 1,
    limit: number = 50
  ): Promise<{ users: UserPublicProfile[]; total: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const publicUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      height: user.height,
      wingspan: user.wingspan,
      profilePhoto: user.profilePhoto,
      additionalPhotos: user.additionalPhotos,
      createdAt: user.createdAt,
    }));

    return { users: publicUsers, total };
  }

  /**
   * Get Kiviat (radar) chart data for user performance by route type
   */
  async getUserKiviatData(userId: string): Promise<KiviatData[]> {
    const validations = await this.validationRepository
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.route', 'r')
      .where('v.userId = :userId', { userId })
      .andWhere('v.status = :status', { status: ValidationStatus.VALIDE })
      .getMany();

    // Group validations by route types
    const typeMap = new Map<string, {
      total: number;
      completed: number;
      difficulties: DifficultyColor[];
    }>();

    validations.forEach((validation) => {
      if (validation.route?.routeTypes && validation.route.routeTypes.length > 0) {
        validation.route.routeTypes.forEach((type) => {
          if (!typeMap.has(type)) {
            typeMap.set(type, { total: 0, completed: 0, difficulties: [] });
          }
          const data = typeMap.get(type)!;
          data.total++;
          data.completed++;
          data.difficulties.push(validation.route.difficulty);
        });
      }
    });

    // Calculate metrics for each route type
    return Array.from(typeMap.entries()).map(([type, data]) => ({
      routeType: type,
      successRate: (data.completed / data.total) * 100,
      averageGrade: this.calculateAverageDifficulty(data.difficulties),
      totalAttempts: data.total,
      completedCount: data.completed,
    }));
  }

  /**
   * Convert difficulty colors to numeric values for averaging
   */
  private calculateAverageDifficulty(difficulties: DifficultyColor[]): number {
    if (difficulties.length === 0) return 0;

    const sum = difficulties.reduce(
      (acc, difficulty) => acc + (DIFFICULTY_VALUES[difficulty] || 0),
      0
    );
    return sum / difficulties.length;
  }
}

export default new UsersService();
