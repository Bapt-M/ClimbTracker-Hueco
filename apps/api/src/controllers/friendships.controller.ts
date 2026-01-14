import { Request, Response } from 'express';
import friendshipsService from '../services/friendships.service';

class FriendshipsController {
  /**
   * POST /api/friendships/request
   * Send a friend request
   */
  async sendFriendRequest(req: Request, res: Response): Promise<void> {
    try {
      const requesterId = req.user!.id;
      const { addresseeId } = req.body;

      const friendship = await friendshipsService.sendFriendRequest(requesterId, addresseeId);

      res.status(201).json({
        message: 'Friend request sent',
        data: friendship,
      });
    } catch (error: any) {
      if (
        error.message === 'User not found' ||
        error.message === 'Cannot send friend request to yourself' ||
        error.message === 'Friend request already pending' ||
        error.message === 'Already friends'
      ) {
        res.status(400).json({ message: error.message });
      } else {
        console.error('Send friend request error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * POST /api/friendships/:friendshipId/accept
   * Accept a friend request
   */
  async acceptFriendRequest(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { friendshipId } = req.params;

      const friendship = await friendshipsService.acceptFriendRequest(friendshipId, userId);

      res.json({
        message: 'Friend request accepted',
        data: friendship,
      });
    } catch (error: any) {
      if (
        error.message === 'Friend request not found' ||
        error.message === 'Friend request is not pending'
      ) {
        res.status(404).json({ message: error.message });
      } else if (error.message === 'Unauthorized to accept this request') {
        res.status(403).json({ message: error.message });
      } else {
        console.error('Accept friend request error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * POST /api/friendships/:friendshipId/reject
   * Reject a friend request
   */
  async rejectFriendRequest(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { friendshipId } = req.params;

      await friendshipsService.rejectFriendRequest(friendshipId, userId);

      res.json({
        message: 'Friend request rejected',
      });
    } catch (error: any) {
      if (
        error.message === 'Friend request not found' ||
        error.message === 'Friend request is not pending'
      ) {
        res.status(404).json({ message: error.message });
      } else if (error.message === 'Unauthorized to reject this request') {
        res.status(403).json({ message: error.message });
      } else {
        console.error('Reject friend request error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * DELETE /api/friendships/:friendshipId
   * Remove a friend
   */
  async removeFriend(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { friendshipId } = req.params;

      await friendshipsService.removeFriend(friendshipId, userId);

      res.json({
        message: 'Friend removed',
      });
    } catch (error: any) {
      if (error.message === 'Friendship not found') {
        res.status(404).json({ message: error.message });
      } else if (error.message === 'Unauthorized to remove this friendship') {
        res.status(403).json({ message: error.message });
      } else {
        console.error('Remove friend error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * GET /api/friendships/friends
   * Get all friends (accepted friendships)
   */
  async getFriends(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const friends = await friendshipsService.getFriends(userId);

      res.json({
        data: friends,
      });
    } catch (error: any) {
      console.error('Get friends error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /api/friendships/pending
   * Get pending friend requests (received)
   */
  async getPendingRequests(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const requests = await friendshipsService.getPendingRequests(userId);

      res.json({
        data: requests,
      });
    } catch (error: any) {
      console.error('Get pending requests error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /api/friendships/sent
   * Get sent friend requests (pending)
   */
  async getSentRequests(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const requests = await friendshipsService.getSentRequests(userId);

      res.json({
        data: requests,
      });
    } catch (error: any) {
      console.error('Get sent requests error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /api/friendships/status/:userId
   * Get friendship status with another user
   */
  async getFriendshipStatus(req: Request, res: Response): Promise<void> {
    try {
      const currentUserId = req.user!.id;
      const { userId } = req.params;

      const status = await friendshipsService.getFriendshipStatus(currentUserId, userId);

      res.json({
        data: status,
      });
    } catch (error: any) {
      console.error('Get friendship status error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /api/friendships/search
   * Search users to add as friends
   */
  async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({ message: 'Search term is required' });
        return;
      }

      const users = await friendshipsService.searchUsers(userId, q);

      res.json({
        data: users,
      });
    } catch (error: any) {
      console.error('Search users error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new FriendshipsController();
