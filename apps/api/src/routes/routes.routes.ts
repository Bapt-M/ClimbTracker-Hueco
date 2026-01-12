import { Router } from 'express';
import { routesController } from '../controllers/routes.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../database/entities/User';
import {
  createRouteSchema,
  updateRouteSchema,
  updateRouteStatusSchema,
  routeFiltersSchema,
} from '../validators/routes.validators';

const router = Router();

// Public routes (require authentication but all roles can access)
router.get('/', authenticate, validate(routeFiltersSchema), routesController.getRoutes);
router.get('/stats', authenticate, routesController.getRoutesStats);
router.get('/:id', authenticate, routesController.getRouteById);

// OPENER+ routes (require OPENER or ADMIN role)
router.post(
  '/',
  authenticate,
  authorize(UserRole.OPENER, UserRole.ADMIN),
  validate(createRouteSchema),
  routesController.createRoute
);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.OPENER, UserRole.ADMIN),
  validate(updateRouteSchema),
  routesController.updateRoute
);

// ADMIN only routes
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  routesController.deleteRoute
);

router.put(
  '/:id/status',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateRouteStatusSchema),
  routesController.updateRouteStatus
);

export default router;
