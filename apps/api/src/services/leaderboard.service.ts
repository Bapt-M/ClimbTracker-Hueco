import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../database/entities/User';
import { Validation, ValidationStatus } from '../database/entities/Validation';
import { Route, DifficultyColor } from '../database/entities/Route';

export interface LeaderboardUser {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  totalValidations: number;
  averageGrade: number;
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

class LeaderboardService {
  private userRepository: Repository<User>;
  private validationRepository: Repository<Validation>;
  private routeRepository: Repository<Route>;

  // Points par couleur de difficulté
  private readonly DIFFICULTY_POINTS: Record<DifficultyColor, number> = {
    [DifficultyColor.VERT]: 10,
    [DifficultyColor.VERT_CLAIR]: 15,
    [DifficultyColor.BLEU_CLAIR]: 20,
    [DifficultyColor.BLEU]: 30,
    [DifficultyColor.BLEU_FONCE]: 40,
    [DifficultyColor.JAUNE]: 50,
    [DifficultyColor.ORANGE_CLAIR]: 60,
    [DifficultyColor.ORANGE]: 70,
    [DifficultyColor.ORANGE_FONCE]: 80,
    [DifficultyColor.ROUGE]: 90,
    [DifficultyColor.VIOLET]: 100,
    [DifficultyColor.NOIR]: 120,
  };

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.validationRepository = AppDataSource.getRepository(Validation);
    this.routeRepository = AppDataSource.getRepository(Route);
  }

  /**
   * Calcule les points pour une validation donnée
   */
  private calculateValidationPoints(route: Route, validation: Validation): number {
    // Seulement les voies validées donnent des points
    if (validation.status !== ValidationStatus.VALIDE) {
      return 0;
    }

    const difficultyPoints = this.DIFFICULTY_POINTS[route.difficulty];
    const multiplier = validation.isFlashed ? 1.5 : 1.0;

    return difficultyPoints * multiplier;
  }

  /**
   * Calcule le niveau moyen numérique d'un utilisateur
   */
  private calculateAverageGrade(validations: Validation[]): number {
    const validatedRoutes = validations.filter(v => v.status === ValidationStatus.VALIDE);
    if (validatedRoutes.length === 0) return 0;

    const gradeValues = validatedRoutes.map((v) => this.DIFFICULTY_POINTS[v.route.difficulty]);
    const sum = gradeValues.reduce((acc, val) => acc + val, 0);
    return sum / validatedRoutes.length / 10; // Normaliser sur échelle 1-12
  }

  /**
   * Calcule le taux de flash d'un utilisateur
   */
  private calculateFlashRate(validations: Validation[]): number {
    const validatedRoutes = validations.filter(v => v.status === ValidationStatus.VALIDE);
    if (validatedRoutes.length === 0) return 0;

    const flashCount = validatedRoutes.filter(v => v.isFlashed).length;
    return (flashCount / validatedRoutes.length) * 100;
  }

  /**
   * Récupère le classement global ou filtré
   */
  async getLeaderboard(
    tab: string,
    page: number = 1,
    limit: number = 50
  ): Promise<LeaderboardResponse> {
    // Récupérer toutes les validations avec les relations User et Route
    const validations = await this.validationRepository
      .createQueryBuilder('validation')
      .leftJoinAndSelect('validation.user', 'user')
      .leftJoinAndSelect('validation.route', 'route')
      .where('validation.status = :status', { status: ValidationStatus.VALIDE })
      .getMany();

    // Grouper par utilisateur et calculer les statistiques
    const userStatsMap = new Map<
      string,
      {
        user: User;
        validations: Validation[];
        points: number;
        flashCount: number;
      }
    >();

    for (const validation of validations) {
      const userId = validation.userId;

      if (!userStatsMap.has(userId)) {
        userStatsMap.set(userId, {
          user: validation.user,
          validations: [],
          points: 0,
          flashCount: 0,
        });
      }

      const userStats = userStatsMap.get(userId)!;
      userStats.validations.push(validation);
      userStats.points += this.calculateValidationPoints(
        validation.route,
        validation
      );

      if (validation.isFlashed) {
        userStats.flashCount++;
      }
    }

    // Convertir en tableau et calculer les métriques
    const usersList: LeaderboardUser[] = Array.from(userStatsMap.values()).map(
      (stats) => ({
        userId: stats.user.id,
        name: stats.user.name,
        avatar: stats.user.avatar,
        points: Math.round(stats.points),
        totalValidations: stats.validations.length,
        averageGrade: parseFloat(this.calculateAverageGrade(stats.validations).toFixed(1)),
        flashRate: parseFloat(this.calculateFlashRate(stats.validations).toFixed(1)),
        rank: 0, // Sera assigné après le tri
      })
    );

    // Trier selon les critères de classement
    usersList.sort((a, b) => {
      // 1. Par points (décroissant)
      if (b.points !== a.points) return b.points - a.points;

      // 2. Par nombre de validations (décroissant)
      if (b.totalValidations !== a.totalValidations)
        return b.totalValidations - a.totalValidations;

      // 3. Par taux de flash (décroissant)
      if (b.flashRate !== a.flashRate) return b.flashRate - a.flashRate;

      // 4. Par niveau moyen (décroissant)
      return b.averageGrade - a.averageGrade;
    });

    // Assigner les rangs
    usersList.forEach((user, index) => {
      user.rank = index + 1;
    });

    // Pagination
    const totalUsers = usersList.length;
    const totalPages = Math.ceil(totalUsers / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = usersList.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasMore: page < totalPages,
      },
    };
  }

  /**
   * Récupère le rang de l'utilisateur courant
   */
  async getCurrentUserRank(userId: string): Promise<LeaderboardUser | null> {
    // Récupérer le classement complet
    const leaderboard = await this.getLeaderboard('global', 1, 10000);

    // Trouver l'utilisateur dans le classement
    const userRank = leaderboard.users.find((u) => u.userId === userId);

    return userRank || null;
  }
}

export const leaderboardService = new LeaderboardService();
