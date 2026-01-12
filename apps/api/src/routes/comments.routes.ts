import { Router } from 'express';
import commentsController from '../controllers/comments.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createCommentSchema,
  updateCommentSchema,
} from '../validators/comments.validators';

const router = Router();

// POST /api/routes/:routeId/comments - Create comment (authenticated)
router.post(
  '/routes/:routeId/comments',
  authenticate,
  validate(createCommentSchema),
  commentsController.createComment
);

// PUT /api/comments/:commentId - Update comment (authenticated, owner or admin)
router.put(
  '/comments/:commentId',
  authenticate,
  validate(updateCommentSchema),
  commentsController.updateComment
);

// DELETE /api/comments/:commentId - Delete comment (authenticated, owner or admin)
router.delete(
  '/comments/:commentId',
  authenticate,
  commentsController.deleteComment
);

// GET /api/routes/:routeId/comments - Get all comments for a route (public)
router.get('/routes/:routeId/comments', commentsController.getRouteComments);

export default router;
