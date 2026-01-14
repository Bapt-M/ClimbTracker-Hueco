import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../database/entities/User';
import { Validation, ValidationStatus } from '../database/entities/Validation';
import { Comment } from '../database/entities/Comment';
import { Route, DifficultyColor } from '../database/entities/Route';

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

class UsersService {
  private userRepository: Repository<User>;
  private validationRepository: Repository<Validation>;
  private commentRepository: Repository<Comment>;
  private routeRepository: Repository<Route>;

  // Points de base par couleur de difficulté (échelle exponentielle x1.5 - aligné avec leaderboard)
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
    this.commentRepository = AppDataSource.getRepository(Comment);
    this.routeRepository = AppDataSource.getRepository(Route);
  }

  /**
   * Calcule le multiplicateur basé sur le nombre d'essais
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
   */
  private async calculateRouteDifficultyFactor(
    routeId: string,
    allValidations: Validation[]
  ): Promise<number> {
    const routeValidations = allValidations.filter(
      (v) => v.route.id === routeId && v.status === ValidationStatus.VALIDE
    );

    if (routeValidations.length < 3) {
      return 1.0;
    }

    const totalAttempts = routeValidations.reduce((sum, v) => sum + v.attempts, 0);
    const averageAttempts = totalAttempts / routeValidations.length;
    const flashCount = routeValidations.filter((v) => v.isFlashed).length;
    const flashRate = flashCount / routeValidations.length;
    const successCount = routeValidations.length;

    let difficultyFactor = 1.0;

    // Facteur basé sur le nombre de réussites
    if (successCount <= 2) {
      difficultyFactor *= 1.4;
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
      difficultyFactor *= 0.9;
    }

    // Facteur basé sur le nombre moyen d'essais
    if (averageAttempts >= 6) {
      difficultyFactor *= 1.3;
    } else if (averageAttempts >= 5) {
      difficultyFactor *= 1.2;
    } else if (averageAttempts >= 4) {
      difficultyFactor *= 1.1;
    } else if (averageAttempts >= 3) {
      difficultyFactor *= 1.0;
    } else {
      difficultyFactor *= 0.95;
    }

    // Facteur basé sur le taux de flash
    if (flashRate <= 0.05) {
      difficultyFactor *= 1.2;
    } else if (flashRate <= 0.1) {
      difficultyFactor *= 1.15;
    } else if (flashRate <= 0.2) {
      difficultyFactor *= 1.1;
    } else if (flashRate <= 0.3) {
      difficultyFactor *= 1.0;
    } else if (flashRate <= 0.5) {
      difficultyFactor *= 0.95;
    } else {
      difficultyFactor *= 0.9;
    }

    return Math.max(0.8, Math.min(2.0, difficultyFactor));
  }

  /**
   * Calcule les points pour une validation donnée
   * Formule : Points de base (GRADE) × Facteur difficulté voie × Multiplicateur d'essais
   */
  private async calculateValidationPoints(
    route: Route,
    validation: Validation,
    allValidations: Validation[]
  ): Promise<number> {
    if (validation.status !== ValidationStatus.VALIDE) {
      return 0;
    }

    const basePoints = this.DIFFICULTY_POINTS[route.difficulty];
    const routeDifficultyFactor = await this.calculateRouteDifficultyFactor(
      route.id,
      allValidations
    );
    const attemptsMultiplier = this.getAttemptsMultiplier(validation.attempts);

    return Math.round(basePoints * routeDifficultyFactor * attemptsMultiplier);
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
    // Check permissions
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
    if (data.name !== undefined) {
      user.name = data.name;
    }
    if (data.firstName !== undefined) {
      user.firstName = data.firstName;
    }
    if (data.lastName !== undefined) {
      user.lastName = data.lastName;
    }
    if (data.age !== undefined) {
      user.age = data.age;
    }
    if (data.height !== undefined) {
      user.height = data.height;
    }
    if (data.wingspan !== undefined) {
      user.wingspan = data.wingspan;
    }
    if (data.bio !== undefined) {
      user.bio = data.bio;
    }
    if (data.avatar !== undefined) {
      user.avatar = data.avatar;
    }
    if (data.profilePhoto !== undefined) {
      user.profilePhoto = data.profilePhoto;
    }
    if (data.additionalPhotos !== undefined) {
      user.additionalPhotos = data.additionalPhotos;
    }

    await this.userRepository.save(user);

    return this.getUserById(userId);
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<UserStats> {
    // Calculer la date limite (6 mois en arrière)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Count validations (des 6 derniers mois)
    const totalValidations = await this.validationRepository
      .createQueryBuilder('validation')
      .where('validation.userId = :userId', { userId })
      .andWhere('validation.validatedAt >= :sixMonthsAgo', { sixMonthsAgo })
      .getCount();

    // Count comments
    const totalComments = await this.commentRepository.count({
      where: { userId },
    });

    // Count routes created (if user is OPENER or ADMIN)
    const totalRoutesCreated = await this.routeRepository.count({
      where: { openerId: userId },
    });

    // Récupérer toutes les validations des 6 derniers mois (pour calculer les facteurs de difficulté)
    const allValidations = await this.validationRepository
      .createQueryBuilder('validation')
      .leftJoinAndSelect('validation.route', 'route')
      .where('validation.validatedAt >= :sixMonthsAgo', { sixMonthsAgo })
      .getMany();

    // Validations de l'utilisateur (des 6 derniers mois)
    const validations = await this.validationRepository
      .createQueryBuilder('validation')
      .leftJoinAndSelect('validation.route', 'route')
      .where('validation.userId = :userId', { userId })
      .andWhere('validation.validatedAt >= :sixMonthsAgo', { sixMonthsAgo })
      .getMany();

    // Calculate total points (avec la nouvelle formule async)
    let totalPoints = 0;
    const difficultyMap = new Map<string, { count: number; points: number }>();

    for (const v of validations) {
      if (v.route) {
        const difficulty = v.route.difficulty;
        const points = await this.calculateValidationPoints(v.route, v, allValidations);

        totalPoints += points;

        // Group by difficulty color
        if (difficultyMap.has(difficulty)) {
          const data = difficultyMap.get(difficulty)!;
          data.count++;
          data.points += points;
        } else {
          difficultyMap.set(difficulty, { count: 1, points });
        }
      }
    }

    const validationsByDifficulty = Array.from(difficultyMap.entries())
      .map(([difficulty, data]) => ({
        difficulty,
        count: data.count
      }))
      .sort((a, b) => {
        // Sort by difficulty order
        const difficultyOrder = Object.values(DifficultyColor);
        return difficultyOrder.indexOf(a.difficulty as DifficultyColor) -
               difficultyOrder.indexOf(b.difficulty as DifficultyColor);
      });

    // Create validationsByGrade (sorted by points descending, showing top grades)
    // Using difficulty as grade since there's no separate gradeLabel
    const validationsByGrade = Array.from(difficultyMap.entries())
      .map(([grade, data]) => ({
        grade,
        count: data.count,
        points: data.points
      }))
      .sort((a, b) => b.points - a.points); // Sort by total points per grade

    // Recent validations (last 5)
    const recentValidationsData = await this.validationRepository.find({
      where: { userId },
      relations: ['route'],
      order: { validatedAt: 'DESC' },
      take: 5,
    });

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

    // Recent comments (last 5)
    const recentCommentsData = await this.commentRepository.find({
      where: { userId },
      relations: ['route'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    const recentComments = recentCommentsData.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      route: {
        id: c.route.id,
        name: c.route.name,
      },
    }));

    return {
      totalValidations,
      totalComments,
      totalRoutesCreated,
      totalPoints,
      validationsByDifficulty,
      validationsByGrade,
      recentValidations,
      recentComments,
    };
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
    // Get all user validations with VALIDE status
    const validations = await this.validationRepository
      .createQueryBuilder('validation')
      .leftJoinAndSelect('validation.route', 'route')
      .where('validation.userId = :userId', { userId })
      .andWhere('validation.status = :status', {
        status: ValidationStatus.VALIDE,
      })
      .getMany();

    // Group validations by route types
    const typeMap = new Map<
      string,
      {
        total: number;
        completed: number;
        difficulties: DifficultyColor[];
      }
    >();

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
    const kiviatData: KiviatData[] = Array.from(typeMap.entries()).map(
      ([type, data]) => ({
        routeType: type,
        successRate: (data.completed / data.total) * 100,
        averageGrade: this.calculateAverageDifficulty(data.difficulties),
        totalAttempts: data.total,
        completedCount: data.completed,
      })
    );

    return kiviatData;
  }

  /**
   * Convert difficulty colors to numeric values for averaging
   */
  private calculateAverageDifficulty(difficulties: DifficultyColor[]): number {
    const difficultyValues: { [key in DifficultyColor]: number } = {
      [DifficultyColor.VERT]: 1,
      [DifficultyColor.VERT_CLAIR]: 1.5,
      [DifficultyColor.BLEU_CLAIR]: 2,
      [DifficultyColor.BLEU]: 3,
      [DifficultyColor.BLEU_FONCE]: 4,
      [DifficultyColor.JAUNE]: 5,
      [DifficultyColor.ORANGE_CLAIR]: 6,
      [DifficultyColor.ORANGE]: 7,
      [DifficultyColor.ORANGE_FONCE]: 8,
      [DifficultyColor.ROUGE]: 9,
      [DifficultyColor.VIOLET]: 10,
      [DifficultyColor.NOIR]: 12,
    };

    if (difficulties.length === 0) return 0;

    const sum = difficulties.reduce((acc, difficulty) => acc + (difficultyValues[difficulty] || 0), 0);
    return sum / difficulties.length;
  }
}

export default new UsersService();
