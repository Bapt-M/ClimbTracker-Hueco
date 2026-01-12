-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pg_crypto";

-- Create enum types
CREATE TYPE "Role" AS ENUM ('CLIMBER', 'OPENER', 'ADMIN');
CREATE TYPE "RouteStatus" AS ENUM ('PENDING', 'ACTIVE', 'ARCHIVED');
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- Create User table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIMBER',
    "avatar" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create Route table
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "description" TEXT,
    "tips" TEXT,
    "openerId" TEXT NOT NULL,
    "mainPhoto" TEXT NOT NULL,
    "openingVideo" TEXT,
    "status" "RouteStatus" NOT NULL DEFAULT 'PENDING',
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "holdMapping" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- Create Validation table
CREATE TABLE "Validation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "validatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "personalNote" TEXT,

    CONSTRAINT "Validation_pkey" PRIMARY KEY ("id")
);

-- Create Comment table
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mediaUrl" TEXT,
    "mediaType" "MediaType",

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- Create Video table
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- Create Analysis table
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "poseData" JSONB NOT NULL,
    "globalScore" DOUBLE PRECISION NOT NULL,
    "detailScores" JSONB NOT NULL,
    "suggestions" JSONB NOT NULL,
    "highlights" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Validation_userId_routeId_key" ON "Validation"("userId", "routeId");
CREATE UNIQUE INDEX "Analysis_videoId_key" ON "Analysis"("videoId");

-- Create foreign keys
ALTER TABLE "Route" ADD CONSTRAINT "Route_openerId_fkey" FOREIGN KEY ("openerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Validation" ADD CONSTRAINT "Validation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Validation" ADD CONSTRAINT "Validation_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Video" ADD CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
