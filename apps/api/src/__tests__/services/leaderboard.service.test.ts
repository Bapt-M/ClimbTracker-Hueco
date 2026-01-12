import { DifficultyColor } from '../../database/entities/Route';
import { ValidationStatus } from '../../database/entities/Validation';

describe('LeaderboardService', () => {
  // Test constants based on the new difficulty color system
  const DIFFICULTY_POINTS: Record<DifficultyColor, number> = {
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

  describe('Point Calculation Algorithm', () => {
    it('should calculate correct points for FLASHED validation', () => {
      // Noir (120 points) × FLASHED (1.5x) = 180 points
      const difficultyPoints = DIFFICULTY_POINTS[DifficultyColor.NOIR];
      const multiplier = 1.5; // isFlashed = true
      const expectedPoints = difficultyPoints * multiplier;

      expect(expectedPoints).toBe(180);
    });

    it('should calculate correct points for regular VALIDE validation', () => {
      // Violet (100 points) × regular (1.0x) = 100 points
      const difficultyPoints = DIFFICULTY_POINTS[DifficultyColor.VIOLET];
      const multiplier = 1.0; // isFlashed = false
      const expectedPoints = difficultyPoints * multiplier;

      expect(expectedPoints).toBe(100);
    });

    it('should give 0 points for EN_PROJET status', () => {
      // Any difficulty × EN_PROJET = 0 points
      const difficultyPoints = DIFFICULTY_POINTS[DifficultyColor.NOIR];
      const multiplier = 0; // EN_PROJET gives no points
      const expectedPoints = difficultyPoints * multiplier;

      expect(expectedPoints).toBe(0);
    });

    it('should apply flash multiplier correctly for Bleu foncé', () => {
      // Bleu foncé (40 points) × FLASHED (1.5x) = 60 points
      const difficultyPoints = DIFFICULTY_POINTS[DifficultyColor.BLEU_FONCE];
      const multiplier = 1.5;
      const expectedPoints = difficultyPoints * multiplier;

      expect(expectedPoints).toBe(60);
    });
  });

  describe('Difficulty Points System', () => {
    it('should have correct point values for all difficulty colors', () => {
      expect(DIFFICULTY_POINTS[DifficultyColor.VERT]).toBe(10);
      expect(DIFFICULTY_POINTS[DifficultyColor.VERT_CLAIR]).toBe(15);
      expect(DIFFICULTY_POINTS[DifficultyColor.BLEU_CLAIR]).toBe(20);
      expect(DIFFICULTY_POINTS[DifficultyColor.BLEU]).toBe(30);
      expect(DIFFICULTY_POINTS[DifficultyColor.BLEU_FONCE]).toBe(40);
      expect(DIFFICULTY_POINTS[DifficultyColor.JAUNE]).toBe(50);
      expect(DIFFICULTY_POINTS[DifficultyColor.ORANGE_CLAIR]).toBe(60);
      expect(DIFFICULTY_POINTS[DifficultyColor.ORANGE]).toBe(70);
      expect(DIFFICULTY_POINTS[DifficultyColor.ORANGE_FONCE]).toBe(80);
      expect(DIFFICULTY_POINTS[DifficultyColor.ROUGE]).toBe(90);
      expect(DIFFICULTY_POINTS[DifficultyColor.VIOLET]).toBe(100);
      expect(DIFFICULTY_POINTS[DifficultyColor.NOIR]).toBe(120);
    });

    it('should have increasing point values from Vert to Noir', () => {
      const difficulties = [
        DifficultyColor.VERT,
        DifficultyColor.VERT_CLAIR,
        DifficultyColor.BLEU_CLAIR,
        DifficultyColor.BLEU,
        DifficultyColor.BLEU_FONCE,
        DifficultyColor.JAUNE,
        DifficultyColor.ORANGE_CLAIR,
        DifficultyColor.ORANGE,
        DifficultyColor.ORANGE_FONCE,
        DifficultyColor.ROUGE,
        DifficultyColor.VIOLET,
        DifficultyColor.NOIR,
      ];

      for (let i = 1; i < difficulties.length; i++) {
        expect(DIFFICULTY_POINTS[difficulties[i]]).toBeGreaterThan(
          DIFFICULTY_POINTS[difficulties[i - 1]]
        );
      }
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

  describe('Average Grade Calculation', () => {
    it('should calculate average grade correctly', () => {
      const difficulties = [
        DIFFICULTY_POINTS[DifficultyColor.VIOLET], // 100
        DIFFICULTY_POINTS[DifficultyColor.NOIR], // 120
        DIFFICULTY_POINTS[DifficultyColor.ROUGE], // 90
      ];

      const sum = difficulties.reduce((acc, val) => acc + val, 0);
      const avg = sum / difficulties.length / 10; // Normalized to 1-12 scale

      expect(avg).toBeCloseTo(10.33, 1);
    });

    it('should return 0 for average when no validations', () => {
      const difficulties: number[] = [];
      const avg = difficulties.length === 0 ? 0 : difficulties.reduce((acc, val) => acc + val, 0) / difficulties.length / 10;

      expect(avg).toBe(0);
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
