import { z } from 'zod';
import { RouteStatus, DifficultyColor, HoldColorCategory } from '../database/entities/Route';

// Difficulty colors (12 levels dans le bon ordre)
const DIFFICULTY_COLORS = [
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
  'Noir',
] as const;

// Hold color categories
const HOLD_COLOR_CATEGORIES = [
  'red',
  'blue',
  'green',
  'yellow',
  'orange',
  'purple',
  'pink',
  'black',
  'white',
  'grey',
] as const;

// Physical sectors - Dynamic based on gym layout, so we accept any string
// const SECTORS = ['A', 'B', 'C', 'D'] as const;

// Route types (climbing characteristics)
const ROUTE_TYPES = [
  'réglette',
  'dévers',
  'dalle',
  'toit',
  'vertical',
  'arête',
  'dièdre',
  'technique',
  'physique',
  'résistance',
  'bloc',
  'continuous',
  'dynamic',
  'static',
  'coordination',
  'balance',
] as const;

export const createRouteSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  difficulty: z.enum(DIFFICULTY_COLORS, { errorMap: () => ({ message: 'Invalid difficulty color' }) }),
  holdColorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Hold color must be a valid hex color (e.g. #FF5733)'),
  holdColorCategory: z.enum(HOLD_COLOR_CATEGORIES, { errorMap: () => ({ message: 'Invalid hold color category' }) }),
  sector: z.string().min(1, 'Sector is required').max(50),
  routeTypes: z.array(z.enum(ROUTE_TYPES)).optional(),
  description: z.string().max(1000).optional(),
  tips: z.string().max(1000).optional(),
  mainPhoto: z.string().url('Main photo must be a valid URL'),
  openingVideo: z.string().url('Opening video must be a valid URL').optional(),
});

export const updateRouteSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  difficulty: z.enum(DIFFICULTY_COLORS).optional(),
  holdColorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Hold color must be a valid hex color').optional(),
  holdColorCategory: z.enum(HOLD_COLOR_CATEGORIES).optional(),
  sector: z.string().min(1).max(50).optional(),
  routeTypes: z.array(z.enum(ROUTE_TYPES)).optional(),
  description: z.string().max(1000).optional(),
  tips: z.string().max(1000).optional(),
  mainPhoto: z.string().url().optional(),
  openingVideo: z.string().url().optional(),
});

export const updateRouteStatusSchema = z.object({
  status: z.nativeEnum(RouteStatus),
});

export const routeFiltersSchema = z.object({
  difficulty: z.union([z.enum(DIFFICULTY_COLORS), z.array(z.enum(DIFFICULTY_COLORS))]).optional(),
  sector: z.union([z.string(), z.array(z.string())]).optional(),
  holdColorCategory: z.union([z.enum(HOLD_COLOR_CATEGORIES), z.array(z.enum(HOLD_COLOR_CATEGORIES))]).optional(),
  routeTypes: z.union([z.enum(ROUTE_TYPES), z.array(z.enum(ROUTE_TYPES))]).optional(),
  status: z.union([z.nativeEnum(RouteStatus), z.array(z.nativeEnum(RouteStatus))]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  sortField: z.enum(['createdAt', 'openedAt', 'name', 'difficulty']).optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});
