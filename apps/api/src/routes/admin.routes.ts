import { Router } from 'express';
import { AuthRequest } from '../types';
import { Response } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import adminService from '../services/admin.service';
import gymLayoutService from '../services/gym-layout.service';
import { UserRole } from '../database/entities/User';
import { z } from 'zod';

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(authenticate, requireAdmin);

/**
 * @route GET /api/admin/stats
 * @desc Get dashboard statistics
 * @access Admin
 */
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get stats' });
  }
});

/**
 * @route PUT /api/admin/users/:userId/role
 * @desc Update user role
 * @access Admin
 */
router.put('/users/:userId/role', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    const roleSchema = z.object({
      role: z.nativeEnum(UserRole),
    });

    const validated = roleSchema.parse({ role });

    const user = await adminService.updateUserRole(userId, validated.role);

    res.json({
      message: 'User role updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Invalid role', details: error.errors });
    } else {
      res.status(500).json({ error: error.message || 'Failed to update user role' });
    }
  }
});

/**
 * @route DELETE /api/admin/users/:userId
 * @desc Delete a user
 * @access Admin
 */
router.delete('/users/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    await adminService.deleteUser(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete user' });
  }
});

/**
 * @route DELETE /api/admin/routes/bulk
 * @desc Bulk delete routes
 * @access Admin
 */
router.delete('/routes/bulk', async (req: AuthRequest, res: Response) => {
  try {
    const { routeIds } = req.body;

    if (!Array.isArray(routeIds) || routeIds.length === 0) {
      return res.status(400).json({ error: 'routeIds must be a non-empty array' });
    }

    await adminService.bulkDeleteRoutes(routeIds);

    res.json({
      message: `${routeIds.length} route(s) deleted successfully`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete routes' });
  }
});

/**
 * @route GET /api/admin/routes
 * @desc Get all routes with pagination (admin view)
 * @access Admin
 */
router.get('/routes', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const { routes, total } = await adminService.getAllRoutes(page, limit);

    res.json({ routes, total, page, limit });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get routes' });
  }
});

/**
 * @route GET /api/admin/users/:userId
 * @desc Get detailed user information
 * @access Admin
 */
router.get('/users/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await adminService.getUserDetails(userId);

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get user details' });
  }
});

/**
 * @route GET /api/admin/gym-layout
 * @desc Get the active gym layout
 * @access Admin
 */
router.get('/gym-layout', async (req: AuthRequest, res: Response) => {
  try {
    const layout = await gymLayoutService.getActiveLayout();

    if (!layout) {
      return res.status(404).json({ error: 'No active gym layout found' });
    }

    res.json(layout);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get gym layout' });
  }
});

/**
 * @route POST /api/admin/gym-layout
 * @desc Create or update gym layout
 * @access Admin
 */
router.post('/gym-layout', async (req: AuthRequest, res: Response) => {
  try {
    const { name, svgContent, sectorMappings } = req.body;

    if (!name || !svgContent) {
      return res.status(400).json({ error: 'name and svgContent are required' });
    }

    const layout = await gymLayoutService.createOrUpdateLayout({
      name,
      svgContent,
      sectorMappings,
    });

    res.json({
      message: 'Gym layout saved successfully',
      layout,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save gym layout' });
  }
});

/**
 * @route PUT /api/admin/users/:userId/ban
 * @desc Ban a user
 * @access Admin
 */
router.put('/users/:userId/ban', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await adminService.banUser(userId);

    res.json({
      message: 'User banned successfully',
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to ban user' });
  }
});

export default router;
