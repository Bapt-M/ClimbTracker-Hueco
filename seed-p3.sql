-- =============================================
-- SEED P3: Validations & Comments
-- =============================================
-- This seed adds test validations and comments
-- using existing users and routes from P1 and P2
-- =============================================

-- Get existing user and route IDs
-- Users: climber1@climbtracker.com, climber2@climbtracker.com, opener1@climbtracker.com
-- Routes: Multiple routes from seed-routes.sql

-- =============================================
-- VALIDATIONS
-- =============================================

-- Climber1 validates several routes
INSERT INTO validations ("userId", "routeId", "validatedAt", "personalNote")
SELECT
  u.id,
  r.id,
  NOW() - INTERVAL '5 days',
  'Super voie pour débuter ! J''ai adoré.'
FROM users u, routes r
WHERE u.email = 'climber1@climbtracker.com'
  AND r.name = 'La Dalle du Débutant'
ON CONFLICT ("userId", "routeId") DO NOTHING;

INSERT INTO validations ("userId", "routeId", "validatedAt", "personalNote")
SELECT
  u.id,
  r.id,
  NOW() - INTERVAL '3 days',
  'Très physique mais vraiment fun !'
FROM users u, routes r
WHERE u.email = 'climber1@climbtracker.com'
  AND r.name = 'La Mur Vertical'
ON CONFLICT ("userId", "routeId") DO NOTHING;

INSERT INTO validations ("userId", "routeId", "validatedAt", "personalNote")
SELECT
  u.id,
  r.id,
  NOW() - INTERVAL '1 day',
  'Difficile mais j''ai réussi après plusieurs essais.'
FROM users u, routes r
WHERE u.email = 'climber1@climbtracker.com'
  AND r.name = 'Dièdre Technique'
ON CONFLICT ("userId", "routeId") DO NOTHING;

-- Climber2 validates some routes
INSERT INTO validations ("userId", "routeId", "validatedAt", "personalNote")
SELECT
  u.id,
  r.id,
  NOW() - INTERVAL '4 days',
  'Excellente voie pour travailler la résistance.'
FROM users u, routes r
WHERE u.email = 'climber2@climbtracker.com'
  AND r.name = 'Toit Challenge'
ON CONFLICT ("userId", "routeId") DO NOTHING;

INSERT INTO validations ("userId", "routeId", "validatedAt", "personalNote")
SELECT
  u.id,
  r.id,
  NOW() - INTERVAL '2 days',
  'Parfait pour s''échauffer.'
FROM users u, routes r
WHERE u.email = 'climber2@climbtracker.com'
  AND r.name = 'La Dalle du Débutant'
ON CONFLICT ("userId", "routeId") DO NOTHING;

INSERT INTO validations ("userId", "routeId", "validatedAt", "personalNote")
SELECT
  u.id,
  r.id,
  NOW(),
  'Joli dévers ! Les mouvements sont intéressants.'
FROM users u, routes r
WHERE u.email = 'climber2@climbtracker.com'
  AND r.name = 'Dévers Puissant'
ON CONFLICT ("userId", "routeId") DO NOTHING;

-- Opener1 validates routes
INSERT INTO validations ("userId", "routeId", "validatedAt", "personalNote")
SELECT
  u.id,
  r.id,
  NOW() - INTERVAL '6 days',
  'Belle création !'
FROM users u, routes r
WHERE u.email = 'opener1@climbtracker.com'
  AND r.name = 'La Mur Vertical'
ON CONFLICT ("userId", "routeId") DO NOTHING;

INSERT INTO validations ("userId", "routeId", "validatedAt", "personalNote")
SELECT
  u.id,
  r.id,
  NOW() - INTERVAL '4 days',
  NULL
FROM users u, routes r
WHERE u.email = 'opener1@climbtracker.com'
  AND r.name = 'Toit Challenge'
ON CONFLICT ("userId", "routeId") DO NOTHING;

-- =============================================
-- COMMENTS
-- =============================================

-- Comments on "La Dalle du Débutant"
INSERT INTO comments (content, "userId", "routeId", "createdAt", "mediaUrl", "mediaType")
SELECT
  'Excellent pour débuter ! Les prises sont grandes et bien espacées.',
  u.id,
  r.id,
  NOW() - INTERVAL '5 days',
  NULL,
  NULL
FROM users u, routes r
WHERE u.email = 'climber1@climbtracker.com'
  AND r.name = 'La Dalle du Débutant';

