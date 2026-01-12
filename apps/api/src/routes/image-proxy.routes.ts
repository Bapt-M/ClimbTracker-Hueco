import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';

const router = Router();

/**
 * Proxy route to fetch external images with CORS headers
 * This allows the frontend to load images in canvas without CORS issues
 */
router.get('/proxy', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid URL parameter',
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format',
      });
    }

    // Fetch the image from the external URL
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 10000, // 10 seconds timeout
      maxContentLength: 10 * 1024 * 1024, // Max 10MB
    });

    // Set CORS headers to allow canvas access
    res.set({
      'Content-Type': response.headers['content-type'] || 'image/jpeg',
      'Content-Length': response.headers['content-length'],
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    });

    // Send the image data
    res.send(response.data);
  } catch (error: any) {
    console.error('Image proxy error:', error.message);

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(504).json({
        success: false,
        error: 'Request timeout while fetching image',
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: `Failed to fetch image: ${error.response.statusText}`,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch image',
    });
  }
});

export default router;
