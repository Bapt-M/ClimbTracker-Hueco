-- =====================================================
-- ClimbTracker Database - Complete Schema + Real Data
-- =====================================================
-- Generated: 2026-01-14
-- PostgreSQL 16+
-- =====================================================

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS analyses CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS validations CASCADE;
DROP TABLE IF EXISTS friendships CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS gym_layouts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS route_status CASCADE;
DROP TYPE IF EXISTS difficulty_color CASCADE;
DROP TYPE IF EXISTS hold_color_category CASCADE;
DROP TYPE IF EXISTS validation_status CASCADE;
DROP TYPE IF EXISTS media_type CASCADE;
DROP TYPE IF EXISTS friendship_status CASCADE;

-- =====================================================
-- ENUM Types
-- =====================================================

CREATE TYPE user_role AS ENUM ('CLIMBER', 'OPENER', 'ADMIN');

CREATE TYPE route_status AS ENUM ('PENDING', 'ACTIVE', 'ARCHIVED');

CREATE TYPE difficulty_color AS ENUM (
    'Vert',
    'Vert clair',
    'Bleu clair',
    'Bleu foncé',
    'Violet',
    'Rose',
    'Rouge',
    'Orange',
    'Jaune',
    'Blanc',
    'Gris',
    'Noir'
);

CREATE TYPE hold_color_category AS ENUM (
    'red', 'blue', 'green', 'yellow', 'orange',
    'purple', 'pink', 'black', 'white', 'grey'
);

CREATE TYPE validation_status AS ENUM ('EN_PROJET', 'VALIDE');

CREATE TYPE media_type AS ENUM ('IMAGE', 'VIDEO');

CREATE TYPE friendship_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- =====================================================
-- Tables
-- =====================================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'CLIMBER',
    avatar VARCHAR(255),
    bio TEXT,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    age INTEGER,
    height INTEGER,
    wingspan INTEGER,
    "profilePhoto" VARCHAR(255),
    "additionalPhotos" JSONB,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Routes table
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(255) NOT NULL,
    description TEXT,
    tips TEXT,
    "openerId" UUID NOT NULL REFERENCES users(id),
    "mainPhoto" VARCHAR(255) NOT NULL,
    "openingVideo" VARCHAR(255),
    status route_status NOT NULL DEFAULT 'PENDING',
    "openedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP,
    "holdMapping" JSONB,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "routeTypes" JSONB,
    "holdColorHex" VARCHAR(50) NOT NULL,
    "holdColorCategory" hold_color_category NOT NULL,
    difficulty difficulty_color NOT NULL
);

-- Validations table
CREATE TABLE validations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES users(id),
    "routeId" UUID NOT NULL REFERENCES routes(id),
    "validatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "personalNote" TEXT,
    status validation_status NOT NULL DEFAULT 'EN_PROJET',
    attempts INTEGER NOT NULL DEFAULT 1,
    "isFlashed" BOOLEAN NOT NULL DEFAULT FALSE,
    "isFavorite" BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE("userId", "routeId")
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    "userId" UUID NOT NULL REFERENCES users(id),
    "routeId" UUID NOT NULL REFERENCES routes(id),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mediaUrl" VARCHAR(255),
    "mediaType" media_type
);

-- Videos table
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url VARCHAR(255) NOT NULL,
    "thumbnailUrl" VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL REFERENCES users(id),
    "routeId" UUID NOT NULL REFERENCES routes(id),
    "uploadedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Analyses table
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "videoId" UUID NOT NULL UNIQUE REFERENCES videos(id),
    "routeId" UUID NOT NULL REFERENCES routes(id),
    "poseData" JSONB NOT NULL,
    "globalScore" FLOAT NOT NULL,
    "detailScores" JSONB NOT NULL,
    suggestions JSONB NOT NULL,
    highlights JSONB NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Gym Layouts table
CREATE TABLE gym_layouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    "svgContent" TEXT NOT NULL,
    "sectorMappings" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Friendships table
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "requesterId" UUID NOT NULL REFERENCES users(id),
    "addresseeId" UUID NOT NULL REFERENCES users(id),
    status friendship_status NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP,
    UNIQUE("requesterId", "addresseeId")
);

-- =====================================================
-- Indexes
-- =====================================================

