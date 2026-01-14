import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Friendship, FriendshipStatus } from '../database/entities/Friendship';
import { User } from '../database/entities/User';

export interface FriendshipWithUser {
  id: string;
  status: FriendshipStatus;
  createdAt: Date;
  acceptedAt?: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  isRequester: boolean; // true si l'utilisateur actuel a envoyé la demande
}

class FriendshipsService {
  private friendshipRepository: Repository<Friendship>;
  private userRepository: Repository<User>;

  constructor() {
    this.friendshipRepository = AppDataSource.getRepository(Friendship);
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Send a friend request
   */
  async sendFriendRequest(requesterId: string, addresseeId: string): Promise<Friendship> {
    // Check if users exist
    const [requester, addressee] = await Promise.all([
      this.userRepository.findOne({ where: { id: requesterId } }),
      this.userRepository.findOne({ where: { id: addresseeId } }),
    ]);

    if (!requester || !addressee) {
      throw new Error('User not found');
    }

    // Cannot send request to yourself
    if (requesterId === addresseeId) {
      throw new Error('Cannot send friend request to yourself');
    }

    // Check if friendship already exists (in either direction)
    const existingFriendship = await this.friendshipRepository
      .createQueryBuilder('friendship')
      .where(
        '(friendship.requesterId = :requesterId AND friendship.addresseeId = :addresseeId) OR ' +
        '(friendship.requesterId = :addresseeId AND friendship.addresseeId = :requesterId)',
        { requesterId, addresseeId }
      )
      .getOne();

    if (existingFriendship) {
      if (existingFriendship.status === FriendshipStatus.PENDING) {
        throw new Error('Friend request already pending');
      }
      if (existingFriendship.status === FriendshipStatus.ACCEPTED) {
        throw new Error('Already friends');
      }
      // If rejected, allow creating a new request
      await this.friendshipRepository.remove(existingFriendship);
    }

    // Create new friendship
    const friendship = this.friendshipRepository.create({
      requesterId,
      addresseeId,
      status: FriendshipStatus.PENDING,
    });

    return await this.friendshipRepository.save(friendship);
  }

  /**
   * Accept a friend request
   */
  async acceptFriendRequest(friendshipId: string, userId: string): Promise<Friendship> {
    const friendship = await this.friendshipRepository.findOne({
      where: { id: friendshipId },
      relations: ['requester', 'addressee'],
    });

    if (!friendship) {
      throw new Error('Friend request not found');
    }

    // Only the addressee can accept
    if (friendship.addresseeId !== userId) {
      throw new Error('Unauthorized to accept this request');
    }

    if (friendship.status !== FriendshipStatus.PENDING) {
      throw new Error('Friend request is not pending');
    }

    friendship.status = FriendshipStatus.ACCEPTED;
    friendship.acceptedAt = new Date();

    return await this.friendshipRepository.save(friendship);
  }

  /**
   * Reject a friend request
   */
  async rejectFriendRequest(friendshipId: string, userId: string): Promise<void> {
    const friendship = await this.friendshipRepository.findOne({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new Error('Friend request not found');
    }

    // Only the addressee can reject
    if (friendship.addresseeId !== userId) {
      throw new Error('Unauthorized to reject this request');
    }

    if (friendship.status !== FriendshipStatus.PENDING) {
      throw new Error('Friend request is not pending');
    }

    // Delete the friendship request
    await this.friendshipRepository.remove(friendship);
  }

  /**
   * Remove a friend (delete friendship)
   */
  async removeFriend(friendshipId: string, userId: string): Promise<void> {
    const friendship = await this.friendshipRepository.findOne({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new Error('Friendship not found');
    }

    // Either user can remove the friendship
    if (friendship.requesterId !== userId && friendship.addresseeId !== userId) {
      throw new Error('Unauthorized to remove this friendship');
    }

    await this.friendshipRepository.remove(friendship);
  }

  /**
   * Get all friends for a user (accepted friendships)
   */
  async getFriends(userId: string): Promise<FriendshipWithUser[]> {
    const friendships = await this.friendshipRepository
      .createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.requester', 'requester')
      .leftJoinAndSelect('friendship.addressee', 'addressee')
      .where(
        '(friendship.requesterId = :userId OR friendship.addresseeId = :userId) AND friendship.status = :status',
        { userId, status: FriendshipStatus.ACCEPTED }
      )
      .orderBy('friendship.acceptedAt', 'DESC')
      .getMany();

    return friendships.map((friendship) => {
      const isRequester = friendship.requesterId === userId;
      const otherUser = isRequester ? friendship.addressee : friendship.requester;

      return {
        id: friendship.id,
        status: friendship.status,
        createdAt: friendship.createdAt,
        acceptedAt: friendship.acceptedAt,
        user: {
          id: otherUser.id,
          name: otherUser.name,
          email: otherUser.email,
          avatar: otherUser.avatar,
        },
        isRequester,
      };
    });
  }

  /**
   * Get pending friend requests (received)
   */
  async getPendingRequests(userId: string): Promise<FriendshipWithUser[]> {
    const friendships = await this.friendshipRepository
      .createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.requester', 'requester')
      .where('friendship.addresseeId = :userId AND friendship.status = :status', {
        userId,
        status: FriendshipStatus.PENDING,
      })
      .orderBy('friendship.createdAt', 'DESC')
      .getMany();

    return friendships.map((friendship) => ({
      id: friendship.id,
      status: friendship.status,
      createdAt: friendship.createdAt,
      acceptedAt: friendship.acceptedAt,
      user: {
        id: friendship.requester.id,
        name: friendship.requester.name,
        email: friendship.requester.email,
        avatar: friendship.requester.avatar,
      },
      isRequester: false,
    }));
  }

  /**
   * Get sent friend requests (pending)
   */
  async getSentRequests(userId: string): Promise<FriendshipWithUser[]> {
    const friendships = await this.friendshipRepository
      .createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.addressee', 'addressee')
      .where('friendship.requesterId = :userId AND friendship.status = :status', {
        userId,
        status: FriendshipStatus.PENDING,
      })
      .orderBy('friendship.createdAt', 'DESC')
      .getMany();

    return friendships.map((friendship) => ({
      id: friendship.id,
      status: friendship.status,
      createdAt: friendship.createdAt,
      acceptedAt: friendship.acceptedAt,
      user: {
        id: friendship.addressee.id,
        name: friendship.addressee.name,
        email: friendship.addressee.email,
        avatar: friendship.addressee.avatar,
      },
      isRequester: true,
    }));
  }

  /**
   * Check if two users are friends
   */
  async areFriends(userId1: string, userId2: string): Promise<boolean> {
    const friendship = await this.friendshipRepository
      .createQueryBuilder('friendship')
      .where(
        '((friendship.requesterId = :userId1 AND friendship.addresseeId = :userId2) OR ' +
        '(friendship.requesterId = :userId2 AND friendship.addresseeId = :userId1)) AND ' +
        'friendship.status = :status',
        { userId1, userId2, status: FriendshipStatus.ACCEPTED }
      )
      .getOne();

    return !!friendship;
  }

  /**
   * Get friendship status between two users
   */
  async getFriendshipStatus(
    userId1: string,
    userId2: string
  ): Promise<{ status: FriendshipStatus | null; friendshipId?: string; isRequester?: boolean }> {
    const friendship = await this.friendshipRepository
      .createQueryBuilder('friendship')
      .where(
        '(friendship.requesterId = :userId1 AND friendship.addresseeId = :userId2) OR ' +
        '(friendship.requesterId = :userId2 AND friendship.addresseeId = :userId1)',
        { userId1, userId2 }
      )
      .getOne();

    if (!friendship) {
      return { status: null };
    }

    return {
      status: friendship.status,
      friendshipId: friendship.id,
      isRequester: friendship.requesterId === userId1,
    };
  }

  /**
   * Get friend IDs for a user (for leaderboard filtering)
   */
  async getFriendIds(userId: string): Promise<string[]> {
    const friendships = await this.friendshipRepository
      .createQueryBuilder('friendship')
      .where(
        '(friendship.requesterId = :userId OR friendship.addresseeId = :userId) AND friendship.status = :status',
        { userId, status: FriendshipStatus.ACCEPTED }
      )
      .getMany();

    return friendships.map((friendship) =>
      friendship.requesterId === userId ? friendship.addresseeId : friendship.requesterId
    );
  }

  /**
   * Search users to add as friends
   */
  async searchUsers(userId: string, searchTerm: string, limit: number = 20): Promise<any[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id != :userId', { userId })
      .andWhere('(LOWER(user.name) LIKE LOWER(:searchTerm) OR LOWER(user.email) LIKE LOWER(:searchTerm))', {
        searchTerm: `%${searchTerm}%`,
      })
      .take(limit)
      .getMany();

    // Get friendship status for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const friendshipStatus = await this.getFriendshipStatus(userId, user.id);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          friendshipStatus: friendshipStatus.status,
          friendshipId: friendshipStatus.friendshipId,
          isRequester: friendshipStatus.isRequester,
        };
      })
    );

    return usersWithStatus;
  }
}

export default new FriendshipsService();
