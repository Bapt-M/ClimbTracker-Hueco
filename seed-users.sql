-- Seed test users
-- Password for all users: password123

-- Admin user
INSERT INTO "User" (id, email, password, name, role, bio, "createdAt", "updatedAt")
VALUES (
  'clpk6jjp60000a3zv7t4i3q8a',
  'admin@climbtracker.com',
  '$2a$10$za9igJNWv/K.R3Z/kNCvC.Wg8Lkhq6fCngMd/3r5ktbV/RScX.8JC',
  'Admin User',
  'ADMIN',
  'Administrator of ClimbTracker',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Opener user
INSERT INTO "User" (id, email, password, name, role, bio, "createdAt", "updatedAt")
VALUES (
  'clpk6jjp70001a3zv8h2k4r9b',
  'opener@climbtracker.com',
  '$2a$10$za9igJNWv/K.R3Z/kNCvC.Wg8Lkhq6fCngMd/3r5ktbV/RScX.8JC',
  'Route Opener',
  'OPENER',
  'Professional route setter',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Climber 1
INSERT INTO "User" (id, email, password, name, role, bio, "createdAt", "updatedAt")
VALUES (
  'clpk6jjp80002a3zv9l3m5s0c',
  'climber1@climbtracker.com',
  '$2a$10$za9igJNWv/K.R3Z/kNCvC.Wg8Lkhq6fCngMd/3r5ktbV/RScX.8JC',
  'Alex Climber',
  'CLIMBER',
  'Passionate climber',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Climber 2
INSERT INTO "User" (id, email, password, name, role, bio, "createdAt", "updatedAt")
VALUES (
  'clpk6jjp90003a3zva4n6t1d',
  'climber2@climbtracker.com',
  '$2a$10$za9igJNWv/K.R3Z/kNCvC.Wg8Lkhq6fCngMd/3r5ktbV/RScX.8JC',
  'Sarah Boulder',
  'CLIMBER',
  'Boulder enthusiast',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;
