import 'reflect-metadata';
import { config } from 'dotenv';
import { join } from 'path';
import * as fs from 'fs';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Route } from '../entities/Route';
import { Validation } from '../entities/Validation';
import { Comment } from '../entities/Comment';
import { Video } from '../entities/Video';
import { Analysis } from '../entities/Analysis';
import { GymLayout } from '../entities/GymLayout';
import { Friendship } from '../entities/Friendship';

config({ path: join(__dirname, '../../../.env') });

const exportData = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    // Fetch all data
    const users = await AppDataSource.getRepository(User).find();
    const routes = await AppDataSource.getRepository(Route).find();
    const validations = await AppDataSource.getRepository(Validation).find();
    const comments = await AppDataSource.getRepository(Comment).find();
    const videos = await AppDataSource.getRepository(Video).find();
    const analyses = await AppDataSource.getRepository(Analysis).find();
    const gymLayouts = await AppDataSource.getRepository(GymLayout).find();
    const friendships = await AppDataSource.getRepository(Friendship).find();

    // Generate SQL INSERT statements
    let sql = `-- =====================================================
-- ClimbTracker Database Export
-- Generated at: ${new Date().toISOString()}
-- =====================================================

-- Clear existing data (in correct order)
DELETE FROM analyses;
DELETE FROM videos;
DELETE FROM comments;
DELETE FROM validations;
DELETE FROM friendships;
DELETE FROM routes;
DELETE FROM gym_layouts;
DELETE FROM users;

`;

    // Export Users
    if (users.length > 0) {
      sql += `-- Users (${users.length} records)\n`;
      for (const u of users) {
        sql += `INSERT INTO users (id, email, password, name, role, avatar, bio, "firstName", "lastName", age, height, wingspan, "profilePhoto", "additionalPhotos", "createdAt", "updatedAt") VALUES (
  '${u.id}',
  '${u.email.replace(/'/g, "''")}',
  '${u.password}',
  '${u.name.replace(/'/g, "''")}',
  '${u.role}',
  ${u.avatar ? `'${u.avatar}'` : 'NULL'},
  ${u.bio ? `'${u.bio.replace(/'/g, "''")}'` : 'NULL'},
  ${u.firstName ? `'${u.firstName.replace(/'/g, "''")}'` : 'NULL'},
  ${u.lastName ? `'${u.lastName.replace(/'/g, "''")}'` : 'NULL'},
  ${u.age ?? 'NULL'},
  ${u.height ?? 'NULL'},
  ${u.wingspan ?? 'NULL'},
  ${u.profilePhoto ? `'${u.profilePhoto}'` : 'NULL'},
  ${u.additionalPhotos ? `'${JSON.stringify(u.additionalPhotos).replace(/'/g, "''")}'` : 'NULL'},
  '${u.createdAt.toISOString()}',
  '${u.updatedAt.toISOString()}'
);\n`;
      }
      sql += '\n';
    }

    // Export Routes
    if (routes.length > 0) {
      sql += `-- Routes (${routes.length} records)\n`;
      for (const r of routes) {
        sql += `INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", "openingVideo", status, "openedAt", "closedAt", "holdMapping", "createdAt", "updatedAt") VALUES (
  '${r.id}',
  '${r.name.replace(/'/g, "''")}',
  '${r.difficulty}',
  '${r.holdColorHex}',
  '${r.holdColorCategory}',
  '${r.sector.replace(/'/g, "''")}',
  ${r.routeTypes ? `'${JSON.stringify(r.routeTypes).replace(/'/g, "''")}'` : 'NULL'},
  ${r.description ? `'${r.description.replace(/'/g, "''")}'` : 'NULL'},
  ${r.tips ? `'${r.tips.replace(/'/g, "''")}'` : 'NULL'},
  '${r.openerId}',
  '${r.mainPhoto}',
  ${r.openingVideo ? `'${r.openingVideo}'` : 'NULL'},
  '${r.status}',
  '${r.openedAt.toISOString()}',
  ${r.closedAt ? `'${r.closedAt.toISOString()}'` : 'NULL'},
  ${r.holdMapping ? `'${JSON.stringify(r.holdMapping).replace(/'/g, "''")}'` : 'NULL'},
  '${r.createdAt.toISOString()}',
  '${r.updatedAt.toISOString()}'
);\n`;
      }
      sql += '\n';
    }

    // Export Validations
    if (validations.length > 0) {
      sql += `-- Validations (${validations.length} records)\n`;
      for (const v of validations) {
        sql += `INSERT INTO validations (id, "userId", "routeId", "validatedAt", "personalNote", status, attempts, "isFlashed", "isFavorite") VALUES (
  '${v.id}',
  '${v.userId}',
  '${v.routeId}',
  '${v.validatedAt.toISOString()}',
  ${v.personalNote ? `'${v.personalNote.replace(/'/g, "''")}'` : 'NULL'},
  '${v.status}',
  ${v.attempts},
  ${v.isFlashed},
  ${v.isFavorite}
);\n`;
      }
      sql += '\n';
    }

    // Export Comments
    if (comments.length > 0) {
      sql += `-- Comments (${comments.length} records)\n`;
      for (const c of comments) {
        sql += `INSERT INTO comments (id, content, "userId", "routeId", "createdAt", "mediaUrl", "mediaType") VALUES (
  '${c.id}',
  '${c.content.replace(/'/g, "''")}',
  '${c.userId}',
  '${c.routeId}',
  '${c.createdAt.toISOString()}',
  ${c.mediaUrl ? `'${c.mediaUrl}'` : 'NULL'},
  ${c.mediaType ? `'${c.mediaType}'` : 'NULL'}
);\n`;
      }
      sql += '\n';
    }

    // Export Videos
    if (videos.length > 0) {
      sql += `-- Videos (${videos.length} records)\n`;
      for (const v of videos) {
        sql += `INSERT INTO videos (id, url, "thumbnailUrl", "userId", "routeId", "uploadedAt") VALUES (
  '${v.id}',
  '${v.url}',
  '${v.thumbnailUrl}',
  '${v.userId}',
  '${v.routeId}',
  '${v.uploadedAt.toISOString()}'
);\n`;
      }
      sql += '\n';
    }

    // Export Analyses
    if (analyses.length > 0) {
      sql += `-- Analyses (${analyses.length} records)\n`;
      for (const a of analyses) {
        sql += `INSERT INTO analyses (id, "videoId", "routeId", "poseData", "globalScore", "detailScores", suggestions, highlights, "createdAt") VALUES (
  '${a.id}',
  '${a.videoId}',
  '${a.routeId}',
  '${JSON.stringify(a.poseData).replace(/'/g, "''")}',
  ${a.globalScore},
  '${JSON.stringify(a.detailScores).replace(/'/g, "''")}',
  '${JSON.stringify(a.suggestions).replace(/'/g, "''")}',
  '${JSON.stringify(a.highlights).replace(/'/g, "''")}',
  '${a.createdAt.toISOString()}'
);\n`;
      }
      sql += '\n';
    }

    // Export GymLayouts
    if (gymLayouts.length > 0) {
      sql += `-- GymLayouts (${gymLayouts.length} records)\n`;
      for (const g of gymLayouts) {
        sql += `INSERT INTO gym_layouts (id, name, "svgContent", "sectorMappings", "isActive", "createdAt", "updatedAt") VALUES (
  '${g.id}',
  '${g.name.replace(/'/g, "''")}',
  '${g.svgContent.replace(/'/g, "''")}',
  ${g.sectorMappings ? `'${JSON.stringify(g.sectorMappings).replace(/'/g, "''")}'` : 'NULL'},
  ${g.isActive},
  '${g.createdAt.toISOString()}',
  '${g.updatedAt.toISOString()}'
);\n`;
      }
      sql += '\n';
    }

    // Export Friendships
    if (friendships.length > 0) {
      sql += `-- Friendships (${friendships.length} records)\n`;
      for (const f of friendships) {
        sql += `INSERT INTO friendships (id, "requesterId", "addresseeId", status, "createdAt", "acceptedAt") VALUES (
  '${f.id}',
  '${f.requesterId}',
  '${f.addresseeId}',
  '${f.status}',
  '${f.createdAt.toISOString()}',
  ${f.acceptedAt ? `'${f.acceptedAt.toISOString()}'` : 'NULL'}
);\n`;
      }
      sql += '\n';
    }

    // Add summary
    sql += `-- =====================================================
-- Export Summary:
-- Users: ${users.length}
-- Routes: ${routes.length}
-- Validations: ${validations.length}
-- Comments: ${comments.length}
-- Videos: ${videos.length}
-- Analyses: ${analyses.length}
-- GymLayouts: ${gymLayouts.length}
-- Friendships: ${friendships.length}
-- =====================================================
`;

    // Write to file
    const outputPath = join(__dirname, '../../../../database_export.sql');
    fs.writeFileSync(outputPath, sql);
    console.log(`✅ Data exported to: ${outputPath}`);

    // Summary
    console.log('\n📊 Export Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Routes: ${routes.length}`);
    console.log(`   Validations: ${validations.length}`);
    console.log(`   Comments: ${comments.length}`);
    console.log(`   Videos: ${videos.length}`);
    console.log(`   Analyses: ${analyses.length}`);
    console.log(`   GymLayouts: ${gymLayouts.length}`);
    console.log(`   Friendships: ${friendships.length}`);

    await AppDataSource.destroy();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
};

exportData();
