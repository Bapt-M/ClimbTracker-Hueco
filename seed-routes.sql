-- Seed script for ClimbTracker routes (P2)
-- 8 test routes with various grades, colors, and sectors

-- Get user IDs
DO $$
DECLARE
    opener_id UUID;
    admin_id UUID;
BEGIN
    -- Get opener user ID
    SELECT id INTO opener_id FROM users WHERE email = 'opener@climbtracker.com' LIMIT 1;
    -- Get admin user ID
    SELECT id INTO admin_id FROM users WHERE email = 'admin@climbtracker.com' LIMIT 1;

    -- Insert 8 test routes
    INSERT INTO routes (id, name, grade, color, sector, description, tips, "openerId", "mainPhoto", "openingVideo", status, "openedAt", "createdAt", "updatedAt")
    VALUES
    -- Route 1: Easy yellow route
    (
        gen_random_uuid(),
        'La Dalle du Débutant',
        '4b',
        'yellow',
        'A',
        'Une belle dalle parfaite pour débuter en escalade. Prises généreuses et progression logique.',
        'Pensez à bien utiliser vos pieds ! La clé est dans les jambes.',
        opener_id,
        'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800',
        NULL,
        'ACTIVE',
        NOW() - INTERVAL '45 days',
        NOW() - INTERVAL '45 days',
        NOW()
    ),

    -- Route 2: Technical overhang
    (
        gen_random_uuid(),
        'Le Surplomb Technique',
        '6b',
        'blue',
        'devers',
        'Un beau dévers technique avec des mouvements de compression. Nécessite de la force dans les bras.',
        'Gardez les hanches près du mur et respirez entre les mouvements.',
        opener_id,
        'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
        NULL,
        'ACTIVE',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        NOW()
    ),

    -- Route 3: Crimps master
    (
        gen_random_uuid(),
        'Crimps Master',
        '7a',
        'red',
        'C',
        'Voie exigeante avec beaucoup de réglettes. Pour grimpeurs confirmés uniquement.',
        'Travaillez la technique de doigts et prenez le temps de bien placer vos prises.',
        admin_id,
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        NULL,
        'ACTIVE',
        NOW() - INTERVAL '20 days',
        NOW() - INTERVAL '20 days',
        NOW()
    ),

    -- Route 4: Easy green
    (
        gen_random_uuid(),
        'La Verte Facile',
        '5a',
        'green',
        'B',
        'Voie d''initiation au 5a avec de bonnes prises. Parfaite pour progresser.',
        'N''hésitez pas à prendre votre temps pour lire la voie.',
        opener_id,
        'https://images.unsplash.com/photo-1599846429173-c719c53aad3a?w=800',
        NULL,
        'ACTIVE',
        NOW() - INTERVAL '15 days',
        NOW() - INTERVAL '15 days',
        NOW()
    ),

    -- Route 5: Roof challenge with video
    (
        gen_random_uuid(),
        'Toit Challenge',
        '6c+',
        'purple',
        'toit',
        'Un toit impressionnant qui demande de la force et de la technique. Le crux est au milieu.',
        'Utilisez vos talons ! La vidéo montre la méthode beta recommandée.',
        opener_id,
        'https://images.unsplash.com/photo-1522163723043-478ef79a5bb4?w=800',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'ACTIVE',
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '10 days',
        NOW()
    ),

    -- Route 6: Pending new creation
    (
        gen_random_uuid(),
        'Nouvelle Création',
        '5c',
        'orange',
        'D',
        'Nouvelle voie en attente de validation. Combinaison de dalle et de dévers.',
        'À tester ! Feedbacks bienvenus.',
        opener_id,
        'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=800',
        NULL,
        'PENDING',
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '2 days',
        NOW()
    ),

    -- Route 7: Archived old route
    (
        gen_random_uuid(),
        'L''Ancienne',
        '5b',
        'black',
        'A',
        'Ancienne voie archivée. Les prises ont été changées.',
        'Cette voie n''existe plus.',
        admin_id,
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
        NULL,
        'ARCHIVED',
        NOW() - INTERVAL '60 days',
        NOW() - INTERVAL '60 days',
        NOW()
    ),

    -- Route 8: Pink power slab
    (
        gen_random_uuid(),
        'Pink Power',
        '6a',
        'pink',
        'dalle',
        'Belle dalle rose avec des mouvements d''équilibre. Technique avant tout !',
        'Concentrez-vous sur le placement des pieds et l''équilibre.',
        opener_id,
        'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800',
        NULL,
        'ACTIVE',
        NOW() - INTERVAL '25 days',
        NOW() - INTERVAL '25 days',
        NOW()
    );

    RAISE NOTICE '✅ 8 test routes inserted successfully!';

END $$;
