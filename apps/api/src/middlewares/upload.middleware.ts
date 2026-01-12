import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

/**
 * Middleware to handle file upload errors
 * Catches Multer-specific errors and returns appropriate HTTP responses
 */
export const handleUploadError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File size too large',
        message: 'The uploaded file exceeds the maximum allowed size',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        message: 'You have exceeded the maximum number of files allowed',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Unexpected file field',
        message: 'An unexpected file field was encountered',
      });
    }

    return res.status(400).json({
      error: 'File upload error',
      message: err.message,
    });
  }

  // Other errors (validation, network, etc.)
  if (err) {
    return res.status(400).json({
      error: 'Upload failed',
      message: err.message || 'File upload failed',
    });
  }

  // No error, continue to next middleware
  next();
};
