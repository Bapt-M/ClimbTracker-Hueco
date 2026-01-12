import bcrypt from 'bcryptjs';
import { getUserRepository } from '../lib/database';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt';
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} from '../utils/errors';
import { AuthResponse, TokenPair } from '../types';
import { UserRole } from '../database/entities';

export class AuthService {
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> {
    const userRepository = getUserRepository();

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: UserRole.CLIMBER, // Default role
    });

    await userRepository.save(user);

    // Generate tokens
    const tokens = generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      },
      tokens,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const userRepository = getUserRepository();

    // Find user
    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate tokens
    const tokens = generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      },
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const userRepository = getUserRepository();

      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);

      // Check if user still exists
      const user = await userRepository.findOne({
        where: { id: payload.id },
      });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      // Generate new token pair
      return generateTokenPair({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  async getCurrentUser(userId: string) {
    const userRepository = getUserRepository();

    const user = await userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user;
  }
}

export const authService = new AuthService();
