/**
 * SEED 999 : Réinitialiser tous les mots de passe à "pass123"
 *
 * Met à jour tous les utilisateurs de mobile.users avec le mot de passe "pass123"
 * Hash bcrypt pour "pass123": $2b$10$5tYIZtZe.PsxlN6H/YAYiOmtIu0JnoHx1MPUABo6hdJ2m1fDdDtm.
 *
 * Auteur: Claude Code
 * Date: 2025-10-26
 */

BEGIN;

-- Mettre à jour tous les utilisateurs avec le nouveau mot de passe
UPDATE mobile.users
SET
  password_hash = '$2b$10$5tYIZtZe.PsxlN6H/YAYiOmtIu0JnoHx1MPUABo6hdJ2m1fDdDtm.',
  updated_at = NOW()
WHERE 1=1;

-- Vérification et affichage
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM mobile.users;

  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '   ✅ Mots de passe réinitialisés avec succès';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '🔑 Nouveau mot de passe pour TOUS les utilisateurs: pass123';
  RAISE NOTICE '👥 % utilisateurs mis à jour', v_count;
  RAISE NOTICE '';
  RAISE NOTICE '📧 Vous pouvez maintenant vous connecter avec:';
  RAISE NOTICE '   - jordan@solution-logique.fr / pass123 (super_admin)';
  RAISE NOTICE '   - admin@solution-logique.fr / pass123 (super_admin)';
  RAISE NOTICE '   - manager@solution-logique.fr / pass123 (admin)';
  RAISE NOTICE '   - thomas.vial@solution-logique.fr / pass123 (commercial)';
  RAISE NOTICE '   - vincent.leclercq@solution-logique.fr / pass123 (technicien)';
  RAISE NOTICE '   - ... et tous les autres utilisateurs';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  IMPORTANT: Ce mot de passe est pour le DÉVELOPPEMENT uniquement!';
  RAISE NOTICE '   En production, utilisez des mots de passe forts et uniques.';
  RAISE NOTICE '';
END $$;

COMMIT;
