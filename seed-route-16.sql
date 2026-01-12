-- Insert route #16 from socialboulder data
-- First, get an existing user ID to use as opener
DO $$
DECLARE
    opener_user_id uuid;
BEGIN
    -- Get the first ADMIN or OPENER user
    SELECT id INTO opener_user_id
    FROM users
    WHERE role IN ('ADMIN', 'OPENER')
    LIMIT 1;

    -- If no opener found, get any user
    IF opener_user_id IS NULL THEN
        SELECT id INTO opener_user_id FROM users LIMIT 1;
    END IF;

    -- Insert the route
    INSERT INTO routes (
        id,
        name,
        grade,
        "holdColorHex",
        "holdColorCategory",
        sector,
        description,
        "openerId",
        "mainPhoto",
        status,
        "openedAt",
        "createdAt",
        "updatedAt"
    ) VALUES (
        uuid_generate_v4(),
        'Bloc 16',                                      -- name
        'Expert',                                       -- grade (gris = niveau difficile)
        '#ec4899',                                      -- holdColorHex (rose/pink)
        'pink',                                         -- holdColorCategory
        'bibliothèque',                                 -- sector
        'Bloc importé depuis socialboulder',            -- description
        opener_user_id,                                 -- openerId
        'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/Lit8uyeGQFupEFkEe.jpg', -- mainPhoto
        'ACTIVE',                                       -- status
        NOW(),                                          -- openedAt
        NOW(),                                          -- createdAt
        NOW()                                           -- updatedAt
    )
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Route #16 inserted successfully with opener ID: %', opener_user_id;
END $$;
