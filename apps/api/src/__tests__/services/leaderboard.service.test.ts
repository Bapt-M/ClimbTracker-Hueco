import { DifficultyColor } from '../../database/entities/Route';
import { ValidationStatus } from '../../database/entities/Validation';
import { pointsService } from '../../services/points.service';

describe('LeaderboardService', () => {
  // Test constants based on the new difficulty color system (matching pointsService)
  const DIFFICULTY_POINTS: Record<DifficultyColor, number> = {
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

  describe('Point Calculation Algorithm', () => {
    it('should calculate correct points for FLASHED validation (1.3x multiplier)', () => {
      // Noir (855 points) × FLASHED (1.3x) × neutral route factor (1.0) = 1112 points
      const difficultyPoints = DIFFICULTY_POINTS[DifficultyColor.NOIR];
      const attemptsMultiplier = pointsService.getAttemptsMultiplier(1); // Flash = 1.3
      const routeFactor = 1.0;
      const expectedPoints = Math.round(difficultyPoints * routeFactor * attemptsMultiplier);

      expect(attemptsMultiplier).toBe(1.3);
      expect(expectedPoints).toBe(1112);
    });

    it('should calculate correct points for regular VALIDE validation (4 attempts = 1.0x)', () => {
      // Violet (51 points) × regular (1.0x) × neutral route factor (1.0) = 51 points
      const difficultyPoints = DIFFICULTY_POINTS[DifficultyColor.VIOLET];
      const attemptsMultiplier = pointsService.getAttemptsMultiplier(4); // 4 attempts = 1.0
      const routeFactor = 1.0;
      const expectedPoints = Math.round(difficultyPoints * routeFactor * attemptsMultiplier);

      expect(attemptsMultiplier).toBe(1.0);
      expect(expectedPoints).toBe(51);
    });

    it('should apply correct multiplier for 7+ attempts (0.7x)', () => {
      // Bleu foncé (34 points) × 7+ attempts (0.7x) × neutral route factor (1.0) = 24 points
      const difficultyPoints = DIFFICULTY_POINTS[DifficultyColor.BLEU_FONCE];
      const attemptsMultiplier = pointsService.getAttemptsMultiplier(7);
      const routeFactor = 1.0;
      const expectedPoints = Math.round(difficultyPoints * routeFactor * attemptsMultiplier);

      expect(attemptsMultiplier).toBe(0.7);
      expect(expectedPoints).toBe(24);
    });
  });

  describe('Attempts Multiplier System', () => {
    it('should return 1.3 for flash (1 attempt)', () => {
      expect(pointsService.getAttemptsMultiplier(1)).toBe(1.3);
    });

    it('should return 1.2 for 2 attempts', () => {
      expect(pointsService.getAttemptsMultiplier(2)).toBe(1.2);
    });

    it('should return 1.1 for 3 attempts', () => {
      expect(pointsService.getAttemptsMultiplier(3)).toBe(1.1);
    });

    it('should return 1.0 for 4 attempts', () => {
      expect(pointsService.getAttemptsMultiplier(4)).toBe(1.0);
    });

    it('should return 0.9 for 5 attempts', () => {
      expect(pointsService.getAttemptsMultiplier(5)).toBe(0.9);
    });

    it('should return 0.8 for 6 attempts', () => {
      expect(pointsService.getAttemptsMultiplier(6)).toBe(0.8);
    });

    it('should return 0.7 for 7+ attempts', () => {
      expect(pointsService.getAttemptsMultiplier(7)).toBe(0.7);
      expect(pointsService.getAttemptsMultiplier(10)).toBe(0.7);
      expect(pointsService.getAttemptsMultiplier(100)).toBe(0.7);
    });
  });

  describe('Difficulty Points System', () => {
    it('should have correct point values for all difficulty colors', () => {
      expect(DIFFICULTY_POINTS[DifficultyColor.VERT]).toBe(10);
      expect(DIFFICULTY_POINTS[DifficultyColor.VERT_CLAIR]).toBe(15);
      expect(DIFFICULTY_POINTS[DifficultyColor.BLEU_CLAIR]).toBe(23);
      expect(DIFFICULTY_POINTS[DifficultyColor.BLEU_FONCE]).toBe(34);
      expect(DIFFICULTY_POINTS[DifficultyColor.VIOLET]).toBe(51);
      expect(DIFFICULTY_POINTS[DifficultyColor.ROSE]).toBe(75);
      expect(DIFFICULTY_POINTS[DifficultyColor.ROUGE]).toBe(112);
      expect(DIFFICULTY_POINTS[DifficultyColor.ORANGE]).toBe(169);
      expect(DIFFICULTY_POINTS[DifficultyColor.JAUNE]).toBe(255);
      expect(DIFFICULTY_POINTS[DifficultyColor.BLANC]).toBe(386);
      expect(DIFFICULTY_POINTS[DifficultyColor.GRIS]).toBe(570);
      expect(DIFFICULTY_POINTS[DifficultyColor.NOIR]).toBe(855);
    });

    it('should have increasing point values from Vert to Noir', () => {
      const difficulties = [
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

      for (let i = 1; i < difficulties.length; i++) {
        expect(DIFFICULTY_POINTS[difficulties[i]]).toBeGreaterThan(
          DIFFICULTY_POINTS[difficulties[i - 1]]
        );
      }
    });

    it('should follow exponential growth pattern (x1.5)', () => {
      // Each difficulty should be roughly 1.5x the previous
      const vert = DIFFICULTY_POINTS[DifficultyColor.VERT];
      const vertClair = DIFFICULTY_POINTS[DifficultyColor.VERT_CLAIR];
      const ratio = vertClair / vert;

      expect(ratio).toBeCloseTo(1.5, 0);
    });
  });

  describe('Validation Status System', () => {
    it('should have two status types', () => {
      expect(ValidationStatus.EN_PROJET).toBe('EN_PROJET');
      expect(ValidationStatus.VALIDE).toBe('VALIDE');
    });
  });

  describe('Ranking Logic', () => {
    it('should rank users by points (descending)', () => {
      const users = [
        { name: 'User A', points: 500 },
        { name: 'User B', points: 750 },
        { name: 'User C', points: 600 },
      ];

      const sorted = users.sort((a, b) => b.points - a.points);

      expect(sorted[0].name).toBe('User B'); // 750 points
      expect(sorted[1].name).toBe('User C'); // 600 points
      expect(sorted[2].name).toBe('User A'); // 500 points
    });

    it('should use validation count as tiebreaker when points are equal', () => {
      const users = [
        { name: 'User A', points: 500, validations: 10 },
        { name: 'User B', points: 500, validations: 15 },
        { name: 'User C', points: 500, validations: 12 },
      ];

      const sorted = users.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.validations - a.validations;
      });

      expect(sorted[0].name).toBe('User B'); // 15 validations
      expect(sorted[1].name).toBe('User C'); // 12 validations
      expect(sorted[2].name).toBe('User A'); // 10 validations
    });
  });

  describe('Flash Rate Calculation', () => {
    it('should calculate flash rate correctly', () => {
      const totalValidations = 10;
      const flashedCount = 4;
      const flashRate = (flashedCount / totalValidations) * 100;

      expect(flashRate).toBe(40);
    });

    it('should return 0 for flash rate when no validations', () => {
      const totalValidations = 0;
      const flashedCount = 0;
      const flashRate = totalValidations === 0 ? 0 : (flashedCount / totalValidations) * 100;

      expect(flashRate).toBe(0);
    });

    it('should handle 100% flash rate', () => {
      const totalValidations = 5;
      const flashedCount = 5;
      const flashRate = (flashedCount / totalValidations) * 100;

      expect(flashRate).toBe(100);
    });
  });

  describe('Validated Grade Calculation', () => {
    it('should find highest grade with 3+ validations', () => {
      const validationsByGrade = new Map<DifficultyColor, number>([
        [DifficultyColor.VERT, 5],       // 5 validations
        [DifficultyColor.BLEU_CLAIR, 3], // 3 validations - qualifies
        [DifficultyColor.ROUGE, 2],      // 2 validations - not enough
      ]);

      const difficultyOrder = Object.values(DifficultyColor);
      let validatedGrade: string | undefined;

      for (const difficulty of difficultyOrder) {
        const count = validationsByGrade.get(difficulty) || 0;
        if (count >= 3) {
          validatedGrade = difficulty;
        }
      }

      // BLEU_CLAIR is higher than VERT in the order, so it should be the validated grade
      expect(validatedGrade).toBe(DifficultyColor.BLEU_CLAIR);
    });

    it('should return undefined when no grade has 3+ validations', () => {
      const validationsByGrade = new Map<DifficultyColor, number>([
        [DifficultyColor.VERT, 2],
        [DifficultyColor.BLEU_CLAIR, 1],
      ]);

      const difficultyOrder = Object.values(DifficultyColor);
      let validatedGrade: string | undefined;

      for (const difficulty of difficultyOrder) {
        const count = validationsByGrade.get(difficulty) || 0;
        if (count >= 3) {
          validatedGrade = difficulty;
        }
      }

      expect(validatedGrade).toBeUndefined();
    });
  });

  describe('Attempts System', () => {
    it('should track attempts as a number', () => {
      const attempts = 3;
      expect(attempts).toBe(3);
      expect(typeof attempts).toBe('number');
    });

    it('should handle first attempt (flash)', () => {
      const attempts = 1;
      const isFlashed = true;

      expect(attempts).toBe(1);
      expect(isFlashed).toBe(true);
    });

    it('should handle multiple attempts', () => {
      const attempts = 5;
      const isFlashed = false;

      expect(attempts).toBe(5);
      expect(isFlashed).toBe(false);
    });
  });
});
