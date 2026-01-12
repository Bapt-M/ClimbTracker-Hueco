import 'reflect-metadata';
import { config } from 'dotenv';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities';

config();

const seedUsers = async () => {
  const userRepository = AppDataSource.getRepository(User);

  // Check if users already exist
  const existingUsers = await userRepository.count();

  if (existingUsers > 0) {
    console.log('⚠️  Users already exist, skipping seed');
    return;
  }

  console.log('🌱 Seeding users...');

  const password = await bcrypt.hash('password123', 10);

  const users = [
    {
      email: 'admin@climbtracker.com',
      password,
      name: 'Admin User',
      role: UserRole.ADMIN,
      bio: 'System administrator',
    },
    {
      email: 'opener@climbtracker.com',
      password,
      name: 'Opener Pro',
      role: UserRole.OPENER,
      bio: 'Professional route opener',
    },
    {
      email: 'climber1@climbtracker.com',
      password,
      name: 'John Climber',
      role: UserRole.CLIMBER,
      bio: 'Passionate climber since 2020',
    },
    {
      email: 'climber2@climbtracker.com',
      password,
      name: 'Sarah Boulder',
      role: UserRole.CLIMBER,
      bio: 'Boulder enthusiast',
    },
  ];

  for (const userData of users) {
    const user = userRepository.create(userData);
    await userRepository.save(user);
    console.log(`✅ Created user: ${userData.email}`);
  }

  console.log('🎉 Seed completed successfully!');
};

const runSeed = async () => {
  try {
    console.log('🔄 Initializing database connection...');
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    await seedUsers();

    await AppDataSource.destroy();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

runSeed();
