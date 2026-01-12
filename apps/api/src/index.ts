import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import routesRoutes from './routes/routes.routes';
import validationsRoutes from './routes/validations.routes';
import commentsRoutes from './routes/comments.routes';
import usersRoutes from './routes/users.routes';
import uploadRoutes from './routes/upload.routes';
import adminRoutes from './routes/admin.routes';
import gymLayoutRoutes from './routes/gym-layout.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import imageProxyRoutes from './routes/image-proxy.routes';
import { AppError } from './utils/errors';
import { errorResponse } from './utils/response';
import { initializeDatabase, AppDataSource } from './database/data-source';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // In development, allow all localhost origins
      if (process.env.NODE_ENV === 'development') {
        if (!origin || origin.startsWith('http://localhost:')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } else {
        // In production, use the environment variable
        const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
        if (origin === allowedOrigin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting (disabled in development)
if (process.env.NODE_ENV !== 'development') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use('/api/', limiter);
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api', validationsRoutes);
app.use('/api', commentsRoutes);
app.use('/api', usersRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', gymLayoutRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/image', imageProxyRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.statusCode);
  }

  // Default error
  return errorResponse(
    res,
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
    500
  );
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('\n🔴 Shutting down gracefully...');

  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔍 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
