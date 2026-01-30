-- Blocs Zenith - 2026-01-30T11:51:40.682523
-- Total: 145

BEGIN;

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1', 'Bleu clair', '#6b7280', 'grey', 'Bibliothèque', '[]'::jsonb, 'Bloc 1', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/7sEg7XAEFoRthob6X.jpg', 'ACTIVE', '2026-01-02', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 2', 'Violet', '#1f2937', 'black', 'Bibliothèque', '[]'::jsonb, 'Bloc 2', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/6muoZTbvWAEB6WJTm.jpg', 'ACTIVE', '2026-01-02', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 3', 'Blanc', '#6b7280', 'grey', 'Bibliothèque', '["R\u00e9sistance", "Physique", "Complexe"]'::jsonb, 'Bloc 3', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/5B6qhwPDY4PmRTygd.jpg', 'ACTIVE', '2026-01-02', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 4', 'Gris', '#ef4444', 'red', 'Bibliothèque', '["R\u00e9sistance", "Physique"]'::jsonb, 'Bloc 4', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/xLeqLBSxYqAH2XHvA.jpg', 'ACTIVE', '2026-01-02', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 5', 'Noir', '#3b82f6', 'blue', 'Bibliothèque', '["R\u00e9sistance", "Physique"]'::jsonb, 'Bloc 5', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/D6tc9r9XgyosauwXb.jpg', 'ACTIVE', '2026-01-02', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 6', 'Orange', '#3b82f6', 'blue', 'Bibliothèque', '["Physique", "Complexe"]'::jsonb, 'Bloc 6', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/vnL97cpGMkrY4M2QE.jpg', 'ACTIVE', '2026-01-06', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 7', 'Jaune', '#eab308', 'yellow', 'Bibliothèque', '[]'::jsonb, 'Bloc 7', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/hmT64chA6wwv5RZRX.jpg', 'ACTIVE', '2026-01-07', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 8', 'Gris', '#eab308', 'yellow', 'Bibliothèque', '["Complexe"]'::jsonb, 'Bloc 8', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/To6GmfAYqENcnXmcG.jpg', 'ACTIVE', '2026-01-07', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 9', 'Blanc', '#6b7280', 'grey', 'Bibliothèque', '["\u00c9quilibre"]'::jsonb, 'Bloc 9', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/saT8Fi8sgou5xZTDE.jpg', 'ACTIVE', '2026-01-07', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 10', 'Rose', '#ef4444', 'red', 'Bibliothèque', '["Physique"]'::jsonb, 'Bloc 10', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/S4Fipnd5cKXRxM6mS.jpg', 'ACTIVE', '2026-01-07', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 11', 'Orange', '#3b82f6', 'blue', 'Bibliothèque', '["Physique"]'::jsonb, 'Bloc 11', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/GM5ze5CsDjtP2mqdh.jpg', 'ACTIVE', '2026-01-07', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 12', 'Bleu foncé', '#6b7280', 'grey', 'Bibliothèque', '[]'::jsonb, 'Bloc 12', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/kCZCk3sKpGJcgnKYe.jpg', 'ACTIVE', '2026-01-07', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 13', 'Rouge', '#1f2937', 'black', 'Bibliothèque', '["Complexe"]'::jsonb, 'Bloc 13', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/CJrEXhadfyXTGhiA4.jpg', 'ACTIVE', '2026-01-07', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 14', 'Orange', '#ef4444', 'red', 'Bibliothèque', '["Complexe"]'::jsonb, 'Bloc 14', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/YDn8RtphyfmK5Bu74.jpg', 'ACTIVE', '2026-01-07', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 15', 'Jaune', '#22c55e', 'green', 'Bibliothèque', '["Complexe"]'::jsonb, 'Bloc 15', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/m2LGj62dEJRRy5D2e.jpg', 'ACTIVE', '2026-01-07', NOW(), NOW());

