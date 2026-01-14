/**
 * Shared points calculation service
 * Used by both leaderboard and user stats
 */

import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Validation, ValidationStatus } from '../database/entities/Validation';
import { Route, DifficultyColor } from '../database/entities/Route';
import { cacheService, CACHE_KEYS, CACHE_TTL } from './cache.service';

export interface RouteDifficultyStats {
  routeId: string;
  validationCount: number;
  avgAttempts: number;
  flashRate: number;
  difficultyFactor: number;
}

class PointsService {
  private validationRepository: Repository<Validation>;

  // Points de base par couleur de difficulté (échelle exponentielle x1.5)
  readonly DIFFICULTY_POINTS: Record<DifficultyColor, number> = {
    [DifficultyColor.VERT]: 10,
    [DifficultyColor.VERT_CLAIR]: 15,
    [DifficultyColor.BLEU_CLAIR]: 23,
    [DifficultyColor.BLEU_FONCE]: 34,
    [DifficultyColor.VIOLET]: 51,
    [DifficultyColor.ROSE]: 75,
    [DifficultyColor.ROUGE]: 112,
    [DifficultyColor.ORANGE]: 169,
    [DifficultyColor.JAUNE]: 255,
    [DifficultyColor.BLANC]: 386,
    [DifficultyColor.GRIS]: 570,
    [DifficultyColor.NOIR]: 855,
  };

  constructor() {
    this.validationRepository = AppDataSource.getRepository(Validation);
  }

  /**
   * Calcule le multiplicateur basé sur le nombre d'essais
   */
  getAttemptsMultiplier(attempts: number): number {
    if (attempts === 1) return 1.3;   // Flash
    if (attempts === 2) return 1.2;   // Excellent
    if (attempts === 3) return 1.1;   // Très bien
    if (attempts === 4) return 1.0;   // Bien
    if (attempts === 5) return 0.9;   // Acceptable
    if (attempts === 6) return 0.8;   // Moyen
    return 0.7;                        // Laborieux (7+)
  }

  /**
   * Récupère les facteurs de difficulté pour toutes les voies (avec cache)
   * Cette méthode fait UNE seule requête SQL agrégée au lieu de N requêtes
   */
  async getRouteDifficultyFactors(): Promise<Map<string, number>> {
    // Check cache first
    const cached = cacheService.get<Map<string, number>>(CACHE_KEYS.ROUTE_DIFFICULTY_FACTORS);
    if (cached) {
      return cached;
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Requête SQL agrégée - une seule requête pour toutes les stats
    const stats = await this.validationRepository
      .createQueryBuilder('v')
      .select('v.routeId', 'routeId')
      .addSelect('COUNT(*)', 'validationCount')
      .addSelect('AVG(v.attempts)', 'avgAttempts')
      .addSelect('SUM(CASE WHEN v.isFlashed = true THEN 1 ELSE 0 END)::float / COUNT(*)', 'flashRate')
      .where('v.status = :status', { status: ValidationStatus.VALIDE })
      .andWhere('v.validatedAt >= :sixMonthsAgo', { sixMonthsAgo })
      .groupBy('v.routeId')
      .getRawMany<{
        routeId: string;
        validationCount: string;
        avgAttempts: string;
        flashRate: string;
      }>();

    const factorsMap = new Map<string, number>();

    for (const stat of stats) {
      const validationCount = parseInt(stat.validationCount);
      const avgAttempts = parseFloat(stat.avgAttempts);
      const flashRate = parseFloat(stat.flashRate);

      // Si moins de 3 validations, facteur neutre
      if (validationCount < 3) {
        factorsMap.set(stat.routeId, 1.0);
        continue;
      }

      let difficultyFactor = 1.0;

      // Facteur basé sur le nombre de réussites (0.9 à 1.4)
      if (validationCount <= 2) {
        difficultyFactor *= 1.4;
      } else if (validationCount <= 5) {
        difficultyFactor *= 1.3;
      } else if (validationCount <= 10) {
        difficultyFactor *= 1.2;
      } else if (validationCount <= 20) {
        difficultyFactor *= 1.1;
      } else if (validationCount <= 30) {
        difficultyFactor *= 1.0;
      } else if (validationCount <= 50) {
        difficultyFactor *= 0.95;
      } else {
        difficultyFactor *= 0.9;
      }

      // Facteur basé sur le nombre moyen d'essais (0.95 à 1.3)
      if (avgAttempts >= 6) {
        difficultyFactor *= 1.3;
      } else if (avgAttempts >= 5) {
        difficultyFactor *= 1.2;
      } else if (avgAttempts >= 4) {
        difficultyFactor *= 1.1;
      } else if (avgAttempts >= 3) {
        difficultyFactor *= 1.0;
      } else {
        difficultyFactor *= 0.95;
      }

      // Facteur basé sur le taux de flash (0.9 à 1.2)
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

      // Limiter entre 0.8 et 2.0
      factorsMap.set(stat.routeId, Math.max(0.8, Math.min(2.0, difficultyFactor)));
    }

    // Cache for 5 minutes
    cacheService.set(CACHE_KEYS.ROUTE_DIFFICULTY_FACTORS, factorsMap, CACHE_TTL.ROUTE_DIFFICULTY);

    return factorsMap;
  }

  /**
   * Calcule les points pour une validation
   */
  calculatePoints(
    difficulty: DifficultyColor,
    routeDifficultyFactor: number,
    attempts: number
  ): number {
    const basePoints = this.DIFFICULTY_POINTS[difficulty] || 0;
    const attemptsMultiplier = this.getAttemptsMultiplier(attempts);
    return Math.round(basePoints * routeDifficultyFactor * attemptsMultiplier);
  }

  /**
   * Invalide le cache des facteurs de difficulté
   * À appeler quand une validation est créée/modifiée/supprimée
   */
  invalidateDifficultyCache(): void {
    cacheService.delete(CACHE_KEYS.ROUTE_DIFFICULTY_FACTORS);
    cacheService.deletePattern('leaderboard:*');
    cacheService.deletePattern('user:stats:*');
    cacheService.deletePattern('user:rank:*');
  }
}

export const pointsService = new PointsService();
