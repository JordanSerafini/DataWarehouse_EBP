-- ============================================================
-- Migration 012 : Import automatique des collègues EBP
-- ============================================================
-- Description: Fonction pour importer les collègues depuis EBP
-- avec mot de passe par défaut "pass123"
-- ============================================================

BEGIN;

-- ============================================================
-- FONCTION: Importer les collègues EBP comme utilisateurs
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.import_colleagues_from_ebp(
  p_default_role VARCHAR(50) DEFAULT 'technicien',
  p_password_hash VARCHAR(255) DEFAULT '$2b$10$N1byxUHQa2O2A7VCRsuNxOhURuHfR0f9gPbB4Th5s5D5IRGors76.'
)
RETURNS TABLE(
  imported_count INTEGER,
  skipped_count INTEGER,
  details TEXT
) AS $$
DECLARE
  v_imported INTEGER := 0;
  v_skipped INTEGER := 0;
  v_colleague RECORD;
  v_email VARCHAR(255);
  v_full_name VARCHAR(255);
BEGIN
  -- Parcourir tous les collègues EBP actifs
  FOR v_colleague IN
    SELECT
      "Id",
      "Caption",
      "FirstName",
      "Name"
    FROM public."Colleague"
    WHERE COALESCE("Disabled", 0) = 0  -- Seulement les actifs
  LOOP
    -- Construire l'email à partir du nom
    -- Format: prenom.nom@ebp.local (en minuscules, sans accents)
    v_email := LOWER(
      COALESCE(v_colleague."FirstName", '') || '.' ||
      COALESCE(v_colleague."Name", v_colleague."Caption")
    );
    -- Nettoyer l'email (enlever espaces, caractères spéciaux)
    v_email := REGEXP_REPLACE(v_email, '[^a-z0-9.]', '', 'g');
    v_email := v_email || '@ebp.local';

    -- Construire le nom complet
    v_full_name := COALESCE(
      TRIM(v_colleague."FirstName" || ' ' || v_colleague."Name"),
      v_colleague."Caption"
    );

    -- Vérifier si l'utilisateur existe déjà
    IF EXISTS (
      SELECT 1 FROM mobile.users
      WHERE colleague_id = v_colleague."Id"
    ) THEN
      v_skipped := v_skipped + 1;
      CONTINUE;
    END IF;

    -- Insérer le nouvel utilisateur
    BEGIN
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
        v_email,
        p_password_hash,  -- Hash de "pass123"
        v_full_name,
        p_default_role,
        v_colleague."Id",
        true,
        false,  -- Pas vérifié par défaut
        NOW(),
        NOW()
      );

      v_imported := v_imported + 1;

    EXCEPTION
      WHEN unique_violation THEN
        -- Email déjà existant, on skip
        v_skipped := v_skipped + 1;
    END;
  END LOOP;

  -- Retourner le résultat
  RETURN QUERY SELECT
    v_imported,
    v_skipped,
    format(
      '✅ %s collègues importés, %s ignorés (déjà existants)',
      v_imported, v_skipped
    )::TEXT;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.import_colleagues_from_ebp IS
'Importe automatiquement les collègues depuis public."Colleague"
Mot de passe par défaut: pass123
Rôle par défaut: technicien';

-- ============================================================
-- FONCTION: Réinitialiser mot de passe utilisateur
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.reset_user_password(
  p_user_id UUID,
  p_new_password_hash VARCHAR(255) DEFAULT '$2b$10$YQ98PmKt.yL7RJJqN4W9MeqZ8Zx5Q8MvN3zZ7kX9J0nN5qK8rL9Ym'
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE mobile.users
  SET
    password_hash = p_new_password_hash,
    updated_at = NOW(),
    failed_login_attempts = 0,
    locked_until = NULL
  WHERE id = p_user_id;

  IF FOUND THEN
    RAISE NOTICE '✅ Mot de passe réinitialisé pour user %', p_user_id;
    RETURN true;
  ELSE
    RAISE NOTICE '❌ Utilisateur % non trouvé', p_user_id;
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.reset_user_password IS
'Réinitialise le mot de passe d''un utilisateur à "pass123" (ou custom)';

-- ============================================================
-- FONCTION: Réinitialiser tous les mots de passe
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.reset_all_passwords(
  p_password_hash VARCHAR(255) DEFAULT '$2b$10$N1byxUHQa2O2A7VCRsuNxOhURuHfR0f9gPbB4Th5s5D5IRGors76.'
)
RETURNS INTEGER AS $$
DECLARE
  v_updated INTEGER;
BEGIN
  UPDATE mobile.users
  SET
    password_hash = p_password_hash,
    updated_at = NOW(),
    failed_login_attempts = 0,
    locked_until = NULL;

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  RAISE NOTICE '✅ % mots de passe réinitialisés à "pass123"', v_updated;
  RETURN v_updated;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.reset_all_passwords IS
'⚠️  DANGER: Réinitialise TOUS les mots de passe à "pass123"';

-- ============================================================
-- Vérification
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ Migration 012 appliquée avec succès';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Fonctions créées:';
  RAISE NOTICE '   - mobile.import_colleagues_from_ebp()';
  RAISE NOTICE '   - mobile.reset_user_password(user_id)';
  RAISE NOTICE '   - mobile.reset_all_passwords()';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Pour importer les collègues EBP:';
  RAISE NOTICE '   SELECT * FROM mobile.import_colleagues_from_ebp();';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Mot de passe par défaut: pass123';
  RAISE NOTICE '📧 Format email: prenom.nom@ebp.local';
  RAISE NOTICE '';
END $$;

COMMIT;
