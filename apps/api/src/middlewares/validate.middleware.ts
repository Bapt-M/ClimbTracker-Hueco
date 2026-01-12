import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { errorResponse } from '../utils/response';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        console.error('Validation failed:', {
          body: req.body,
          errors,
        });
        return errorResponse(res, 'Validation failed', 422, errors);
      }
      next(error);
    }
  };
};
