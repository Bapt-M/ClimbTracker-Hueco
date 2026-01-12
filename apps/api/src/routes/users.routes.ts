import { Router } from 'express';
import usersController from '../controllers/users.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateUserSchema } from '../validators/users.validators';

const router = Router();

// GET /api/users - Get all users (admin only)
router.get('/users', authenticate, authorize('ADMIN'), usersController.getAllUsers);

// GET /api/users/:userId - Get user profile (public)
router.get('/users/:userId', usersController.getUserProfile);

// PUT /api/users/:userId - Update user profile (authenticated, owner or admin)
router.put(
  '/users/:userId',
  authenticate,
  validate(updateUserSchema),
  usersController.updateUserProfile
);

// GET /api/users/:userId/stats - Get user stats (public)
router.get('/users/:userId/stats', usersController.getUserStats);

// GET /api/users/:userId/kiviat-data - Get user Kiviat chart data (public)
router.get('/users/:userId/kiviat-data', usersController.getUserKiviatData);

export default router;