CREATE INDEX idx_routes_opener ON routes("openerId");
CREATE INDEX idx_routes_status ON routes(status);
CREATE INDEX idx_routes_difficulty ON routes(difficulty);
CREATE INDEX idx_routes_sector ON routes(sector);

CREATE INDEX idx_validations_user ON validations("userId");
CREATE INDEX idx_validations_route ON validations("routeId");

CREATE INDEX idx_comments_user ON comments("userId");
CREATE INDEX idx_comments_route ON comments("routeId");

CREATE INDEX idx_videos_user ON videos("userId");
CREATE INDEX idx_videos_route ON videos("routeId");

CREATE INDEX idx_friendships_requester ON friendships("requesterId");
CREATE INDEX idx_friendships_addressee ON friendships("addresseeId");

-- =====================================================
-- Trigger for updatedAt
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gym_layouts_updated_at BEFORE UPDATE ON gym_layouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- REAL DATA - Users
-- =====================================================
-- Password: password123 (bcrypt hash)

INSERT INTO users (id, email, password, name, role, avatar, bio, "createdAt", "updatedAt") VALUES
('57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'admin@climbtracker.com', '$2a$10$tseWN5/afkdKThPNLf9CSOfsz3Tlyz2QOiF0ZTXsGO5ynENOziba2', 'Admin User', 'ADMIN', NULL, 'System administrator', '2026-01-03 08:42:17.875169', '2026-01-03 08:42:17.875169'),
('7ce4ee1a-07ef-4d32-8db9-ceebfb093f19', 'opener@climbtracker.com', '$2a$10$tseWN5/afkdKThPNLf9CSOfsz3Tlyz2QOiF0ZTXsGO5ynENOziba2', 'Opener Pro', 'OPENER', NULL, 'Professional route opener', '2026-01-03 08:42:17.884963', '2026-01-03 08:42:17.884963'),
('1fd644fd-0f7c-4c45-a93c-cb5f744d2308', 'climber1@climbtracker.com', '$2a$10$tseWN5/afkdKThPNLf9CSOfsz3Tlyz2QOiF0ZTXsGO5ynENOziba2', 'John Climber', 'CLIMBER', NULL, 'Passionate climber since 2020', '2026-01-03 08:42:17.888946', '2026-01-03 08:42:17.888946'),
('192bc825-d431-4797-8aef-870f492ab2e4', 'climber2@climbtracker.com', '$2a$10$tseWN5/afkdKThPNLf9CSOfsz3Tlyz2QOiF0ZTXsGO5ynENOziba2', 'Sarah Boulder', 'CLIMBER', NULL, 'Boulder enthusiast', '2026-01-03 08:42:17.893589', '2026-01-03 08:42:17.893589'),
('ab93451c-40db-47d1-b6d7-1ab9dc5fcfb8', 'test_p35_1767739163@example.com', '$2a$10$pDUojB7VEwanfOLfCYrJAOOFR08sjUy0GSburnqDVJ4lkye0Pfa5y', 'Test P3.5 User', 'CLIMBER', NULL, NULL, '2026-01-06 22:39:28.579299', '2026-01-06 22:39:28.579299'),
('70ad191c-6b31-4ef1-8056-2db99e2ce747', 'test_p35_1767739204@example.com', '$2a$10$XODRijj6tPD6GYACkWooqe8krXqLvmYiuDcp.jScGpMLcY6G6clQ.', 'Test P3.5 User', 'CLIMBER', NULL, NULL, '2026-01-06 22:40:09.263554', '2026-01-06 22:40:09.263554');

-- =====================================================
-- REAL DATA - Routes
-- =====================================================

INSERT INTO routes (id, name, sector, description, tips, "openerId", "mainPhoto", "openingVideo", status, "openedAt", "closedAt", "holdMapping", "createdAt", "updatedAt", "routeTypes", "holdColorHex", "holdColorCategory", difficulty) VALUES
('d8a2d01f-6ee6-4666-acf0-a88f1d5490ca', 'Bloc 16', 'bibliothèque', 'Bloc complexe et physique - Ouvreur: Adrien C', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/800/bouldersPics/joa5yFWESd2bfGe47.jpg', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/Lit8uyeGQFupEFkEe.jpg', 'ACTIVE', '2026-01-07 00:00:00', NULL, NULL, '2026-01-07 21:01:23.24712', '2026-01-12 20:15:08.054379', '["physique", "technique", "résistance"]', '#E17B8F', 'pink', 'Gris');

-- =====================================================
-- REAL DATA - Gym Layouts
-- =====================================================

INSERT INTO gym_layouts (id, name, "svgContent", "sectorMappings", "isActive", "createdAt", "updatedAt") VALUES
('80ab65ec-e190-4bd6-91ae-22f6fa252977', 'main_gym', '<svg width="100%" height="100%" viewBox="-2 -2 80 55" xmlns="http://www.w3.org/2000/svg">
    <style>
        .sector-path {
            fill: none;
            stroke: #1e293b;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            transition: all 0.2s ease;
            cursor: pointer;
            opacity: 0.8;
        }
        .sector-zone {
            fill: rgba(203, 213, 225, 0.3);
            stroke: #1e293b;
            stroke-width: 1.5;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .sector-label {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
            font-size: 4px;
            font-weight: 700;
            fill: #64748b;
            pointer-events: none;
            user-select: none;
        }
    </style>
    <polyline points="2,15 2,2 30,2 30,5" class="sector-path" data-sector="sous-bois" />
    <text x="5" y="8" class="sector-label">1</text>
    <polygon points="10,10 20,10 20,20 10,20" class="sector-zone" data-sector="champignon" />
    <text x="15" y="16" class="sector-label" text-anchor="middle">2</text>
    <polyline points="30,5 30,25 40,25 40,2" class="sector-path" data-sector="éléphant" />
    <text x="35" y="15" class="sector-label" text-anchor="middle">3</text>
    <polyline points="40,2 55,2 55,25 70,25" class="sector-path" data-sector="podium" />
    <text x="55" y="14" class="sector-label" text-anchor="middle">4</text>
    <polyline points="73,25 73,2 55,2" class="sector-path" data-sector="high-board" />
    <text x="68" y="8" class="sector-label" text-anchor="middle">5</text>
    <polyline points="73,30 73,48 55,48 55,35" class="sector-path" data-sector="bibliothèque" />
    <text x="64" y="42" class="sector-label" text-anchor="middle">6</text>
    <line x1="45" y1="35" x2="45" y2="48" class="sector-path" data-sector="backstage" />
    <text x="45" y="32" class="sector-label" text-anchor="middle">7</text>
    <line x1="38" y1="35" x2="38" y2="48" class="sector-path" data-sector="bigwall" />
    <text x="38" y="32" class="sector-label" text-anchor="middle">8</text>
    <polygon points="15,43 30,43 30,48 15,48" class="sector-zone" data-sector="macif-central" />
    <text x="22.5" y="41" class="sector-label" text-anchor="middle">9</text>
    <polyline points="2,48 2,35 10,35 10,48" class="sector-path" data-sector="lego" />
    <text x="6" y="42" class="sector-label" text-anchor="middle">10</text>
</svg>', NULL, true, '2026-01-07 20:39:36.612379', '2026-01-07 21:19:11.692195');

-- =====================================================
-- REAL DATA - Validations
-- =====================================================

INSERT INTO validations (id, "userId", "routeId", "validatedAt", "personalNote", status, attempts, "isFlashed", "isFavorite") VALUES
('082c17dc-8f1b-4d0a-a56a-406b7b783955', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'd8a2d01f-6ee6-4666-acf0-a88f1d5490ca', '2026-01-13 18:17:47.647955', NULL, 'VALIDE', 3, false, false);

-- =====================================================
-- Summary
-- =====================================================

SELECT 'Database initialized successfully!' as status;
SELECT 'Users: ' || COUNT(*) FROM users;
SELECT 'Routes: ' || COUNT(*) FROM routes;
SELECT 'Validations: ' || COUNT(*) FROM validations;
SELECT 'GymLayouts: ' || COUNT(*) FROM gym_layouts;

-- =====================================================
-- Usage Instructions:
-- =====================================================
-- 1. Create database: CREATE DATABASE climbtracker;
-- 2. Connect: \c climbtracker
-- 3. Run: \i database_complete.sql
--
-- Or via command line:
--   psql -U postgres -d climbtracker -f database_complete.sql
--
-- Default credentials (password: password123):
--   - admin@climbtracker.com (Admin)
--   - opener@climbtracker.com (Opener)
--   - climber1@climbtracker.com (Climber)
--   - climber2@climbtracker.com (Climber)
-- =====================================================
