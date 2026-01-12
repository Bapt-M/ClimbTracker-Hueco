import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password for all test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@climbtracker.com' },
    update: {},
    create: {
      email: 'admin@climbtracker.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      bio: 'Administrator of ClimbTracker',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create Opener user
  const opener = await prisma.user.upsert({
    where: { email: 'opener@climbtracker.com' },
    update: {},
    create: {
      email: 'opener@climbtracker.com',
      password: hashedPassword,
      name: 'Route Opener',
      role: 'OPENER',
      bio: 'Professional route setter',
    },
  });

  console.log('✅ Created opener user:', opener.email);

  // Create Climber users
  const climber1 = await prisma.user.upsert({
    where: { email: 'climber1@climbtracker.com' },
    update: {},
    create: {
      email: 'climber1@climbtracker.com',
      password: hashedPassword,
      name: 'Alex Climber',
      role: 'CLIMBER',
      bio: 'Passionate climber',
    },
  });

  console.log('✅ Created climber user:', climber1.email);

  const climber2 = await prisma.user.upsert({
    where: { email: 'climber2@climbtracker.com' },
    update: {},
    create: {
      email: 'climber2@climbtracker.com',
      password: hashedPassword,
      name: 'Sarah Boulder',
      role: 'CLIMBER',
      bio: 'Boulder enthusiast',
    },
  });

  console.log('✅ Created climber user:', climber2.email);

  console.log('🎉 Seeding completed!');
  console.log('\n📋 Test users created:');
  console.log('  - admin@climbtracker.com / password123 (ADMIN)');
  console.log('  - opener@climbtracker.com / password123 (OPENER)');
  console.log('  - climber1@climbtracker.com / password123 (CLIMBER)');
  console.log('  - climber2@climbtracker.com / password123 (CLIMBER)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
