import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Initialize Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for profile photos
export const profilePhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'climbtracker/profiles',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'fill', quality: 'auto' }],
  } as any,
});

// Storage configuration for additional user photos
export const userPhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'climbtracker/user-photos',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
  } as any,
});

// Storage configuration for route photos
export const routePhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'climbtracker/routes',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1600, height: 1600, crop: 'limit', quality: 'auto' }],
  } as any,
});

// Multer upload configurations
export const uploadProfilePhoto = multer({
  storage: profilePhotoStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const uploadUserPhotos = multer({
  storage: userPhotoStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export const uploadRoutePhoto = multer({
  storage: routePhotoStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export default cloudinary;
