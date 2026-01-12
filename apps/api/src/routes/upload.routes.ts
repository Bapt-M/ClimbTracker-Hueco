import { Router } from 'express';
import uploadController from '../controllers/upload.controller';
import { authenticate } from '../middlewares/auth.middleware';
import {
  uploadProfilePhoto,
  uploadUserPhotos,
  uploadRoutePhoto,
} from '../lib/cloudinary';
import { handleUploadError } from '../middlewares/upload.middleware';

const router = Router();

/**
 * @route POST /api/upload/profile-photo
 * @desc Upload a single profile photo
 * @access Protected (requires authentication)
 */
router.post(
  '/profile-photo',
  authenticate,
  uploadProfilePhoto.single('photo'),
  handleUploadError,
  uploadController.uploadProfilePhoto
);

/**
 * @route POST /api/upload/user-photos
 * @desc Upload multiple user photos (max 5)
 * @access Protected (requires authentication)
 */
router.post(
  '/user-photos',
  authenticate,
  uploadUserPhotos.array('photos', 5),
  handleUploadError,
  uploadController.uploadUserPhotos
);

/**
 * @route POST /api/upload/route-photo
 * @desc Upload a single route photo
 * @access Protected (requires authentication)
 */
router.post(
  '/route-photo',
  authenticate,
  uploadRoutePhoto.single('photo'),
  handleUploadError,
  uploadController.uploadRoutePhoto
);

/**
 * @route DELETE /api/upload/photo
 * @desc Delete a photo from Cloudinary
 * @access Protected (requires authentication)
 */
router.delete('/photo', authenticate, uploadController.deletePhoto);

export default router;
