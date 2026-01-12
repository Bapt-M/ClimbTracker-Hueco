import { z } from 'zod';
import { ValidationStatus } from '../database/entities/Validation';

export const createValidationSchema = z.object({
  personalNote: z.string().optional(),
  status: z.nativeEnum(ValidationStatus).optional().default(ValidationStatus.EN_PROJET),
  attempts: z.number().int().positive().optional().default(1),
  isFlashed: z.boolean().optional().default(false),
  isFavorite: z.boolean().optional().default(false),
});

export const updateValidationSchema = z.object({
  status: z.nativeEnum(ValidationStatus).optional(),
  attempts: z.number().int().positive().optional(),
  isFlashed: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  personalNote: z.string().optional(),
});

export type CreateValidationInput = z.infer<typeof createValidationSchema>;
export type UpdateValidationInput = z.infer<typeof updateValidationSchema>;
