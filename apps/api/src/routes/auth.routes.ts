import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../validators/auth.validators';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/logout', authenticate, authController.logout);

export default router;
