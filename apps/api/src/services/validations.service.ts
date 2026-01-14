import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Validation, ValidationStatus } from '../database/entities/Validation';
import { Route } from '../database/entities/Route';
import { pointsService } from './points.service';

export interface ValidationCreateInput {
  userId: string;
  routeId: string;
  personalNote?: string;
  status?: ValidationStatus;
  attempts?: number;
  isFlashed?: boolean;
  isFavorite?: boolean;
}

export interface ValidationUpdateInput {
  status?: ValidationStatus;
  attempts?: number;
  isFlashed?: boolean;
  isFavorite?: boolean;
  personalNote?: string;
}

export interface ValidationWithDetails extends Validation {
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  route?: {
    id: string;
    name: string;
    difficulty: string;
    holdColorHex: string;
    sector: string;
  };
}

class ValidationsService {
  private validationRepository: Repository<Validation>;
  private routeRepository: Repository<Route>;

  constructor() {
    this.validationRepository = AppDataSource.getRepository(Validation);
    this.routeRepository = AppDataSource.getRepository(Route);
  }

  /**
   * Create a validation (user validates a route)
   */
  async createValidation(data: ValidationCreateInput): Promise<Validation> {
    // Check if route exists
    const route = await this.routeRepository.findOne({
      where: { id: data.routeId },
    });

    if (!route) {
      throw new Error('Route not found');
    }

    // Check if validation already exists
    const existing = await this.validationRepository.findOne({
      where: {
        userId: data.userId,
        routeId: data.routeId,
      },
    });

    if (existing) {
      throw new Error('Validation already exists');
    }

    const validation = this.validationRepository.create({
      userId: data.userId,
      routeId: data.routeId,
      personalNote: data.personalNote,
      status: data.status || ValidationStatus.EN_PROJET,
      attempts: data.attempts || 1,
      isFlashed: data.isFlashed || false,
      isFavorite: data.isFavorite || false,
    });

    const saved = await this.validationRepository.save(validation);

    // Invalidate caches
    pointsService.invalidateDifficultyCache();

    return saved;
  }

  /**
   * Delete a validation (user invalidates a route)
   */
  async deleteValidation(userId: string, routeId: string): Promise<void> {
    const validation = await this.validationRepository.findOne({
      where: {
        userId,
        routeId,
      },
    });

    if (!validation) {
      throw new Error('Validation not found');
    }

    await this.validationRepository.remove(validation);

    // Invalidate caches
    pointsService.invalidateDifficultyCache();
  }

  /**
   * Get all validations for a specific route
   */
  async getRouteValidations(routeId: string): Promise<ValidationWithDetails[]> {
    const validations = await this.validationRepository.find({
      where: { routeId },
      relations: ['user'],
      order: { validatedAt: 'DESC' },
    });

    return validations.map((v) => ({
      ...v,
      user: v.user
        ? {
            id: v.user.id,
            name: v.user.name,
            email: v.user.email,
            avatar: v.user.avatar,
          }
        : undefined,
    }));
  }

  /**
   * Get all validations for a specific user
   */
  async getUserValidations(userId: string): Promise<ValidationWithDetails[]> {
    const validations = await this.validationRepository.find({
      where: { userId },
      relations: ['route', 'route.opener'],
      order: { validatedAt: 'DESC' },
    });

    return validations.map((v) => ({
      ...v,
      route: v.route
        ? {
            id: v.route.id,
            name: v.route.name,
            difficulty: v.route.difficulty,
            holdColorHex: v.route.holdColorHex,
            sector: v.route.sector,
          }
        : undefined,
    }));
  }

  /**
   * Check if a user has validated a route
   */
  async hasUserValidated(userId: string, routeId: string): Promise<boolean> {
    const validation = await this.validationRepository.findOne({
      where: { userId, routeId },
    });

    return !!validation;
  }

  /**
   * Get validation count for a route
   */
  async getRouteValidationCount(routeId: string): Promise<number> {
    return this.validationRepository.count({
      where: { routeId },
    });
  }

  /**
   * Get validation count for a user
   */
  async getUserValidationCount(userId: string): Promise<number> {
    return this.validationRepository.count({
      where: { userId },
    });
  }

