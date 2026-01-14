import { Router } from 'express';
import friendshipsController from '../controllers/friendships.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { sendFriendRequestSchema } from '../validators/friendships.validators';

const router = Router();

// All friendship routes require authentication
router.use(authenticate);

// POST /api/friendships/request - Send a friend request
router.post(
  '/friendships/request',
  validate(sendFriendRequestSchema),
  friendshipsController.sendFriendRequest
);

// POST /api/friendships/:friendshipId/accept - Accept a friend request
router.post('/friendships/:friendshipId/accept', friendshipsController.acceptFriendRequest);

// POST /api/friendships/:friendshipId/reject - Reject a friend request
router.post('/friendships/:friendshipId/reject', friendshipsController.rejectFriendRequest);

// DELETE /api/friendships/:friendshipId - Remove a friend
router.delete('/friendships/:friendshipId', friendshipsController.removeFriend);

// GET /api/friendships/friends - Get all friends
router.get('/friendships/friends', friendshipsController.getFriends);

// GET /api/friendships/pending - Get pending friend requests (received)
router.get('/friendships/pending', friendshipsController.getPendingRequests);

// GET /api/friendships/sent - Get sent friend requests
router.get('/friendships/sent', friendshipsController.getSentRequests);

// GET /api/friendships/status/:userId - Get friendship status with a user
router.get('/friendships/status/:userId', friendshipsController.getFriendshipStatus);

// GET /api/friendships/search - Search users to add as friends
router.get('/friendships/search', friendshipsController.searchUsers);

export default router;
