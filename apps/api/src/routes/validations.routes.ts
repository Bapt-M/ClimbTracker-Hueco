import { Router } from 'express';
import validationsController from '../controllers/validations.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createValidationSchema, updateValidationStatusSchema } from '../validators/validations.validators';

const router = Router();

// GET /api/validations/user - Get current user's validations (authenticated)
router.get(
  '/validations/user',
  authenticate,
  validationsController.getCurrentUserValidations
);

// POST /api/validations - Create validation (authenticated)
router.post(
  '/validations',
  authenticate,
  validate(createValidationSchema),
  validationsController.createValidationDirect
);

// DELETE /api/validations/:validationId - Delete validation by ID (authenticated)
router.delete(
  '/validations/:validationId',
  authenticate,
  validationsController.deleteValidationById
);

// POST /api/routes/:routeId/validate - Create validation (authenticated)
router.post(
  '/routes/:routeId/validate',
  authenticate,
  validate(createValidationSchema),
  validationsController.createValidation
);

// DELETE /api/routes/:routeId/validate - Delete validation (authenticated)
router.delete(
  '/routes/:routeId/validate',
  authenticate,
  validationsController.deleteValidation
);

// GET /api/routes/:routeId/validations - Get all validations for a route (public)
router.get(
  '/routes/:routeId/validations',
  validationsController.getRouteValidations
);

// GET /api/users/:userId/validations - Get all validations for a user (public)
router.get(
  '/users/:userId/validations',
  validationsController.getUserValidations
);

// GET /api/routes/:routeId/validate/check - Check if current user has validated (authenticated)
router.get(
  '/routes/:routeId/validate/check',
  authenticate,
  validationsController.checkUserValidation
);

// PUT /api/validations/:validationId/status - Update validation status (authenticated)
router.put(
  '/validations/:validationId/status',
  authenticate,
  validate(updateValidationStatusSchema),
  validationsController.updateValidationStatus
);

// GET /api/routes/:routeId/completion-count - Get route completion count (public)
router.get(
  '/routes/:routeId/completion-count',
  validationsController.getRouteCompletionCount
);

// GET /api/routes/:routeId/validation-stats - Get validation stats by status (public)
router.get(
  '/routes/:routeId/validation-stats',
  validationsController.getRouteValidationStats
);

export default router;
