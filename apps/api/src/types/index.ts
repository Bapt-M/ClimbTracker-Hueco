import { Request } from 'express';
import { UserRole } from '../database/entities/User';

export interface UserPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar: string | null;
    bio: string | null;
  };
  tokens: TokenPair;
}
