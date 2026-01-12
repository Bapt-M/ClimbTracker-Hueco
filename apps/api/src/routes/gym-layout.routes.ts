import { Router } from 'express';
import { Request, Response } from 'express';
import { DEFAULT_GYM_SVG } from '../lib/defaultGymLayout';
import gymLayoutService from '../services/gym-layout.service';

const router = Router();

// GET /api/gym-layout/active - Get active gym layout (public)
router.get('/gym-layout/active', async (req: Request, res: Response) => {
  try {
    // Try to fetch from database
    const layout = await gymLayoutService.getActiveLayout();

    if (layout) {
      // Return layout from database
      res.json({
        name: layout.name,
        svgContent: layout.svgContent,
        isActive: layout.isActive,
        sectorMappings: layout.sectorMappings,
      });
    } else {
      // Fallback to default layout if none exists in DB
      res.json({
        name: 'default',
        svgContent: DEFAULT_GYM_SVG,
        isActive: true,
      });
    }
  } catch (error: any) {
    console.error('Get active gym layout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
