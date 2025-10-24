-- ============================================================
-- Migration 011 : Créer utilisateurs administrateurs
-- ============================================================
-- Description: Crée Super Admin et Admin pour l'application mobile
-- Les autres utilisateurs (collègues EBP) seront importés automatiquement
-- ============================================================

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
DELETE FROM mobile.users WHERE email IN ('admin@test.local', 'manager@test.local');

-- ============================================================
-- UTILISATEURS ADMINISTRATEURS
-- ============================================================

-- 1. Super Admin
INSERT INTO mobile.users (
  id,
  email,
  password_hash,
  full_name,
  role,
  colleague_id,
  is_active,
  is_verified,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'admin@test.local',
  '$2b$10$YQ98PmKt.yL7RJJqN4W9MeqZ8Zx5Q8MvN3zZ7kX9J0nN5qK8rL9Ym',
  'Super Administrateur',
  'super_admin',
  NULL,
  true,
  true,
  NOW(),
  NOW()
);

-- 2. Admin
INSERT INTO mobile.users (
  id,
  email,
  password_hash,
  full_name,
  role,
  colleague_id,
  is_active,
  is_verified,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'manager@test.local',
  '$2b$10$YQ98PmKt.yL7RJJqN4W9MeqZ8Zx5Q8MvN3zZ7kX9J0nN5qK8rL9Ym',
  'Administrateur',
  'admin',
  NULL,
  true,
  true,
  NOW(),
  NOW()
);

-- ============================================================
-- Vérification
-- ============================================================

DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM mobile.users
  WHERE email IN ('admin@test.local', 'manager@test.local');

  RAISE NOTICE '';
  RAISE NOTICE '✅ Migration 011 appliquée avec succès';
  RAISE NOTICE '👥 % utilisateurs administrateurs créés:', v_count;
  RAISE NOTICE '';
  RAISE NOTICE '   📧 admin@test.local (Super Admin) - Mot de passe: pass123';
  RAISE NOTICE '   📧 manager@test.local (Admin) - Mot de passe: pass123';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Les autres utilisateurs (collègues EBP) seront importés automatiquement';
  RAISE NOTICE '   depuis la table public."Colleague" avec mot de passe par défaut: pass123';
  RAISE NOTICE '';
END $$;

COMMIT;
