import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { User } from './entities/User';
import { Route } from './entities/Route';
import { Validation } from './entities/Validation';
import { Comment } from './entities/Comment';
import { Video } from './entities/Video';
import { Analysis } from './entities/Analysis';
import { GymLayout } from './entities/GymLayout';
import { Friendship } from './entities/Friendship';

// Load .env file from the api directory
config({ path: join(__dirname, '../../.env') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'climbtracker',
  password: process.env.DB_PASSWORD || 'climbtrack123',
  database: process.env.DB_NAME || 'climbtracker',
  synchronize: process.env.NODE_ENV === 'development', // Auto-sync in dev
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Route, Validation, Comment, Video, Analysis, GymLayout, Friendship],
  migrations: ['src/database/migrations/**/*.ts'],
  subscribers: [],
});

// Initialize the database connection
export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ Database connection established successfully');
    }
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    throw error;
  }
};
