import { Request, Response } from 'express';
import validationsService from '../services/validations.service';

class ValidationsController {
  /**
   * GET /api/validations/user
   * Get all validations for the current authenticated user
   */
  async getCurrentUserValidations(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const validations = await validationsService.getUserValidations(userId);

      res.json(validations);
    } catch (error: any) {
      console.error('Get current user validations error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * POST /api/validations
   * Create a validation directly (with routeId in body)
   */
  async createValidationDirect(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { routeId, personalNote, attemptStatus } = req.body;

      const validation = await validationsService.createValidation({
        userId,
        routeId,
        personalNote,
        attemptStatus,
      });

      res.status(201).json(validation);
    } catch (error: any) {
      if (error.message === 'Route not found') {
        res.status(404).json({ message: error.message });
      } else if (error.message === 'Validation already exists') {
        res.status(409).json({ message: error.message });
      } else {
        console.error('Create validation direct error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * POST /api/routes/:routeId/validate
   * Create a validation
   */
  async createValidation(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;
      const userId = req.user!.id;
      const { personalNote, attemptStatus } = req.body;

      const validation = await validationsService.createValidation({
        userId,
        routeId,
        personalNote,
        attemptStatus,
      });

      res.status(201).json(validation);
    } catch (error: any) {
      if (error.message === 'Route not found') {
        res.status(404).json({ message: error.message });
      } else if (error.message === 'Validation already exists') {
        res.status(409).json({ message: error.message });
      } else {
        console.error('Create validation error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * PUT /api/validations/:validationId
   * Update a validation by ID
   */
  async updateValidationById(req: Request, res: Response): Promise<void> {
    try {
      const { validationId } = req.params;
      const userId = req.user!.id;
      const updateData = req.body;

      // Get validation to check ownership
      const validation = await validationsService.getValidationById(validationId);

      if (!validation) {
        res.status(404).json({ message: 'Validation not found' });
        return;
      }

      if (validation.userId !== userId) {
        res.status(403).json({ message: 'Unauthorized to update this validation' });
        return;
      }

      const updatedValidation = await validationsService.updateValidationById(
        validationId,
        updateData
      );

      res.json(updatedValidation);
    } catch (error: any) {
      console.error('Update validation by ID error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * DELETE /api/validations/:validationId
   * Delete a validation by ID
   */
  async deleteValidationById(req: Request, res: Response): Promise<void> {
    try {
      const { validationId } = req.params;
      const userId = req.user!.id;

      // Get validation to check ownership
      const validation = await validationsService.getValidationById(validationId);

      if (!validation) {
        res.status(404).json({ message: 'Validation not found' });
        return;
      }

      if (validation.userId !== userId) {
        res.status(403).json({ message: 'Unauthorized to delete this validation' });
        return;
      }

      await validationsService.deleteValidationById(validationId);

      res.status(204).send();
    } catch (error: any) {
      console.error('Delete validation by ID error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * DELETE /api/routes/:routeId/validate
   * Delete a validation
   */
  async deleteValidation(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;
      const userId = req.user!.id;

      await validationsService.deleteValidation(userId, routeId);

      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Validation not found') {
        res.status(404).json({ message: error.message });
      } else {
        console.error('Delete validation error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * GET /api/routes/:routeId/validations
   * Get all validations for a route
   */
  async getRouteValidations(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;

      const validations = await validationsService.getRouteValidations(routeId);

      res.json(validations);
    } catch (error: any) {
      console.error('Get route validations error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /api/users/:userId/validations
   * Get all validations for a user
   */
  async getUserValidations(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const validations = await validationsService.getUserValidations(userId);

      res.json(validations);
    } catch (error: any) {
      console.error('Get user validations error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /api/routes/:routeId/validate/check
   * Check if current user has validated a route
   */
  async checkUserValidation(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;
      const userId = req.user!.id;

      const hasValidated = await validationsService.hasUserValidated(
        userId,
        routeId
      );

      res.json({ hasValidated });
    } catch (error: any) {
      console.error('Check validation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * PUT /api/validations/:validationId/status
   * Update validation attempt status
   */
  async updateValidationStatus(req: Request, res: Response): Promise<void> {
    try {
      const { validationId } = req.params;
      const userId = req.user!.id;
      const { attemptStatus } = req.body;

      const validation = await validationsService.updateValidationStatus(
        validationId,
        userId,
        attemptStatus
      );

      res.json(validation);
    } catch (error: any) {
      if (error.message.includes('Unauthorized')) {
        res.status(403).json({ message: error.message });
      } else if (error.message === 'Validation not found') {
        res.status(404).json({ message: error.message });
      } else {
        console.error('Update validation status error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * GET /api/routes/:routeId/completion-count
   * Get the number of users who completed a route
   */
  async getRouteCompletionCount(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;

      const count = await validationsService.getRouteCompletionCount(routeId);

      res.json({ count });
    } catch (error: any) {
      if (error.message === 'Route not found') {
        res.status(404).json({ message: error.message });
      } else {
        console.error('Get completion count error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * GET /api/routes/:routeId/validation-stats
   * Get validation statistics by attempt status for a route
   */
  async getRouteValidationStats(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;

      const stats = await validationsService.getRouteValidationStats(routeId);

      res.json(stats);
    } catch (error: any) {
      console.error('Get validation stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new ValidationsController();
