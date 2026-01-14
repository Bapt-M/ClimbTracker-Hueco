import { z } from 'zod';

export const sendFriendRequestSchema = z.object({
  addresseeId: z.string().uuid('Invalid user ID'),
});

export type SendFriendRequestInput = z.infer<typeof sendFriendRequestSchema>;
