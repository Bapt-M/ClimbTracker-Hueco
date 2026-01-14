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
  validatedGrade?: string; // Couleur validée (3+ voies)
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

  // Points de base par couleur de difficulté (échelle exponentielle x1.5)
  // Le grade est LE facteur le plus important
  private readonly DIFFICULTY_POINTS: Record<DifficultyColor, number> = {
    [DifficultyColor.VERT]: 10,           // Débutant
    [DifficultyColor.VERT_CLAIR]: 15,     // Débutant+
    [DifficultyColor.BLEU_CLAIR]: 23,     // Intermédiaire-
    [DifficultyColor.BLEU_FONCE]: 34,     // Intermédiaire
    [DifficultyColor.VIOLET]: 51,         // Intermédiaire+
    [DifficultyColor.ROSE]: 75,           // Confirmé-
    [DifficultyColor.ROUGE]: 112,         // Confirmé
    [DifficultyColor.ORANGE]: 169,        // Confirmé+
    [DifficultyColor.JAUNE]: 255,         // Avancé
    [DifficultyColor.BLANC]: 386,         // Expert
    [DifficultyColor.GRIS]: 570,          // Expert+
    [DifficultyColor.NOIR]: 855,          // Elite
  };

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.validationRepository = AppDataSource.getRepository(Validation);
    this.routeRepository = AppDataSource.getRepository(Route);
  }

  /**
   * Calcule le multiplicateur basé sur le nombre d'essais
   * Système de bonus/malus progressif :
   * - Flash (1 essai) : x1.3 (bonus 30%)
   * - 2 essais : x1.2 (bonus 20%)
   * - 3 essais : x1.1 (bonus 10%)
   * - 4 essais : x1.0 (points de base)
   * - 5 essais : x0.9 (malus 10%)
   * - 6 essais : x0.8 (malus 20%)
   * - 7+ essais : x0.7 (malus 30%)
   */
  private getAttemptsMultiplier(attempts: number): number {
    if (attempts === 1) return 1.3;   // Flash
    if (attempts === 2) return 1.2;   // Excellent
    if (attempts === 3) return 1.1;   // Très bien
    if (attempts === 4) return 1.0;   // Bien
    if (attempts === 5) return 0.9;   // Acceptable
    if (attempts === 6) return 0.8;   // Moyen
    return 0.7;                        // Laborieux (7+)
  }

  /**
   * Calcule un facteur de difficulté pour une voie basé sur les statistiques de réussite
   * Une voie avec peu de réussites et beaucoup de tentatives = plus difficile = plus de points
   *
   * @param routeId - ID de la voie
   * @param allValidations - Toutes les validations (des 6 derniers mois)
   * @returns Multiplicateur entre 0.8 et 2.0
   */
  private async calculateRouteDifficultyFactor(
    routeId: string,
    allValidations: Validation[]
  ): Promise<number> {
    // Filtrer les validations pour cette voie
    const routeValidations = allValidations.filter(
      (v) => v.route.id === routeId && v.status === ValidationStatus.VALIDE
    );

    // Si moins de 3 validations, on ne peut pas calculer de statistiques fiables
    if (routeValidations.length < 3) {
      return 1.0; // Facteur neutre
    }

    // Calculer le nombre moyen d'essais
    const totalAttempts = routeValidations.reduce((sum, v) => sum + v.attempts, 0);
    const averageAttempts = totalAttempts / routeValidations.length;

    // Calculer le taux de flash
    const flashCount = routeValidations.filter((v) => v.isFlashed).length;
    const flashRate = flashCount / routeValidations.length;

    // Nombre de personnes qui ont réussi (moins il y en a, plus c'est dur)
    const successCount = routeValidations.length;

    // Calcul du facteur de difficulté :
    // - Moins de réussites = plus difficile
    // - Plus d'essais moyens = plus difficile
    // - Moins de flash = plus difficile

    let difficultyFactor = 1.0;

    // Facteur basé sur le nombre de réussites (0.8 à 1.4)
    if (successCount <= 2) {
      difficultyFactor *= 1.4; // Très peu de personnes ont réussi
    } else if (successCount <= 5) {
      difficultyFactor *= 1.3;
    } else if (successCount <= 10) {
      difficultyFactor *= 1.2;
    } else if (successCount <= 20) {
      difficultyFactor *= 1.1;
    } else if (successCount <= 30) {
      difficultyFactor *= 1.0;
    } else if (successCount <= 50) {
      difficultyFactor *= 0.95;
    } else {
      difficultyFactor *= 0.9; // Beaucoup de personnes ont réussi
    }

    // Facteur basé sur le nombre moyen d'essais (0.9 à 1.3)
    if (averageAttempts >= 6) {
      difficultyFactor *= 1.3; // Beaucoup d'essais en moyenne
    } else if (averageAttempts >= 5) {
      difficultyFactor *= 1.2;
    } else if (averageAttempts >= 4) {
      difficultyFactor *= 1.1;
    } else if (averageAttempts >= 3) {
      difficultyFactor *= 1.0;
    } else {
      difficultyFactor *= 0.95; // Peu d'essais en moyenne
    }

    // Facteur basé sur le taux de flash (0.9 à 1.2)
    if (flashRate <= 0.05) {
      difficultyFactor *= 1.2; // Très peu de flash
    } else if (flashRate <= 0.1) {
      difficultyFactor *= 1.15;
    } else if (flashRate <= 0.2) {
      difficultyFactor *= 1.1;
    } else if (flashRate <= 0.3) {
      difficultyFactor *= 1.0;
    } else if (flashRate <= 0.5) {
      difficultyFactor *= 0.95;
    } else {
      difficultyFactor *= 0.9; // Beaucoup de flash
    }

    // Limiter le facteur entre 0.8 et 2.0
    return Math.max(0.8, Math.min(2.0, difficultyFactor));
  }

  /**
   * Calcule les points pour une validation donnée
   * Formule : Points de base (GRADE) × Facteur difficulté voie × Multiplicateur d'essais
   * Le GRADE est le facteur le plus important (échelle exponentielle x2)
   */
  private async calculateValidationPoints(
    route: Route,
    validation: Validation,
    allValidations: Validation[]
  ): Promise<number> {
    // Seulement les voies validées donnent des points
    if (validation.status !== ValidationStatus.VALIDE) {
      return 0;
    }

    // 1. Points de base selon la difficulté (FACTEUR LE PLUS IMPORTANT)
    const basePoints = this.DIFFICULTY_POINTS[route.difficulty];

    // 2. Facteur de difficulté de la voie basé sur les stats
    const routeDifficultyFactor = await this.calculateRouteDifficultyFactor(
      route.id,
      allValidations
    );

    // 3. Multiplicateur basé sur les essais de l'utilisateur
    const attemptsMultiplier = this.getAttemptsMultiplier(validation.attempts);

    // Formule finale : GRADE × Difficulté voie × Performance perso
    return Math.round(basePoints * routeDifficultyFactor * attemptsMultiplier);
  }

  /**
   * Calcule la couleur validée (3+ voies réussies)
   * Retourne la couleur la plus élevée où l'utilisateur a au moins 3 validations
   */
  private calculateValidatedGrade(validations: Validation[]): string | undefined {
    const validatedRoutes = validations.filter(v => v.status === ValidationStatus.VALIDE);
    if (validatedRoutes.length === 0) return undefined;

    // Compter le nombre de validations par difficulté
    const difficultyCount = new Map<DifficultyColor, number>();
    validatedRoutes.forEach(v => {
      const difficulty = v.route.difficulty;
      difficultyCount.set(difficulty, (difficultyCount.get(difficulty) || 0) + 1);
    });

    // Ordre des difficultés (du plus facile au plus dur)
    const difficultyOrder = [
      DifficultyColor.VERT,
      DifficultyColor.VERT_CLAIR,
      DifficultyColor.BLEU_CLAIR,
      DifficultyColor.BLEU_FONCE,
      DifficultyColor.VIOLET,
      DifficultyColor.ROSE,
      DifficultyColor.ROUGE,
      DifficultyColor.ORANGE,
      DifficultyColor.JAUNE,
      DifficultyColor.BLANC,
      DifficultyColor.GRIS,
      DifficultyColor.NOIR,
    ];

    // Trouver la couleur la plus élevée avec au moins 3 validations
    let validatedGrade: string | undefined = undefined;
    for (const difficulty of difficultyOrder) {
      const count = difficultyCount.get(difficulty) || 0;
      if (count >= 3) {
        validatedGrade = difficulty;
      }
    }

    return validatedGrade;
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
    limit: number = 50,
    userId?: string
  ): Promise<LeaderboardResponse> {
    // Calculer la date limite (6 mois en arrière)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Si on filtre par amis, récupérer les IDs des amis
    let friendIds: string[] = [];
    if (tab === 'friends' && userId) {
      const { default: friendshipsService } = await import('./friendships.service');
      friendIds = await friendshipsService.getFriendIds(userId);

      // Ajouter l'utilisateur lui-même dans la liste
      friendIds.push(userId);

      // Si l'utilisateur n'a pas d'amis, retourner un classement vide
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

    // Récupérer toutes les validations avec les relations User et Route
    // Filtrer uniquement les validations des 6 derniers mois
    let query = this.validationRepository
      .createQueryBuilder('validation')
      .leftJoinAndSelect('validation.user', 'user')
      .leftJoinAndSelect('validation.route', 'route')
      .where('validation.status = :status', { status: ValidationStatus.VALIDE })
      .andWhere('validation.validatedAt >= :sixMonthsAgo', { sixMonthsAgo });

    // Filtrer par amis si nécessaire
    if (tab === 'friends' && friendIds.length > 0) {
      query = query.andWhere('validation.userId IN (:...friendIds)', { friendIds });
    }

    const validations = await query.getMany();

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

    // Calculer les points pour chaque validation (async)
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

      // Calculer les points avec le nouveau système (async)
      const points = await this.calculateValidationPoints(
        validation.route,
        validation,
        validations
      );
      userStats.points += points;

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
        validatedGrade: this.calculateValidatedGrade(stats.validations),
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

      // 4. Par couleur validée (décroissant)
      const difficultyOrder = Object.values(DifficultyColor);
      const aGradeIndex = a.validatedGrade ? difficultyOrder.indexOf(a.validatedGrade as DifficultyColor) : -1;
      const bGradeIndex = b.validatedGrade ? difficultyOrder.indexOf(b.validatedGrade as DifficultyColor) : -1;
      return bGradeIndex - aGradeIndex;
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

  /**
   * Récupère les détails des validations d'un utilisateur pour le calcul des points
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
    // Calculer la date limite (6 mois en arrière)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Récupérer toutes les validations des 6 derniers mois (pour calculer les facteurs)
    const allValidations = await this.validationRepository
      .createQueryBuilder('validation')
      .leftJoinAndSelect('validation.route', 'route')
      .where('validation.status = :status', { status: ValidationStatus.VALIDE })
      .andWhere('validation.validatedAt >= :sixMonthsAgo', { sixMonthsAgo })
      .getMany();

    // Récupérer les validations de l'utilisateur
    const userValidations = await this.validationRepository
      .createQueryBuilder('validation')
      .leftJoinAndSelect('validation.route', 'route')
      .where('validation.userId = :userId', { userId })
      .andWhere('validation.status = :status', { status: ValidationStatus.VALIDE })
      .andWhere('validation.validatedAt >= :sixMonthsAgo', { sixMonthsAgo })
      .orderBy('validation.validatedAt', 'DESC')
      .getMany();

    let totalPoints = 0;
    const validationDetails = [];

    for (const validation of userValidations) {
      if (validation.route) {
        const basePoints = this.DIFFICULTY_POINTS[validation.route.difficulty];
        const routeDifficultyFactor = await this.calculateRouteDifficultyFactor(
          validation.route.id,
          allValidations
        );
        const attemptsMultiplier = this.getAttemptsMultiplier(validation.attempts);
        const points = Math.round(basePoints * routeDifficultyFactor * attemptsMultiplier);

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
          routeDifficultyFactor: Math.round(routeDifficultyFactor * 100) / 100, // Arrondir à 2 décimales
          attemptsMultiplier,
          totalPoints: points,
        });
      }
    }

    return {
      totalPoints,
      validations: validationDetails,
    };
  }
}

export const leaderboardService = new LeaderboardService();
