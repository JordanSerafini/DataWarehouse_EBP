/**
 * SEED 001 : Créer l'utilisateur Jordan dans mobile.users
 *
 * Ce script crée l'utilisateur Jordan avec le mot de passe "password123"
 * pour permettre les tests de l'application mobile.
 *
 * Hash bcrypt pour "password123": $2b$10$DUJEVZfTJzB3ZooOhtDgIOFJNdudakH.7EuTPA2DebyFdMPui2Ymq
 *
 * Auteur: Claude Code
 * Date: 2025-10-26
 */

BEGIN;

-- Supprimer Jordan si il existe déjà
DELETE FROM mobile.users WHERE email = 'jordan@solution-logique.fr';

-- Créer Jordan
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
  'jordan@solution-logique.fr',
  '$2b$10$DUJEVZfTJzB3ZooOhtDgIOFJNdudakH.7EuTPA2DebyFdMPui2Ymq',
  'Jordan Pierre',
  'super_admin',
  'JORDAN',
  true,
  true,
  NOW(),
  NOW()
);

-- Vérification
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM mobile.users
  WHERE email = 'jordan@solution-logique.fr';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'ERREUR: Jordan n''a pas été créé !';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '   ✅ Utilisateur Jordan créé avec succès';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '📧 Email: jordan@solution-logique.fr';
  RAISE NOTICE '🔑 Mot de passe: password123';
  RAISE NOTICE '👤 Rôle: super_admin';
  RAISE NOTICE '🆔 User ID: %', v_user_id;
  RAISE NOTICE '';
  RAISE NOTICE '💡 Vous pouvez maintenant exécuter:';
  RAISE NOTICE '   - 003_jordan_colleague_ebp.sql (créer Colleague dans EBP)';
  RAISE NOTICE '   - 004_test_interventions_jordan.sql (créer 5 interventions test)';
  RAISE NOTICE '';
END $$;

COMMIT;
