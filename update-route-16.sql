-- Update route #16 with detailed information from socialboulder
UPDATE routes
SET
    "mainPhoto" = 'https://socialboulder.s3-eu-west-1.amazonaws.com/800/bouldersPics/joa5yFWESd2bfGe47.jpg',
    "openingVideo" = 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/Lit8uyeGQFupEFkEe.jpg',
    description = 'Bloc complexe et physique - Ouvreur: Adrien C',
    "routeTypes" = '["physique", "technique", "résistance"]'::jsonb,
    "openedAt" = '2026-01-07',
    "updatedAt" = NOW()
WHERE name = 'Bloc 16';