-- Bloc 16 existe deja

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 17', 'Violet', '#eab308', 'yellow', 'Bibliothèque', '["\u00c9quilibre"]'::jsonb, 'Bloc 17', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/3tJj3GYNShmFYk5qR.jpg', 'ACTIVE', '2026-01-08', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 18', 'Rose', '#6b7280', 'grey', 'Bibliothèque', '["\u00c9quilibre"]'::jsonb, 'Bloc 18', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/GipfC9gKvgHtcJsA8.jpg', 'ACTIVE', '2026-01-08', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 19', 'Rouge', '#ef4444', 'red', 'Bibliothèque', '["\u00c9quilibre"]'::jsonb, 'Bloc 19', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/dHPR68BAK3XZafXrx.jpg', 'ACTIVE', '2026-01-08', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 20', 'Orange', '#f3f4f6', 'white', 'Bibliothèque', '["\u00c9quilibre"]'::jsonb, 'Bloc 20', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/ozdWKjkL3yfJTKRk8.jpg', 'ACTIVE', '2026-01-08', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 21', 'Jaune', '#22c55e', 'green', 'Bibliothèque', '["\u00c9quilibre"]'::jsonb, 'Bloc 21', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/fsm42MWH5dYoRP9qx.jpg', 'ACTIVE', '2026-01-08', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 22', 'Gris', '#1f2937', 'black', 'Bibliothèque', '["\u00c9quilibre"]'::jsonb, 'Bloc 22', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/NvNHyuYrqo8c272Z4.jpg', 'ACTIVE', '2026-01-08', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 23', 'Blanc', '#ec4899', 'pink', 'Podium', '["\u00c9quilibre"]'::jsonb, 'Bloc 23', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/NTK2WHn2NqFyKC36m.jpg', 'ACTIVE', '2026-01-08', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 24', 'Noir', '#3b82f6', 'blue', 'Podium', '["\u00c9quilibre", "Run"]'::jsonb, 'Bloc 24', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/iTAKBCgg9b6dydzax.jpg', 'ACTIVE', '2026-01-08', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 25', 'Blanc', '#eab308', 'yellow', 'Podium', '["Physique"]'::jsonb, 'Bloc 25', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/7B898woBchviCbaR6.jpg', 'ACTIVE', '2026-01-08', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 26', 'Violet', '#3b82f6', 'blue', 'Podium', '["Dynamique", "Physique"]'::jsonb, 'Bloc 26', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/WZr3fuRzdRG3xRbuY.jpg', 'ACTIVE', '2026-01-09', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 27', 'Bleu clair', '#f3f4f6', 'white', 'Podium', '["Adapt\u00e9"]'::jsonb, 'Bloc 27', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/Da2ghCHhzgzmkaFMw.jpg', 'ACTIVE', '2026-01-09', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 28', 'Vert', '#1f2937', 'black', 'Podium', '["Adapt\u00e9"]'::jsonb, 'Bloc 28', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/tpTanKsLbCsH4jzL8.jpg', 'ACTIVE', '2026-01-12', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 29', 'Vert', '#eab308', 'yellow', 'Podium', '["Adapt\u00e9"]'::jsonb, 'Bloc 29', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/k6SptcGLev6pBseP8.jpg', 'ACTIVE', '2026-01-12', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 30', 'Bleu clair', '#f3f4f6', 'white', 'Podium', '["Adapt\u00e9"]'::jsonb, 'Bloc 30', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/38EbpNAvFhtExeJnS.jpg', 'ACTIVE', '2026-01-12', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 31', 'Vert', '#6b7280', 'grey', 'Podium', '["Adapt\u00e9"]'::jsonb, 'Bloc 31', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/9hCAmRRa2JYFk8XJi.jpg', 'ACTIVE', '2026-01-12', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 32', 'Bleu clair', '#6b7280', 'grey', 'Podium', '["Adapt\u00e9"]'::jsonb, 'Bloc 32', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/KhdHpzpbEsonjX2ac.jpg', 'ACTIVE', '2026-01-12', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 33', 'Vert', '#1f2937', 'black', 'Podium', '["Adapt\u00e9"]'::jsonb, 'Bloc 33', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/itEtHKuq6DPeXTPXG.jpg', 'ACTIVE', '2026-01-12', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 34', 'Bleu clair', '#ef4444', 'red', 'Podium', '["Adapt\u00e9"]'::jsonb, 'Bloc 34', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/h2HgCFaKxyHpYFcit.jpg', 'ACTIVE', '2026-01-12', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 35', 'Vert', '#3b82f6', 'blue', 'Podium', '["Adapt\u00e9"]'::jsonb, 'Bloc 35', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/oReLWuLQWnp2qsPu8.jpg', 'ACTIVE', '2026-01-12', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 36', 'Vert', '#f3f4f6', 'white', 'Podium', '["Adapt\u00e9"]'::jsonb, 'Bloc 36', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/QBcbNDSoQj4EN9f5x.jpg', 'ACTIVE', '2026-01-12', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 37', 'Vert', '#eab308', 'yellow', 'Éléphant', '["Adapt\u00e9"]'::jsonb, 'Bloc 37', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/36o3p5gB8sFcRScZu.jpg', 'ACTIVE', '2026-01-12', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 38', 'Bleu clair', '#6b7280', 'grey', 'Éléphant', '["Adapt\u00e9"]'::jsonb, 'Bloc 38', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/KXfw92iWY3mKhz7nu.jpg', 'ACTIVE', '2026-01-12', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 39', 'Blanc', '#ef4444', 'red', 'Éléphant', '["Dynamique"]'::jsonb, 'Bloc 39', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/Epx4Aotc9o5AiEi7E.jpg', 'ACTIVE', '2026-01-13', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 40', 'Rose', '#3b82f6', 'blue', 'Podium', '["Complexe"]'::jsonb, 'Bloc 40', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/gDpmQu6xbpWvgRB5Y.jpg', 'ACTIVE', '2026-01-13', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 41', 'Rouge', '#6b7280', 'grey', 'Éléphant', '["\u00c9quilibre"]'::jsonb, 'Bloc 41', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/jgAP4fzXGkBmZYW6N.jpg', 'ACTIVE', '2026-01-13', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 42', 'Bleu foncé', '#1f2937', 'black', 'Éléphant', '["Physique"]'::jsonb, 'Bloc 42', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/vK9379eDNZ6KhopAZ.jpg', 'ACTIVE', '2026-01-13', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 43', 'Gris', '#eab308', 'yellow', 'Éléphant', '["\u00c9quilibre"]'::jsonb, 'Bloc 43', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/LJ28SaAkj8JDTyDBT.jpg', 'ACTIVE', '2026-01-13', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 44', 'Rouge', '#22c55e', 'green', 'Éléphant', '["Complexe"]'::jsonb, 'Bloc 44', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/RdAx5vBtnAQi2DtXp.jpg', 'ACTIVE', '2026-01-14', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 45', 'Jaune', '#ef4444', 'red', 'Éléphant', '["Dynamique", "\u00c9quilibre", "Physique"]'::jsonb, 'Bloc 45', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/aLRHAP2fifopqh8z7.jpg', 'ACTIVE', '2026-01-14', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 46', 'Bleu clair', '#3b82f6', 'blue', 'Éléphant', '["Adapt\u00e9"]'::jsonb, 'Bloc 46', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/DokgSYxxp8rbFx2By.jpg', 'ACTIVE', '2026-01-15', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 47', 'Violet', '#f97316', 'orange', 'Éléphant', '["Physique"]'::jsonb, 'Bloc 47', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/LPPjy94SEek5tP7Rm.jpg', 'ACTIVE', '2026-01-15', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 48', 'Noir', '#f3f4f6', 'white', 'Éléphant', '["Dynamique", "Physique"]'::jsonb, 'Bloc 48', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/HtCPaDh2ZZpNSaJ5S.jpg', 'ACTIVE', '2026-01-15', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 49', 'Orange', '#ef4444', 'red', 'Éléphant', '["Dynamique", "Physique"]'::jsonb, 'Bloc 49', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/5LeotASn3yhPsxWsn.jpg', 'ACTIVE', '2026-01-15', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 50', 'Orange', '#3b82f6', 'blue', 'Éléphant', '["Complexe"]'::jsonb, 'Bloc 50', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/hLEqAqGgbdsHpCvnY.jpg', 'ACTIVE', '2026-01-15', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 51', 'Rose', '#3b82f6', 'blue', 'Éléphant', '["Physique"]'::jsonb, 'Bloc 51', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/9Sdf7NB58sozj6Ajn.jpg', 'ACTIVE', '2026-01-15', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 52', 'Rose', '#6b7280', 'grey', 'Éléphant', '[]'::jsonb, 'Bloc 52', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/qTCL6K9n5eCE4fjZN.jpg', 'ACTIVE', '2026-01-15', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 53', 'Blanc', '#3b82f6', 'blue', 'Sous-bois', '["Physique"]'::jsonb, 'Bloc 53', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/Y64ytJL7gosiyuZkM.jpg', 'ACTIVE', '2026-01-15', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 54', 'Gris', '#1f2937', 'black', 'Sous-bois', '["Dynamique", "Physique"]'::jsonb, 'Bloc 54', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/oWpQtiSMqt6eowuDk.jpg', 'ACTIVE', '2026-01-15', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 55', 'Blanc', '#eab308', 'yellow', 'Sous-bois', '["Dynamique", "Physique"]'::jsonb, 'Bloc 55', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/boFXF86o6iTiHvnPP.jpg', 'ACTIVE', '2026-01-16', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 56', 'Rouge', '#1f2937', 'black', 'Sous-bois', '["Souplesse"]'::jsonb, 'Bloc 56', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/Xzc5yJq6GKMfFLdM5.jpg', 'ACTIVE', '2026-01-16', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 57', 'Bleu clair', '#f97316', 'orange', 'Éléphant', '["R\u00e9sistance"]'::jsonb, 'Bloc 57', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/aNduhwvbJxbyoPNMh.jpg', 'ACTIVE', '2026-01-16', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 58', 'Bleu foncé', '#22c55e', 'green', 'Éléphant', '["Adapt\u00e9", "R\u00e9sistance"]'::jsonb, 'Bloc 58', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/y4YFwdh5iXsCqJFpi.jpg', 'ACTIVE', '2026-01-16', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 59', 'Violet', '#3b82f6', 'blue', 'Éléphant', '[]'::jsonb, 'Bloc 59', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/9caopjptY9PW7oXK8.jpg', 'ACTIVE', '2026-01-19', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 60', 'Rouge', '#22c55e', 'green', 'Éléphant', '["Physique"]'::jsonb, 'Bloc 60', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/PwCP92dhZ3J8aNyH2.jpg', 'ACTIVE', '2026-01-19', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 61', 'Jaune', '#3b82f6', 'blue', 'Éléphant', '["Physique"]'::jsonb, 'Bloc 61', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/qQQbBDRgEfDGmeb2e.jpg', 'ACTIVE', '2026-01-19', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 62', 'Gris', '#ef4444', 'red', 'Sous-bois', '["Dynamique", "Souplesse", "Physique", "Complexe"]'::jsonb, 'Bloc 62', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/rycR9CTjephHDxyeS.jpg', 'ACTIVE', '2026-01-19', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 63', 'Vert', '#6b7280', 'grey', 'Sous-bois', '[]'::jsonb, 'Bloc 63', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/hJ5jFBARsyQEfFkSR.jpg', 'ACTIVE', '2026-01-20', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 64', 'Violet', '#ef4444', 'red', 'Sous-bois', '["Physique"]'::jsonb, 'Bloc 64', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/cMbM59ok8jvvxiGct.jpg', 'ACTIVE', '2026-01-20', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 65', 'Blanc', '#1f2937', 'black', 'Sous-bois', '["Dynamique", "\u00c9quilibre"]'::jsonb, 'Bloc 65', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/MPnns8vkZXjtBi2EW.jpg', 'ACTIVE', '2026-01-20', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 66', 'Orange', '#f97316', 'orange', 'Sous-bois', '["Complexe"]'::jsonb, 'Bloc 66', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/EkRav4nuFt6vkyrai.jpg', 'ACTIVE', '2026-01-20', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 67', 'Gris', '#3b82f6', 'blue', 'Sous-bois', '["Complexe"]'::jsonb, 'Bloc 67', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/k8xGn92QGWmLrsRFC.jpg', 'ACTIVE', '2026-01-20', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 68', 'Rose', '#22c55e', 'green', 'Sous-bois', '["\u00c9quilibre", "Complexe"]'::jsonb, 'Bloc 68', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/DRMnhH7NPyQjz8h5N.jpg', 'ACTIVE', '2026-01-21', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 69', 'Jaune', '#ef4444', 'red', 'Sous-bois', '["\u00c9quilibre", "Complexe"]'::jsonb, 'Bloc 69', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/RJTfRkarHiH8iK3M9.jpg', 'ACTIVE', '2026-01-21', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 70', 'Blanc', '#1f2937', 'black', 'Sous-bois', '["\u00c9quilibre", "Complexe"]'::jsonb, 'Bloc 70', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/kYQPTy5hPyres6qx3.jpg', 'ACTIVE', '2026-01-21', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 71', 'Gris', '#f3f4f6', 'white', 'Sous-bois', '["\u00c9quilibre", "Complexe"]'::jsonb, 'Bloc 71', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/xjZeQAzqsJXmNRsSp.jpg', 'ACTIVE', '2026-01-21', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 72', 'Vert', '#f97316', 'orange', 'Sous-bois', '["Adapt\u00e9", "Physique"]'::jsonb, 'Bloc 72', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/AdncTdyzyMdQ3AXSL.jpg', 'ACTIVE', '2026-01-21', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 73', 'Blanc', '#22c55e', 'green', 'Sous-bois', '["Dynamique", "Complexe"]'::jsonb, 'Bloc 73', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/Qgkr8JF3u2rpEau25.jpg', 'ACTIVE', '2026-01-22', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 74', 'Rose', '#ec4899', 'pink', 'Sous-bois', '["Complexe"]'::jsonb, 'Bloc 74', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/n3Nm8G4xGfghgPzmw.jpg', 'ACTIVE', '2026-01-22', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 75', 'Rouge', '#1f2937', 'black', 'Sous-bois', '["Complexe"]'::jsonb, 'Bloc 75', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/iNJpvs2y3ZXENB3ut.jpg', 'ACTIVE', '2026-01-22', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 76', 'Orange', '#3b82f6', 'blue', 'Sous-bois', '["Physique", "Complexe"]'::jsonb, 'Bloc 76', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/SEwxjaLBa3uGgWNii.jpg', 'ACTIVE', '2026-01-22', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 77', 'Rouge', '#eab308', 'yellow', 'Sous-bois', '["\u00c9quilibre", "Souplesse"]'::jsonb, 'Bloc 77', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/ofQomK2bt4Qv8pWeh.jpg', 'ACTIVE', '2026-01-22', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 78', 'Bleu foncé', '#22c55e', 'green', 'Champignon', '[]'::jsonb, 'Bloc 78', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/L6oXWe324i9qejKQy.jpg', 'ACTIVE', '2026-01-22', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 79', 'Vert', '#f97316', 'orange', 'Champignon', '["Adapt\u00e9"]'::jsonb, 'Bloc 79', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/bJgL3dnyndoPnC2Sj.jpg', 'ACTIVE', '2026-01-23', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 80', 'Bleu foncé', '#3b82f6', 'blue', 'Champignon', '["Adapt\u00e9"]'::jsonb, 'Bloc 80', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/gu5HzWzwvCFfQFGZW.jpg', 'ACTIVE', '2026-01-23', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 82', 'Orange', '#6b7280', 'grey', 'Sous-bois', '[]'::jsonb, 'Bloc 82', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/AWEjRt38uq2wCcLmT.jpg', 'ACTIVE', '2026-01-23', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 83', 'Violet', '#f3f4f6', 'white', 'Champignon', '["Physique"]'::jsonb, 'Bloc 83', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/AcDksxD6MZbfdNydG.jpg', 'ACTIVE', '2026-01-22', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 84', 'Jaune', '#3b82f6', 'blue', 'Champignon', '["Dynamique", "Physique"]'::jsonb, 'Bloc 84', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/D4oZRLrzXpk572tDm.jpg', 'ACTIVE', '2026-01-22', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 85', 'Rose', '#3b82f6', 'blue', 'Champignon', '["\u00c9quilibre", "Complexe"]'::jsonb, 'Bloc 85', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/QNGe4fse76qyJQFKB.jpg', 'ACTIVE', '2026-01-27', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 86', 'Rose', '#6b7280', 'grey', 'Champignon', '["\u00c9quilibre", "Complexe"]'::jsonb, 'Bloc 86', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/ZdvMX8rF6necwNmBD.jpg', 'ACTIVE', '2026-01-27', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 87', 'Violet', '#eab308', 'yellow', 'Champignon', '["Complexe"]'::jsonb, 'Bloc 87', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/Xp2L7K5D67JfDk22E.jpg', 'ACTIVE', '2026-01-28', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 88', 'Jaune', '#22c55e', 'green', 'Champignon', '["Complexe"]'::jsonb, 'Bloc 88', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/tDQ8DHENEPXnFcget.jpg', 'ACTIVE', '2026-01-28', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 89', 'Bleu foncé', '#3b82f6', 'blue', 'High-board', '["Complexe"]'::jsonb, 'Bloc 89', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/nE4B2NkKHiHgmWBah.jpg', 'ACTIVE', '2026-01-28', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 90', 'Rouge', '#6b7280', 'grey', 'High-board', '[]'::jsonb, 'Bloc 90', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/xSeMRMBAwgYn5NQKx.jpg', 'ACTIVE', '2026-01-28', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 91', 'Rouge', '#eab308', 'yellow', 'Champignon', '["Physique"]'::jsonb, 'Bloc 91', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/TuggpDfcLeGcDWYmw.jpg', 'ACTIVE', '2026-01-28', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 92', 'Orange', '#f97316', 'orange', 'High-board', '["Complexe"]'::jsonb, 'Bloc 92', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/dYBwWqhrvSAG6BDdm.jpg', 'ACTIVE', '2026-01-28', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 93', 'Blanc', '#3b82f6', 'blue', 'High-board', '["Dynamique"]'::jsonb, 'Bloc 93', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/i4jbCMgXagkb6Cirx.jpg', 'ACTIVE', '2026-01-28', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 94', 'Gris', '#1f2937', 'black', 'High-board', '["Physique"]'::jsonb, 'Bloc 94', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/ZZkMwAEsQJ2ucwXxp.jpg', 'ACTIVE', '2026-01-28', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 95', 'Noir', '#22c55e', 'green', 'High-board', '["Complexe"]'::jsonb, 'Bloc 95', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/mTKDzkWMGBgko6a7Q.jpg', 'ACTIVE', '2026-01-28', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 96', 'Orange', '#eab308', 'yellow', 'High-board', '["Physique"]'::jsonb, 'Bloc 96', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/RtCGTCiXSfRT7A6JD.jpg', 'ACTIVE', '2026-01-29', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 97', 'Bleu foncé', '#f97316', 'orange', 'High-board', '["Adapt\u00e9"]'::jsonb, 'Bloc 97', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/tf8eJsXu7dTJbkYaQ.jpg', 'ACTIVE', '2026-01-29', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 98', 'Noir', '#ef4444', 'red', 'Champignon', '["Physique", "Complexe"]'::jsonb, 'Bloc 98', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/F57i8S6frmpv6yH8a.jpg', 'ACTIVE', '2026-01-29', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 99', 'Violet', '#6b7280', 'grey', 'Champignon', '["R\u00e9sistance"]'::jsonb, 'Bloc 99', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/zK8xXWyKS4ACZuD65.jpg', 'ACTIVE', '2026-01-29', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 100', 'Rouge', '#3b82f6', 'blue', 'Champignon', '["Physique", "Complexe"]'::jsonb, 'Bloc 100', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/5vB6nsCzMQe84shDK.jpg', 'ACTIVE', '2026-01-29', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 101', 'Orange', '#22c55e', 'green', 'Champignon', '["Souplesse"]'::jsonb, 'Bloc 101', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/n6ti3BYPFinKFRt5L.jpg', 'ACTIVE', '2026-01-29', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 102', 'Rose', '#ec4899', 'pink', 'Champignon', '["Souplesse"]'::jsonb, 'Bloc 102', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/Lsz6JxpNLj2AxqEgD.jpg', 'ACTIVE', '2026-01-29', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 103', 'Orange', '#1f2937', 'black', 'Champignon', '["Complexe"]'::jsonb, 'Bloc 103', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/6C9nFo5bGRkqn29DR.jpg', 'ACTIVE', '2026-01-29', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 104', 'Vert', '#eab308', 'yellow', 'Champignon', '[]'::jsonb, 'Bloc 104', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/WpPYnrtGnn3FKh4wZ.jpg', 'ACTIVE', '2026-01-30', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 871', 'Vert', '#1f2937', 'black', 'Zenith', '[]'::jsonb, 'Bloc 871', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/800/bouldersPics/joa5yFWESd2bfGe47.jpg', 'ACTIVE', '2026-01-30', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 872', 'Bleu foncé', '#eab308', 'yellow', 'Zenith', '[]'::jsonb, 'Bloc 872', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/800/bouldersPics/joa5yFWESd2bfGe47.jpg', 'ACTIVE', '2026-01-30', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 873', 'Vert', '#3b82f6', 'blue', 'Bigwall', '[]'::jsonb, 'Bloc 873', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/RRJz2FEegCkepK3qp.jpg', 'ACTIVE', '2025-07-11', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 874', 'Bleu clair', '#ec4899', 'pink', 'Bigwall', '[]'::jsonb, 'Bloc 874', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/z63PXxGBxCitHcZpF.jpg', 'ACTIVE', '2025-07-11', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 875', 'Vert', '#1f2937', 'black', 'Bigwall', '[]'::jsonb, 'Bloc 875', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/HQWBeEiGyHTozcKnt.jpg', 'ACTIVE', '2025-07-11', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 876', 'Vert', '#22c55e', 'green', 'Bigwall', '[]'::jsonb, 'Bloc 876', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/XW2YFqirD3MC9xWXR.jpg', 'ACTIVE', '2025-07-11', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 877', 'Vert', '#1f2937', 'black', 'Bigwall', '[]'::jsonb, 'Bloc 877', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/hHoQdRvNNELbni9Xq.jpg', 'ACTIVE', '2025-07-11', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 878', 'Bleu clair', '#3b82f6', 'blue', 'Bigwall', '[]'::jsonb, 'Bloc 878', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/AdyceQuWn3DkhD2TH.jpg', 'ACTIVE', '2025-07-11', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 879', 'Vert', '#ef4444', 'red', 'Lego', '[]'::jsonb, 'Bloc 879', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/bE8NyAbo3nwAqHGdu.jpg', 'ACTIVE', '2025-07-11', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1073', 'Orange', '#f3f4f6', 'white', 'Lego', '["R\u00e9sistance", "Physique"]'::jsonb, 'Bloc 1073', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/jMEZrnLCB3nugB9QP.jpg', 'ACTIVE', '2025-09-06', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1077', 'Bleu clair', '#1f2937', 'black', 'Bigwall', '["\u00c9quilibre"]'::jsonb, 'Bloc 1077', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/gPH62QgrPZezkqs8i.jpg', 'ACTIVE', '2025-09-06', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1078', 'Violet', '#eab308', 'yellow', 'Backstage', '["Physique"]'::jsonb, 'Bloc 1078', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/BbeWkTRFNCkhJfNTr.jpg', 'ACTIVE', '2025-09-06', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1079', 'Rose', '#eab308', 'yellow', 'Backstage', '["R\u00e9sistance"]'::jsonb, 'Bloc 1079', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/7QGqZ6kyatovYzush.jpg', 'ACTIVE', '2025-09-06', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1080', 'Bleu foncé', '#eab308', 'yellow', 'Massif central', '["Souplesse", "Physique"]'::jsonb, 'Bloc 1080', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/ZFB2wmLDeua7mGBET.jpg', 'ACTIVE', '2025-09-06', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1081', 'Vert', '#eab308', 'yellow', 'Massif central', '["Adapt\u00e9"]'::jsonb, 'Bloc 1081', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/jc8FgBZHm4fmsCAxu.jpg', 'ACTIVE', '2025-09-06', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1082', 'Bleu clair', '#eab308', 'yellow', 'Massif central', '[]'::jsonb, 'Bloc 1082', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/zWSeBXrWCo9AG3dL8.jpg', 'ACTIVE', '2025-09-06', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1126', 'Bleu clair', '#ef4444', 'red', 'Massif central', '["R\u00e9sistance", "Physique"]'::jsonb, 'Bloc 1126', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/95RDbHkX2tXq2nrDS.jpg', 'ACTIVE', '2025-09-19', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1212', 'Orange', '#6b7280', 'grey', 'Massif central', '["Complexe"]'::jsonb, 'Bloc 1212', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/yDnLNBJzJdaKehuXt.jpg', 'ACTIVE', '2025-10-09', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1213', 'Orange', '#ef4444', 'red', 'Massif central', '["\u00c9quilibre", "Complexe"]'::jsonb, 'Bloc 1213', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/Twe9YQbQMBM4tSCXP.jpg', 'ACTIVE', '2025-10-09', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1217', 'Bleu clair', '#22c55e', 'green', 'Backstage', '["Physique"]'::jsonb, 'Bloc 1217', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/kvQL27HgZSEbWstL8.jpg', 'ACTIVE', '2025-10-09', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1218', 'Rouge', '#eab308', 'yellow', 'Backstage', '[]'::jsonb, 'Bloc 1218', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/Mjixty5QWd8zG8w2k.jpg', 'ACTIVE', '2025-10-09', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1219', 'Violet', '#3b82f6', 'blue', 'Massif central', '["Physique"]'::jsonb, 'Bloc 1219', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/Q3sKrjod5DXnAxE7F.jpg', 'ACTIVE', '2025-10-09', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1220', 'Rose', '#22c55e', 'green', 'Massif central', '[]'::jsonb, 'Bloc 1220', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/MfpWenAKBqZzBYPyP.jpg', 'ACTIVE', '2025-10-09', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1221', 'Bleu foncé', '#3b82f6', 'blue', 'Bibliothèque', '[]'::jsonb, 'Bloc 1221', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/Hp85iD4SGwathGfzE.jpg', 'ACTIVE', '2025-10-09', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1222', 'Rouge', '#eab308', 'yellow', 'Sous-bois', '[]'::jsonb, 'Bloc 1222', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/mDh6yepvc3txMExcM.jpg', 'ACTIVE', '2025-10-09', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1223', 'Bleu foncé', '#22c55e', 'green', 'Champignon', '["Complexe"]'::jsonb, 'Bloc 1223', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/tZgycwySZAAuDFzTF.jpg', 'ACTIVE', '2025-10-10', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1225', 'Bleu foncé', '#3b82f6', 'blue', 'Champignon', '["Physique"]'::jsonb, 'Bloc 1225', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/iam44zMMttfLJkRXS.jpg', 'ACTIVE', '2025-10-10', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1335', 'Rose', '#eab308', 'yellow', 'Champignon', '[]'::jsonb, 'Bloc 1335', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/LuJzE2YGe5cd6sw6M.jpg', 'ACTIVE', '2025-11-06', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1427', 'Vert', '#22c55e', 'green', 'High-board', '["Adapt\u00e9"]'::jsonb, 'Bloc 1427', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/2g7q3HTZdHvTuhLoT.jpg', 'ACTIVE', '2025-12-03', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1472', 'Vert', '#6b7280', 'grey', 'High-board', '["Adapt\u00e9"]'::jsonb, 'Bloc 1472', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/BvHEGemYd6ZE7YjqZ.jpg', 'ACTIVE', '2025-12-08', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1493', 'Vert', '#6b7280', 'grey', 'Champignon', '["Adapt\u00e9"]'::jsonb, 'Bloc 1493', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/3HAnLPpF5tGhdPG9H.jpg', 'ACTIVE', '2025-12-18', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1494', 'Vert', '#eab308', 'yellow', 'High-board', '["Adapt\u00e9"]'::jsonb, 'Bloc 1494', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/sqM5mmNQGndLYnPaT.jpg', 'ACTIVE', '2025-12-18', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1495', 'Vert', '#f97316', 'orange', 'High-board', '["Adapt\u00e9"]'::jsonb, 'Bloc 1495', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/vSbmy8AM9Mt2DBSaJ.jpg', 'ACTIVE', '2025-12-18', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1497', 'Bleu clair', '#1f2937', 'black', 'High-board', '["Adapt\u00e9"]'::jsonb, 'Bloc 1497', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/aR3eQcqtJy9iSbs3N.jpg', 'ACTIVE', '2025-12-18', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1509', 'Rose', '#22c55e', 'green', 'High-board', '["R\u00e9sistance", "Physique"]'::jsonb, 'Bloc 1509', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/7JbW6Yfb4nJPDfcYR.jpg', 'ACTIVE', '2025-12-26', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1510', 'Orange', '#f3f4f6', 'white', 'High-board', '["R\u00e9sistance", "Physique", "Complexe"]'::jsonb, 'Bloc 1510', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/v5RAdiGijDehowgK2.jpg', 'ACTIVE', '2025-12-26', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1512', 'Bleu clair', '#ec4899', 'pink', 'High-board', '["Adapt\u00e9"]'::jsonb, 'Bloc 1512', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/kBKY24accbAAdvZ7s.jpg', 'ACTIVE', '2025-12-27', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1513', 'Orange', '#3b82f6', 'blue', 'High-board', '["Physique", "Complexe"]'::jsonb, 'Bloc 1513', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/C8GmapB9MavCvaf9P.jpg', 'ACTIVE', '2025-12-29', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1514', 'Gris', '#3b82f6', 'blue', 'High-board', '["Dynamique", "Souplesse", "Physique", "Complexe"]'::jsonb, 'Bloc 1514', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/D7aRdnQ6AJsQHzD98.jpg', 'ACTIVE', '2025-12-30', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1515', 'Jaune', '#ef4444', 'red', 'High-board', '["R\u00e9sistance", "Physique"]'::jsonb, 'Bloc 1515', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/7PSNLNN4SjA6DXWJG.jpg', 'ACTIVE', '2025-12-30', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1516', 'Rouge', '#eab308', 'yellow', 'High-board', '["Dynamique", "R\u00e9sistance", "Physique"]'::jsonb, 'Bloc 1516', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/X6rP43Yn63dfWxzuu.jpg', 'ACTIVE', '2025-12-30', NOW(), NOW());

INSERT INTO routes (id, name, difficulty, "holdColorHex", "holdColorCategory", sector, "routeTypes", description, tips, "openerId", "mainPhoto", status, "openedAt", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Bloc 1517', 'Rouge', '#6b7280', 'grey', 'Bibliothèque', '["R\u00e9sistance", "Physique"]'::jsonb, 'Bloc 1517', '', '57f59f9a-432e-46e2-a4fd-1df817b5b52f', 'https://socialboulder.s3-eu-west-1.amazonaws.com/bouldersZooms/FeyTfYJFe6FdgFK8i.jpg', 'ACTIVE', '2025-12-30', NOW(), NOW());

COMMIT;
