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
  validationsByDifficulty: { difficulty: string; gradeLabel: string; count: number }[];
  recentValidations: {
    id: string;
    validatedAt: Date;
    route: {
      id: string;
      name: string;
      difficulty: string;
      gradeLabel: string;
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
    // Count validations
    const totalValidations = await this.validationRepository.count({
      where: { userId },
    });

    // Count comments
    const totalComments = await this.commentRepository.count({
      where: { userId },
    });

    // Count routes created (if user is OPENER or ADMIN)
    const totalRoutesCreated = await this.routeRepository.count({
      where: { openerId: userId },
    });

    // Validations by difficulty
    const validations = await this.validationRepository.find({
      where: { userId },
      relations: ['route'],
    });

    const difficultyMap = new Map<string, { gradeLabel: string; count: number }>();
    validations.forEach((v) => {
      if (v.route) {
        const difficulty = v.route.difficulty;
        const gradeLabel = v.route.gradeLabel;
        if (difficultyMap.has(difficulty)) {
          difficultyMap.get(difficulty)!.count++;
        } else {
          difficultyMap.set(difficulty, { gradeLabel, count: 1 });
        }
      }
    });

    const validationsByDifficulty = Array.from(difficultyMap.entries())
      .map(([difficulty, data]) => ({ difficulty, gradeLabel: data.gradeLabel, count: data.count }))
      .sort((a, b) => {
        // Sort by difficulty order
        const difficultyOrder = Object.values(DifficultyColor);
        return difficultyOrder.indexOf(a.difficulty as DifficultyColor) - difficultyOrder.indexOf(b.difficulty as DifficultyColor);
      });

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
        gradeLabel: v.route.gradeLabel,
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
      validationsByDifficulty,
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
