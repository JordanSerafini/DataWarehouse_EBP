-- Migration 011 : Créer des utilisateurs de test
-- Tous avec le mot de passe : pass123

-- Hash bcrypt pour "pass123" (10 rounds)
-- $2b$10$YQ98PmKt.yL7RJJqN4W9MeqZ8Zx5Q8MvN3zZ7kX9J0nN5qK8rL9Ym

BEGIN;

-- Vérifier que la table existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'mobile' AND table_name = 'users') THEN
    RAISE EXCEPTION 'Table mobile.users does not exist. Run migration 009 first.';
  END IF;
END $$;

-- Supprimer les utilisateurs de test existants (si présents)
DELETE FROM mobile.users WHERE email LIKE '%@test.local';

-- Insérer les utilisateurs de test
-- Mot de passe : pass123 pour tous

-- 1. Super Admin
INSERT INTO mobile.users (id, email, password_hash, role, colleague_id, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@test.local',
  '$2b$10$YQ98PmKt.yL7RJJqN4W9MeqZ8Zx5Q8MvN3zZ7kX9J0nN5qK8rL9Ym',
  'SUPER_ADMIN',
  NULL,
  true,
  NOW(),
  NOW()
);

-- 2. Admin
INSERT INTO mobile.users (id, email, password_hash, role, colleague_id, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'manager@test.local',
  '$2b$10$YQ98PmKt.yL7RJJqN4W9MeqZ8Zx5Q8MvN3zZ7kX9J0nN5qK8rL9Ym',
  'ADMIN',
  NULL,
  true,
  NOW(),
  NOW()
);

-- 3. Patron
INSERT INTO mobile.users (id, email, password_hash, role, colleague_id, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'patron@test.local',
  '$2b$10$YQ98PmKt.yL7RJJqN4W9MeqZ8Zx5Q8MvN3zZ7kX9J0nN5qK8rL9Ym',
  'PATRON',
  NULL,
  true,
  NOW(),
  NOW()
);

-- 4. Chef de chantier
INSERT INTO mobile.users (id, email, password_hash, role, colleague_id, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'chef@test.local',
  '$2b$10$YQ98PmKt.yL7RJJqN4W9MeqZ8Zx5Q8MvN3zZ7kX9J0nN5qK8rL9Ym',
  'CHEF_CHANTIER',
  (SELECT "Id" FROM public."Colleague" LIMIT 1), -- Premier technicien trouvé
  true,
  NOW(),
  NOW()
);

-- 5. Commercial
INSERT INTO mobile.users (id, email, password_hash, role, colleague_id, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'commercial@test.local',
  '$2b$10$YQ98PmKt.yL7RJJqN4W9MeqZ8Zx5Q8MvN3zZ7kX9J0nN5qK8rL9Ym',
  'COMMERCIAL',
  NULL,
  true,
  NOW(),
  NOW()
);

-- 6. Technicien 1
INSERT INTO mobile.users (id, email, password_hash, role, colleague_id, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'technicien@test.local',
  '$2b$10$YQ98PmKt.yL7RJJqN4W9MeqZ8Zx5Q8MvN3zZ7kX9J0nN5qK8rL9Ym',
  'TECHNICIEN',
  (SELECT "Id" FROM public."Colleague" LIMIT 1 OFFSET 0), -- Premier technicien
  true,
  NOW(),
  NOW()
);

-- 7. Technicien 2
INSERT INTO mobile.users (id, email, password_hash, role, colleague_id, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'technicien2@test.local',
  '$2b$10$YQ98PmKt.yL7RJJqN4W9MeqZ8Zx5Q8MvN3zZ7kX9J0nN5qK8rL9Ym',
  'TECHNICIEN',
  (SELECT "Id" FROM public."Colleague" LIMIT 1 OFFSET 1), -- Deuxième technicien
  true,
  NOW(),
  NOW()
);

-- Afficher un récapitulatif
SELECT
  email,
  role,
  colleague_id::text as colleague_id,
  is_active
FROM mobile.users
WHERE email LIKE '%@test.local'
ORDER BY
  CASE role
    WHEN 'SUPER_ADMIN' THEN 1
    WHEN 'ADMIN' THEN 2
    WHEN 'PATRON' THEN 3
    WHEN 'CHEF_CHANTIER' THEN 4
    WHEN 'COMMERCIAL' THEN 5
    WHEN 'TECHNICIEN' THEN 6
  END;

COMMIT;

-- Note: Tous les utilisateurs ont le mot de passe "pass123"
-- Pour se connecter depuis l'app mobile :
--   Email: technicien@test.local  | Mot de passe: pass123
--   Email: admin@test.local       | Mot de passe: pass123
--   etc.
