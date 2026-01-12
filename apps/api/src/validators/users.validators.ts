import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  age: z.number().int().min(1).max(120).optional(),
  height: z.number().int().min(50).max(250).optional(), // height in cm
  wingspan: z.number().int().min(50).max(300).optional(), // wingspan in cm
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  profilePhoto: z.string().url().optional(), // Cloudinary URL
  additionalPhotos: z.array(z.string().url()).optional(), // Array of Cloudinary URLs
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
