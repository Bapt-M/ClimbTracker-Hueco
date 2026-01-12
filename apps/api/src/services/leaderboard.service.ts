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

  // Points de base par couleur de difficulté (échelle exponentielle)
  private readonly DIFFICULTY_POINTS: Record<DifficultyColor, number> = {
    [DifficultyColor.VERT]: 10,           // V-easy/VB (3-4a) - Débutant
    [DifficultyColor.VERT_CLAIR]: 20,     // V0 (4b-4c) - Débutant+
    [DifficultyColor.BLEU_CLAIR]: 35,     // V1 (5a-5b) - Intermédiaire-
    [DifficultyColor.BLEU]: 55,           // V2 (5c-6a) - Intermédiaire
    [DifficultyColor.BLEU_FONCE]: 80,     // V3 (6a+-6b) - Intermédiaire+
    [DifficultyColor.JAUNE]: 110,         // V4 (6b+-6c) - Confirmé-
    [DifficultyColor.ORANGE_CLAIR]: 150,  // V4-V5 (6c-6c+) - Confirmé
    [DifficultyColor.ORANGE]: 200,        // V5 (7a) - Confirmé+
    [DifficultyColor.ORANGE_FONCE]: 260,  // V5-V6 (7a-7b) - Avancé
    [DifficultyColor.ROUGE]: 340,         // V6-V7 (7b+-7c) - Expert
    [DifficultyColor.VIOLET]: 440,        // V8-V9 (7c+-8a) - Expert+
    [DifficultyColor.NOIR]: 570,          // V10+ (8a+) - Elite
  };

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.validationRepository = AppDataSource.getRepository(Validation);
    this.routeRepository = AppDataSource.getRepository(Route);
  }

  /**
   * Calcule le multiplicateur basé sur le nombre d'essais
   * Système de bonus/malus progressif :
   * - Flash (1 essai) : x1.5 (bonus 50%)
   * - 2 essais : x1.3 (bonus 30%)
   * - 3 essais : x1.15 (bonus 15%)
   * - 4 essais : x1.0 (points de base)
   * - 5 essais : x0.9 (malus 10%)
   * - 6 essais : x0.82 (malus 18%)
   * - 7 essais : x0.75 (malus 25%)
   * - 8+ essais : x0.7 (malus 30%)
   */
  private getAttemptsMultiplier(attempts: number): number {
    if (attempts === 1) return 1.5;   // Flash
    if (attempts === 2) return 1.3;   // Excellent
    if (attempts === 3) return 1.15;  // Très bien
    if (attempts === 4) return 1.0;   // Bien
    if (attempts === 5) return 0.9;   // Acceptable
    if (attempts === 6) return 0.82;  // Moyen
    if (attempts === 7) return 0.75;  // Laborieux
    return 0.7;                        // Très laborieux (8+)
  }

  /**
   * Calcule les points pour une validation donnée
   * Formule : Points de base × Multiplicateur d'essais
   */
  private calculateValidationPoints(route: Route, validation: Validation): number {
    // Seulement les voies validées donnent des points
    if (validation.status !== ValidationStatus.VALIDE) {
      return 0;
    }

    const basePoints = this.DIFFICULTY_POINTS[route.difficulty];
    const attemptsMultiplier = this.getAttemptsMultiplier(validation.attempts);

    return Math.round(basePoints * attemptsMultiplier);
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
