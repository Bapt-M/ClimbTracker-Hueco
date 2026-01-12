import { z } from 'zod';

export const leaderboardQuerySchema = z.object({
  tab: z.enum(['global', 'friends']).optional().default('global'),
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1, { message: 'Page must be at least 1' })
    .optional()
    .default('1'),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1 && val <= 100, {
      message: 'Limit must be between 1 and 100',
    })
    .optional()
    .default('50'),
});