  /**
   * Update validation (status, attempts, flags)
   * @param validationId - ID of the validation to update
   * @param userId - ID of the user making the request
   * @param updateData - Fields to update
   */
  async updateValidation(
    validationId: string,
    userId: string,
    updateData: ValidationUpdateInput
  ): Promise<Validation> {
    const validation = await this.validationRepository.findOne({
      where: { id: validationId },
      relations: ['user', 'route'],
    });

    if (!validation) {
      throw new Error('Validation not found');
    }

    // Check if the user owns this validation
    if (validation.userId !== userId) {
      throw new Error('Unauthorized: You can only update your own validations');
    }

    // Update fields
    if (updateData.status !== undefined) {
      validation.status = updateData.status;
    }
    if (updateData.attempts !== undefined) {
      validation.attempts = updateData.attempts;
    }
    if (updateData.isFlashed !== undefined) {
      validation.isFlashed = updateData.isFlashed;
    }
    if (updateData.isFavorite !== undefined) {
      validation.isFavorite = updateData.isFavorite;
    }
    if (updateData.personalNote !== undefined) {
      validation.personalNote = updateData.personalNote;
    }

    const saved = await this.validationRepository.save(validation);

    // Invalidate caches
    pointsService.invalidateDifficultyCache();

    return saved;
  }

  /**
   * Update validation by ID (simplified interface)
   * @param validationId - ID of the validation to update
   * @param updateData - Fields to update
   */
  async updateValidationById(
    validationId: string,
    updateData: ValidationUpdateInput
  ): Promise<Validation> {
    const validation = await this.validationRepository.findOne({
      where: { id: validationId },
      relations: ['user', 'route'],
    });

    if (!validation) {
      throw new Error('Validation not found');
    }

    // Update fields
    if (updateData.status !== undefined) {
      validation.status = updateData.status;
    }
    if (updateData.attempts !== undefined) {
      validation.attempts = updateData.attempts;
    }
    if (updateData.isFlashed !== undefined) {
      validation.isFlashed = updateData.isFlashed;
    }
    if (updateData.isFavorite !== undefined) {
      validation.isFavorite = updateData.isFavorite;
    }
    if (updateData.personalNote !== undefined) {
      validation.personalNote = updateData.personalNote;
    }

    const saved = await this.validationRepository.save(validation);

    // Invalidate caches
    pointsService.invalidateDifficultyCache();

    return saved;
  }

  /**
   * Update validation status (for legacy endpoint)
   * @param validationId - ID of the validation to update
   * @param userId - ID of the user making the request
   * @param attemptStatus - New status to set
   */
  async updateValidationStatus(
    validationId: string,
    userId: string,
    attemptStatus: ValidationStatus
  ): Promise<Validation> {
    const validation = await this.validationRepository.findOne({
      where: { id: validationId },
      relations: ['user', 'route'],
    });

    if (!validation) {
      throw new Error('Validation not found');
    }

    // Check if the user owns this validation
    if (validation.userId !== userId) {
      throw new Error('Unauthorized: You can only update your own validations');
    }

    validation.status = attemptStatus;
    const saved = await this.validationRepository.save(validation);

    // Invalidate caches
    pointsService.invalidateDifficultyCache();

    return saved;
  }

  /**
   * Get the number of users who completed a specific route
   * @param routeId - ID of the route
   * @returns Count of completed validations (VALIDE status)
   */
  async getRouteCompletionCount(routeId: string): Promise<number> {
    // Check if route exists
    const route = await this.routeRepository.findOne({
      where: { id: routeId },
    });

    if (!route) {
      throw new Error('Route not found');
    }

    // Count validations with VALIDE status
    const count = await this.validationRepository.count({
      where: { routeId, status: ValidationStatus.VALIDE },
    });

    return count;
  }

  /**
   * Get validation statistics by status for a route
   * @param routeId - ID of the route
   */
  async getRouteValidationStats(routeId: string): Promise<{
    total: number;
    validated: number;
    enProjet: number;
    flashRate: number;
  }> {
    const validations = await this.validationRepository.find({
      where: { routeId },
    });

    const validated = validations.filter(v => v.status === ValidationStatus.VALIDE).length;
    const enProjet = validations.filter(v => v.status === ValidationStatus.EN_PROJET).length;
    const flashed = validations.filter(v => v.isFlashed).length;
    const flashRate = validated > 0 ? (flashed / validated) * 100 : 0;

    return {
      total: validations.length,
      validated,
      enProjet,
      flashRate,
    };
  }

  /**
   * Get a validation by ID
   * @param validationId - ID of the validation
   */
  async getValidationById(validationId: string): Promise<Validation | null> {
    return this.validationRepository.findOne({
      where: { id: validationId },
    });
  }

  /**
   * Delete a validation by ID
   * @param validationId - ID of the validation to delete
   */
  async deleteValidationById(validationId: string): Promise<void> {
    const validation = await this.validationRepository.findOne({
      where: { id: validationId },
    });

    if (!validation) {
      throw new Error('Validation not found');
    }

    await this.validationRepository.remove(validation);

    // Invalidate caches
    pointsService.invalidateDifficultyCache();
  }
}

export default new ValidationsService();
