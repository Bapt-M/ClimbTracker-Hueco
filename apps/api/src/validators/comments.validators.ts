import { z } from 'zod';

const mediaTypeEnum = z.enum(['IMAGE', 'VIDEO']);

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000, 'Content is too long'),
  mediaUrl: z.string().url().optional(),
  mediaType: mediaTypeEnum.optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(2000).optional(),
  mediaUrl: z.string().url().optional(),
  mediaType: mediaTypeEnum.optional(),
});

export const getCommentsQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type GetCommentsQuery = z.infer<typeof getCommentsQuerySchema>;
