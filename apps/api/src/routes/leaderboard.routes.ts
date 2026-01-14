import { Router } from 'express';
import { leaderboardController } from '../controllers/leaderboard.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { leaderboardQuerySchema } from '../validators/leaderboard.validators';

const router = Router();

// Protected routes - require authentication
router.get(
  '/',
  authenticate,
  validate(leaderboardQuerySchema, 'query'),
  leaderboardController.getLeaderboard
);

router.get('/current-user', authenticate, leaderboardController.getCurrentUserRank);

router.get('/user/:userId/details', authenticate, leaderboardController.getUserValidationDetails);

export default router;
