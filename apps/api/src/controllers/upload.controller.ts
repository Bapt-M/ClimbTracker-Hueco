import { Request, Response } from 'express';
import cloudinary from '../lib/cloudinary';

/**
 * Controller for handling file uploads
 */
class UploadController {
  /**
   * Upload a single profile photo
   * @route POST /api/upload/profile-photo
   * @access Protected
   */
  async uploadProfilePhoto(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Cloudinary URL is available in req.file.path
      const url = (req.file as any).path;

      return res.status(200).json({
        url,
        message: 'Profile photo uploaded successfully',
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      return res.status(500).json({
        error: 'Upload failed',
        message: error.message || 'Failed to upload profile photo',
      });
    }
  }

  /**
   * Upload multiple user photos
   * @route POST /api/upload/user-photos
   * @access Protected
   */
  async uploadUserPhotos(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      // Extract URLs from uploaded files
      const urls = req.files.map((file: any) => file.path);

      return res.status(200).json({
        urls,
        message: `${urls.length} photo(s) uploaded successfully`,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      return res.status(500).json({
        error: 'Upload failed',
        message: error.message || 'Failed to upload photos',
      });
    }
  }

  /**
   * Upload a single route photo
   * @route POST /api/upload/route-photo
   * @access Protected
   */
  async uploadRoutePhoto(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const url = (req.file as any).path;

      return res.status(200).json({
        url,
        message: 'Route photo uploaded successfully',
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      return res.status(500).json({
        error: 'Upload failed',
        message: error.message || 'Failed to upload route photo',
      });
    }
  }

  /**
   * Delete a photo from Cloudinary
   * @route DELETE /api/upload/photo
   * @access Protected
   */
  async deletePhoto(req: Request, res: Response): Promise<Response> {
    try {
      const { publicId } = req.body;

      if (!publicId) {
        return res.status(400).json({ error: 'Public ID is required' });
      }

      // Delete from Cloudinary
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === 'ok') {
        return res.status(200).json({
          success: true,
          message: 'Photo deleted successfully',
        });
      } else {
        return res.status(404).json({
          error: 'Photo not found or already deleted',
        });
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      return res.status(500).json({
        error: 'Delete failed',
        message: error.message || 'Failed to delete photo',
      });
    }
  }
}

export default new UploadController();
