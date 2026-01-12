import { Request, Response } from 'express';
import commentsService from '../services/comments.service';

class CommentsController {
  /**
   * POST /api/routes/:routeId/comments
   * Create a comment on a route
   */
  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;
      const userId = req.user!.id;
      const { content, mediaUrl, mediaType } = req.body;

      const comment = await commentsService.createComment({
        content,
        userId,
        routeId,
        mediaUrl,
        mediaType,
      });

      res.status(201).json(comment);
    } catch (error: any) {
      if (error.message === 'Route not found') {
        res.status(404).json({ message: error.message });
      } else {
        console.error('Create comment error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * PUT /api/comments/:commentId
   * Update a comment
   */
  async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;
      const { content, mediaUrl, mediaType } = req.body;

      const comment = await commentsService.updateComment(
        commentId,
        userId,
        userRole,
        { content, mediaUrl, mediaType }
      );

      res.json(comment);
    } catch (error: any) {
      if (error.message === 'Comment not found') {
        res.status(404).json({ message: error.message });
      } else if (error.message === 'Unauthorized') {
        res.status(403).json({ message: error.message });
      } else {
        console.error('Update comment error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * DELETE /api/comments/:commentId
   * Delete a comment
   */
  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      await commentsService.deleteComment(commentId, userId, userRole);

      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Comment not found') {
        res.status(404).json({ message: error.message });
      } else if (error.message === 'Unauthorized') {
        res.status(403).json({ message: error.message });
      } else {
        console.error('Delete comment error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * GET /api/routes/:routeId/comments
   * Get all comments for a route with pagination
   */
  async getRouteComments(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await commentsService.getRouteComments(routeId, {
        page,
        limit,
      });

      res.json(result);
    } catch (error: any) {
      console.error('Get route comments error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new CommentsController();
