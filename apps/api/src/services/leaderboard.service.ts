import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../database/entities/User';
import { Validation, ValidationStatus } from '../database/entities/Validation';
import { DifficultyColor } from '../database/entities/Route';
import { pointsService } from './points.service';
import { cacheService, CACHE_KEYS, CACHE_TTL } from './cache.service';

export interface LeaderboardUser {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  totalValidations: number;
  validatedGrade?: string;
  flashRate: number;
}

export interface LeaderboardResponse {
  users: LeaderboardUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasMore: boolean;
  };
}

// Ordre des difficultés pour le tri
const DIFFICULTY_ORDER = Object.values(DifficultyColor);

class LeaderboardService {
  private userRepository: Repository<User>;
  private validationRepository: Repository<Validation>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.validationRepository = AppDataSource.getRepository(Validation);
  }

  /**
   * Récupère le classement global ou filtré (optimisé)
   */
  async getLeaderboard(
    tab: string,
    page: number = 1,
    limit: number = 50,
    userId?: string
  ): Promise<LeaderboardResponse> {
    // Check cache first
    const cacheKey = CACHE_KEYS.LEADERBOARD(tab, page);
    const cached = cacheService.get<LeaderboardResponse>(cacheKey);
    if (cached && tab !== 'friends') {
      return cached;
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Get friend IDs if needed
    let friendIds: string[] = [];
    if (tab === 'friends' && userId) {
      const { default: friendshipsService } = await import('./friendships.service');
      friendIds = await friendshipsService.getFriendIds(userId);
      friendIds.push(userId);

      if (friendIds.length === 1) {
        return {
          users: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalUsers: 0,
            hasMore: false,
          },
        };
      }
    }

    // Get difficulty factors (cached)
    const difficultyFactors = await pointsService.getRouteDifficultyFactors();

    // Build optimized query - get aggregated stats per user
    let query = this.validationRepository
      .createQueryBuilder('v')
      .select('v.userId', 'userId')
      .addSelect('u.name', 'name')
      .addSelect('u.avatar', 'avatar')
      .addSelect('COUNT(*)', 'totalValidations')
      .addSelect('SUM(CASE WHEN v.isFlashed = true THEN 1 ELSE 0 END)', 'flashCount')
      .innerJoin('v.user', 'u')
      .innerJoin('v.route', 'r')
      .where('v.status = :status', { status: ValidationStatus.VALIDE })
      .andWhere('v.validatedAt >= :sixMonthsAgo', { sixMonthsAgo })
      .groupBy('v.userId')
      .addGroupBy('u.name')
      .addGroupBy('u.avatar');

    if (tab === 'friends' && friendIds.length > 0) {
      query = query.andWhere('v.userId IN (:...friendIds)', { friendIds });
    }

    const aggregatedStats = await query.getRawMany<{
      userId: string;
      name: string;
      avatar: string | null;
      totalValidations: string;
      flashCount: string;
    }>();

    // Get all validations for points calculation (we need route difficulty)
    let validationsQuery = this.validationRepository
      .createQueryBuilder('v')
      .select(['v.userId', 'v.attempts', 'v.isFlashed', 'r.id', 'r.difficulty'])
      .innerJoin('v.route', 'r')
      .where('v.status = :status', { status: ValidationStatus.VALIDE })
      .andWhere('v.validatedAt >= :sixMonthsAgo', { sixMonthsAgo });

    if (tab === 'friends' && friendIds.length > 0) {
      validationsQuery = validationsQuery.andWhere('v.userId IN (:...friendIds)', { friendIds });
    }

    const validations = await validationsQuery.getRawMany<{
      v_userId: string;
      v_attempts: number;
      v_isFlashed: boolean;
      r_id: string;
      r_difficulty: DifficultyColor;
    }>();

    // Calculate points and validated grade per user
    const userPointsMap = new Map<string, { points: number; difficulties: Map<DifficultyColor, number> }>();

    for (const v of validations) {
      if (!userPointsMap.has(v.v_userId)) {
        userPointsMap.set(v.v_userId, { points: 0, difficulties: new Map() });
      }

      const userData = userPointsMap.get(v.v_userId)!;
      const routeFactor = difficultyFactors.get(v.r_id) || 1.0;
      const points = pointsService.calculatePoints(v.r_difficulty, routeFactor, v.v_attempts);

      userData.points += points;
      userData.difficulties.set(
        v.r_difficulty,
        (userData.difficulties.get(v.r_difficulty) || 0) + 1
      );
    }

    // Build leaderboard users
    const usersList: LeaderboardUser[] = aggregatedStats.map((stat) => {
      const userData = userPointsMap.get(stat.userId);
      const totalValidations = parseInt(stat.totalValidations);
      const flashCount = parseInt(stat.flashCount);

      // Calculate validated grade (3+ validations at a difficulty)
      let validatedGrade: string | undefined;
      if (userData) {
        for (const difficulty of DIFFICULTY_ORDER) {
          const count = userData.difficulties.get(difficulty) || 0;
          if (count >= 3) {
            validatedGrade = difficulty;
          }
        }
      }

      return {
        userId: stat.userId,
        name: stat.name,
        avatar: stat.avatar || undefined,
        points: userData?.points || 0,
        totalValidations,
        validatedGrade,
        flashRate: totalValidations > 0
          ? parseFloat(((flashCount / totalValidations) * 100).toFixed(1))
          : 0,
        rank: 0,
      };
    });

    // Sort by points, then validations, then flash rate, then validated grade
    usersList.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.totalValidations !== a.totalValidations) return b.totalValidations - a.totalValidations;
      if (b.flashRate !== a.flashRate) return b.flashRate - a.flashRate;

      const aGradeIndex = a.validatedGrade ? DIFFICULTY_ORDER.indexOf(a.validatedGrade as DifficultyColor) : -1;
      const bGradeIndex = b.validatedGrade ? DIFFICULTY_ORDER.indexOf(b.validatedGrade as DifficultyColor) : -1;
      return bGradeIndex - aGradeIndex;
    });

    // Assign ranks
    usersList.forEach((user, index) => {
      user.rank = index + 1;
    });

    // Pagination
    const totalUsers = usersList.length;
    const totalPages = Math.ceil(totalUsers / limit);
    const startIndex = (page - 1) * limit;
    const paginatedUsers = usersList.slice(startIndex, startIndex + limit);

    const response: LeaderboardResponse = {
      users: paginatedUsers,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasMore: page < totalPages,
      },
    };

    // Cache response (not for friends tab as it's user-specific)
    if (tab !== 'friends') {
      cacheService.set(cacheKey, response, CACHE_TTL.LEADERBOARD);
    }

    return response;
  }

  /**
   * Récupère le rang de l'utilisateur courant (optimisé)
   */
  async getCurrentUserRank(userId: string): Promise<LeaderboardUser | null> {
    // Check cache first
    const cacheKey = CACHE_KEYS.USER_RANK(userId);
    const cached = cacheService.get<LeaderboardUser>(cacheKey);
    if (cached) {
      return cached;
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Get difficulty factors (cached)
    const difficultyFactors = await pointsService.getRouteDifficultyFactors();

    // Get all users' points in one query
    const allUsersPoints = await this.validationRepository
      .createQueryBuilder('v')
      .select('v.userId', 'userId')
      .addSelect('u.name', 'name')
      .addSelect('u.avatar', 'avatar')
      .innerJoin('v.user', 'u')
      .innerJoin('v.route', 'r')
      .addSelect('r.id', 'routeId')
      .addSelect('r.difficulty', 'difficulty')
      .addSelect('v.attempts', 'attempts')
      .addSelect('v.isFlashed', 'isFlashed')
      .where('v.status = :status', { status: ValidationStatus.VALIDE })
      .andWhere('v.validatedAt >= :sixMonthsAgo', { sixMonthsAgo })
      .getRawMany();

    // Calculate points per user
    const userStats = new Map<string, {
      name: string;
      avatar?: string;
      points: number;
      validations: number;
      flashes: number;
      difficulties: Map<DifficultyColor, number>;
    }>();

    for (const row of allUsersPoints) {
      if (!userStats.has(row.userId)) {
        userStats.set(row.userId, {
          name: row.name,
          avatar: row.avatar,
          points: 0,
          validations: 0,
          flashes: 0,
          difficulties: new Map(),
        });
      }

      const stats = userStats.get(row.userId)!;
      const routeFactor = difficultyFactors.get(row.routeId) || 1.0;
      const points = pointsService.calculatePoints(row.difficulty, routeFactor, row.attempts);

      stats.points += points;
      stats.validations++;
      if (row.isFlashed) stats.flashes++;
      stats.difficulties.set(row.difficulty, (stats.difficulties.get(row.difficulty) || 0) + 1);
    }

    // Sort and find rank
    const sortedUsers = Array.from(userStats.entries())
      .map(([id, stats]) => {
        let validatedGrade: string | undefined;
        for (const difficulty of DIFFICULTY_ORDER) {
          if ((stats.difficulties.get(difficulty) || 0) >= 3) {
            validatedGrade = difficulty;
          }
        }

        return {
          userId: id,
          name: stats.name,
          avatar: stats.avatar,
          points: stats.points,
          totalValidations: stats.validations,
          flashRate: stats.validations > 0
            ? parseFloat(((stats.flashes / stats.validations) * 100).toFixed(1))
            : 0,
          validatedGrade,
        };
      })
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.totalValidations !== a.totalValidations) return b.totalValidations - a.totalValidations;
        return b.flashRate - a.flashRate;
      });

    const userIndex = sortedUsers.findIndex(u => u.userId === userId);
    if (userIndex === -1) return null;

    const userRank: LeaderboardUser = {
      ...sortedUsers[userIndex],
      rank: userIndex + 1,
    };

    // Cache for 1 minute
    cacheService.set(cacheKey, userRank, CACHE_TTL.USER_RANK);

    return userRank;
  }

  /**
   * Récupère les détails des validations d'un utilisateur
   */
  async getUserValidationDetails(userId: string): Promise<{
    totalPoints: number;
    validations: Array<{
      routeId: string;
      routeName: string;
      difficulty: string;
      sector: string;
      attempts: number;
      isFlashed: boolean;
      validatedAt: Date;
      basePoints: number;
      routeDifficultyFactor: number;
      attemptsMultiplier: number;
      totalPoints: number;
    }>;
  }> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Get difficulty factors (cached)
    const difficultyFactors = await pointsService.getRouteDifficultyFactors();

    // Get user validations
    const userValidations = await this.validationRepository
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.route', 'r')
      .where('v.userId = :userId', { userId })
      .andWhere('v.status = :status', { status: ValidationStatus.VALIDE })
      .andWhere('v.validatedAt >= :sixMonthsAgo', { sixMonthsAgo })
      .orderBy('v.validatedAt', 'DESC')
      .getMany();

    let totalPoints = 0;
    const validationDetails = [];

    for (const validation of userValidations) {
      if (validation.route) {
        const basePoints = pointsService.DIFFICULTY_POINTS[validation.route.difficulty] || 0;
        const routeDifficultyFactor = difficultyFactors.get(validation.route.id) || 1.0;
        const attemptsMultiplier = pointsService.getAttemptsMultiplier(validation.attempts);
        const points = pointsService.calculatePoints(
          validation.route.difficulty,
          routeDifficultyFactor,
          validation.attempts
        );

        totalPoints += points;

        validationDetails.push({
          routeId: validation.route.id,
          routeName: validation.route.name,
          difficulty: validation.route.difficulty,
          sector: validation.route.sector,
          attempts: validation.attempts,
          isFlashed: validation.isFlashed,
          validatedAt: validation.validatedAt,
          basePoints,
          routeDifficultyFactor: Math.round(routeDifficultyFactor * 100) / 100,
          attemptsMultiplier,
          totalPoints: points,
        });
      }
    }

    return { totalPoints, validations: validationDetails };
  }
}

export const leaderboardService = new LeaderboardService();
