import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Comment, MediaType } from '../database/entities/Comment';
import { Route } from '../database/entities/Route';

export interface CommentCreateInput {
  content: string;
  userId: string;
  routeId: string;
  mediaUrl?: string;
  mediaType?: MediaType;
}

export interface CommentUpdateInput {
  content?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
}

export interface CommentWithDetails extends Comment {
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface PaginatedComments {
  comments: CommentWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class CommentsService {
  private commentRepository: Repository<Comment>;
  private routeRepository: Repository<Route>;

  constructor() {
    this.commentRepository = AppDataSource.getRepository(Comment);
    this.routeRepository = AppDataSource.getRepository(Route);
  }

  /**
   * Create a comment on a route
   */
  async createComment(data: CommentCreateInput): Promise<CommentWithDetails> {
    // Check if route exists
    const route = await this.routeRepository.findOne({
      where: { id: data.routeId },
    });

    if (!route) {
      throw new Error('Route not found');
    }

    const comment = this.commentRepository.create({
      content: data.content,
      userId: data.userId,
      routeId: data.routeId,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType,
    });

    const saved = await this.commentRepository.save(comment);

    // Fetch with user relation
    return this.getCommentById(saved.id);
  }

  /**
   * Update a comment (only by owner or admin)
   */
  async updateComment(
    commentId: string,
    userId: string,
    userRole: string,
    data: CommentUpdateInput
  ): Promise<CommentWithDetails> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    // Check permissions
    if (comment.userId !== userId && userRole !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    // Update fields
    if (data.content !== undefined) {
      comment.content = data.content;
    }
    if (data.mediaUrl !== undefined) {
      comment.mediaUrl = data.mediaUrl;
    }
    if (data.mediaType !== undefined) {
      comment.mediaType = data.mediaType;
    }

    await this.commentRepository.save(comment);

    return this.getCommentById(commentId);
  }

  /**
   * Delete a comment (only by owner or admin)
   */
  async deleteComment(
    commentId: string,
    userId: string,
    userRole: string
  ): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    // Check permissions
    if (comment.userId !== userId && userRole !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    await this.commentRepository.remove(comment);
  }

  /**
   * Get a comment by ID with user details
   */
  async getCommentById(commentId: string): Promise<CommentWithDetails> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    return {
      ...comment,
      user: comment.user
        ? {
            id: comment.user.id,
            name: comment.user.name,
            email: comment.user.email,
            avatar: comment.user.avatar,
          }
        : undefined,
    };
  }

  /**
   * Get all comments for a route with pagination
   */
  async getRouteComments(
    routeId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedComments> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { routeId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const commentsWithDetails: CommentWithDetails[] = comments.map((c) => ({
      ...c,
      user: c.user
        ? {
            id: c.user.id,
            name: c.user.name,
            email: c.user.email,
            avatar: c.user.avatar,
          }
        : undefined,
    }));

    return {
      comments: commentsWithDetails,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get comment count for a route
   */
  async getRouteCommentCount(routeId: string): Promise<number> {
    return this.commentRepository.count({
      where: { routeId },
    });
  }

  /**
   * Get all comments by a user
   */
  async getUserComments(userId: string): Promise<CommentWithDetails[]> {
    const comments = await this.commentRepository.find({
      where: { userId },
      relations: ['user', 'route'],
      order: { createdAt: 'DESC' },
    });

    return comments.map((c) => ({
      ...c,
      user: c.user
        ? {
            id: c.user.id,
            name: c.user.name,
            email: c.user.email,
            avatar: c.user.avatar,
          }
        : undefined,
    }));
  }
}

export default new CommentsService();