INSERT INTO comments (content, "userId", "routeId", "createdAt", "mediaUrl", "mediaType")
SELECT
  'Je confirme, c''est vraiment une super voie pour les débutants. Bon échauffement aussi !',
  u.id,
  r.id,
  NOW() - INTERVAL '4 days',
  NULL,
  NULL
FROM users u, routes r
WHERE u.email = 'climber2@climbtracker.com'
  AND r.name = 'La Dalle du Débutant';

-- Comments on "Toit Challenge"
INSERT INTO comments (content, "userId", "routeId", "createdAt", "mediaUrl", "mediaType")
SELECT
  'Le passage du toit est vraiment costaud ! Prenez bien le temps de regarder la vidéo avant.',
  u.id,
  r.id,
  NOW() - INTERVAL '3 days',
  NULL,
  NULL
FROM users u, routes r
WHERE u.email = 'climber2@climbtracker.com'
  AND r.name = 'Toit Challenge';

INSERT INTO comments (content, "userId", "routeId", "createdAt", "mediaUrl", "mediaType")
SELECT
  'Conseil : utilisez bien vos pieds pour passer le toit, ça économise les bras.',
  u.id,
  r.id,
  NOW() - INTERVAL '2 days',
  NULL,
  NULL
FROM users u, routes r
WHERE u.email = 'opener1@climbtracker.com'
  AND r.name = 'Toit Challenge';

-- Comments on "Dévers Puissant"
INSERT INTO comments (content, "userId", "routeId", "createdAt", "mediaUrl", "mediaType")
SELECT
  'Les mouvements sont vraiment intéressants ! Il faut bien gérer son centre de gravité.',
  u.id,
  r.id,
  NOW() - INTERVAL '1 day',
  NULL,
  NULL
FROM users u, routes r
WHERE u.email = 'climber2@climbtracker.com'
  AND r.name = 'Dévers Puissant';

-- Comments on "La Mur Vertical"
INSERT INTO comments (content, "userId", "routeId", "createdAt", "mediaUrl", "mediaType")
SELECT
  'Très bon pour travailler l''endurance. Ne lâchez pas, ça passe !',
  u.id,
  r.id,
  NOW() - INTERVAL '6 days',
  NULL,
  NULL
FROM users u, routes r
WHERE u.email = 'opener1@climbtracker.com'
  AND r.name = 'La Mur Vertical';

INSERT INTO comments (content, "userId", "routeId", "createdAt", "mediaUrl", "mediaType")
SELECT
  'J''ai mis plusieurs sessions pour la valider mais quelle satisfaction !',
  u.id,
  r.id,
  NOW() - INTERVAL '3 days',
  NULL,
  NULL
FROM users u, routes r
WHERE u.email = 'climber1@climbtracker.com'
  AND r.name = 'La Mur Vertical';

-- Comments on "Dièdre Technique"
INSERT INTO comments (content, "userId", "routeId", "createdAt", "mediaUrl", "mediaType")
SELECT
  'Il faut vraiment bien placer ses pieds. C''est très technique !',
  u.id,
  r.id,
  NOW() - INTERVAL '1 day',
  NULL,
  NULL
FROM users u, routes r
WHERE u.email = 'climber1@climbtracker.com'
  AND r.name = 'Dièdre Technique';

-- Comment with media (example with Unsplash image)
INSERT INTO comments (content, "userId", "routeId", "createdAt", "mediaUrl", "mediaType")
SELECT
  'Voici ma technique pour passer la section crux. Regardez bien le placement du pied droit !',
  u.id,
  r.id,
  NOW(),
  'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800',
  'IMAGE'
FROM users u, routes r
WHERE u.email = 'climber2@climbtracker.com'
  AND r.name = 'Toit Challenge';

-- =============================================
-- VERIFICATION
-- =============================================

-- Count validations
SELECT COUNT(*) as "Total Validations" FROM validations;

-- Count comments
SELECT COUNT(*) as "Total Comments" FROM comments;

-- Show validations per route
SELECT
  r.name as "Route",
  r.grade as "Grade",
  COUNT(v.id) as "Validations"
FROM routes r
LEFT JOIN validations v ON r.id = v."routeId"
WHERE r.status = 'ACTIVE'
GROUP BY r.id, r.name, r.grade
ORDER BY COUNT(v.id) DESC;

-- Show comments per route
SELECT
  r.name as "Route",
  COUNT(c.id) as "Comments"
FROM routes r
LEFT JOIN comments c ON r.id = c."routeId"
WHERE r.status = 'ACTIVE'
GROUP BY r.id, r.name
ORDER BY COUNT(c.id) DESC;
