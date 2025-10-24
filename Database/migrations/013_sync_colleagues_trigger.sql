-- ============================================================
-- Migration 013 : Synchronisation automatique des collègues EBP
-- ============================================================
-- Description: Vue et trigger pour synchroniser automatiquement
-- les collègues EBP dans mobile.users
-- ============================================================

BEGIN;

-- ============================================================
-- VUE: mobile.view_colleagues
-- ============================================================

CREATE OR REPLACE VIEW mobile.view_colleagues AS
SELECT
  c."Id" AS colleague_id,
  c."Caption" AS caption,
  c."FirstName" AS first_name,
  c."Name" AS last_name,
  c."Disabled" AS is_disabled,

  -- Email construit
  LOWER(
    REGEXP_REPLACE(
      COALESCE(c."FirstName", '') || '.' || COALESCE(c."Name", c."Caption"),
      '[^a-z0-9.]',
      '',
      'g'
    )
  ) || '@solution-logique.fr' AS suggested_email,

  -- Nom complet
  COALESCE(
    TRIM(c."FirstName" || ' ' || c."Name"),
    c."Caption"
  ) AS full_name,

  -- Vérifier si déjà dans mobile.users
  u.id AS user_id,
  u.email AS user_email,
  u.role AS user_role,
  u.is_active AS user_is_active,

  -- Status de synchronisation
  CASE
    WHEN u.id IS NOT NULL THEN 'synced'
    WHEN COALESCE(c."Disabled", 0) = 1 THEN 'disabled'
    ELSE 'pending'
  END AS sync_status

FROM public."Colleague" c
LEFT JOIN mobile.users u ON u.colleague_id = c."Id"
WHERE COALESCE(c."Disabled", 0) = 0  -- Seulement les actifs
ORDER BY c."Caption";

COMMENT ON VIEW mobile.view_colleagues IS
'Vue des collègues EBP avec leur statut de synchronisation dans mobile.users';

-- ============================================================
-- FONCTION: Synchroniser un collègue spécifique
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_colleague(
  p_colleague_id VARCHAR(50),
  p_default_role VARCHAR(50) DEFAULT 'technicien',
  p_password_hash VARCHAR(255) DEFAULT '$2b$10$N1byxUHQa2O2A7VCRsuNxOhURuHfR0f9gPbB4Th5s5D5IRGors76.'
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_colleague RECORD;
  v_email VARCHAR(255);
  v_full_name VARCHAR(255);
BEGIN
  -- Récupérer les informations du collègue
  SELECT * INTO v_colleague
  FROM mobile.view_colleagues
  WHERE colleague_id = p_colleague_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Collègue % non trouvé dans EBP', p_colleague_id;
  END IF;

  -- Vérifier si déjà synchronisé
  IF v_colleague.user_id IS NOT NULL THEN
    RAISE NOTICE 'ℹ️  Collègue % déjà synchronisé (user %)', p_colleague_id, v_colleague.user_id;
    RETURN v_colleague.user_id;
  END IF;

  -- Créer l'utilisateur
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
    v_colleague.suggested_email,
    p_password_hash,
    v_colleague.full_name,
    p_default_role,
    p_colleague_id,
    true,
    false,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_user_id;

  RAISE NOTICE '✅ Collègue % synchronisé → user %', p_colleague_id, v_user_id;
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.sync_colleague IS
'Synchronise un collègue EBP spécifique dans mobile.users';

-- ============================================================
-- FONCTION: Synchroniser tous les collègues non synchronisés
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_all_pending_colleagues(
  p_default_role VARCHAR(50) DEFAULT 'technicien',
  p_password_hash VARCHAR(255) DEFAULT '$2b$10$N1byxUHQa2O2A7VCRsuNxOhURuHfR0f9gPbB4Th5s5D5IRGors76.'
)
RETURNS TABLE(
  synced_count INTEGER,
  skipped_count INTEGER,
  details TEXT
) AS $$
DECLARE
  v_synced INTEGER := 0;
  v_skipped INTEGER := 0;
  v_colleague RECORD;
  v_user_id UUID;
BEGIN
  -- Parcourir tous les collègues non synchronisés
  FOR v_colleague IN
    SELECT * FROM mobile.view_colleagues
    WHERE sync_status = 'pending'
  LOOP
    BEGIN
      -- Créer l'utilisateur
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
        v_colleague.suggested_email,
        p_password_hash,
        v_colleague.full_name,
        p_default_role,
        v_colleague.colleague_id,
        true,
        false,
        NOW(),
        NOW()
      )
      RETURNING id INTO v_user_id;

      v_synced := v_synced + 1;

    EXCEPTION
      WHEN unique_violation THEN
        v_skipped := v_skipped + 1;
    END;
  END LOOP;

  RETURN QUERY SELECT
    v_synced,
    v_skipped,
    format(
      '✅ %s collègues synchronisés, %s ignorés',
      v_synced, v_skipped
    )::TEXT;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.sync_all_pending_colleagues IS
'Synchronise automatiquement tous les collègues EBP non encore présents dans mobile.users';

-- ============================================================
-- TRIGGER: Auto-sync nouveau collègue (OPTIONNEL - commenté)
-- ============================================================

/*
-- Décommenter pour activer la synchronisation automatique à chaque nouveau collègue

CREATE OR REPLACE FUNCTION mobile.trigger_auto_sync_colleague()
RETURNS TRIGGER AS $$
BEGIN
  -- Créer automatiquement l'utilisateur mobile
  PERFORM mobile.sync_colleague(NEW."Id");
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Ne pas bloquer l'insertion du collègue si la sync échoue
    RAISE WARNING 'Échec auto-sync collègue %: %', NEW."Id", SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_sync_new_colleague
AFTER INSERT ON public."Colleague"
FOR EACH ROW
WHEN (COALESCE(NEW."Disabled", 0) = 0)
EXECUTE FUNCTION mobile.trigger_auto_sync_colleague();

COMMENT ON TRIGGER auto_sync_new_colleague ON public."Colleague" IS
'Synchronise automatiquement les nouveaux collègues dans mobile.users';
*/

-- ============================================================
-- Import initial des collègues existants
-- ============================================================

DO $$
DECLARE
  v_result RECORD;
BEGIN
  -- Synchroniser tous les collègues EBP existants
  SELECT * INTO v_result
  FROM mobile.sync_all_pending_colleagues();

  RAISE NOTICE '';
  RAISE NOTICE '✅ Migration 013 appliquée avec succès';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Vue créée:';
  RAISE NOTICE '   - mobile.view_colleagues';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Fonctions créées:';
  RAISE NOTICE '   - mobile.sync_colleague(colleague_id)';
  RAISE NOTICE '   - mobile.sync_all_pending_colleagues()';
  RAISE NOTICE '';
  RAISE NOTICE '🔄 Synchronisation initiale:';
  RAISE NOTICE '   %', v_result.details;
  RAISE NOTICE '';
  RAISE NOTICE '💡 Pour voir les collègues:';
  RAISE NOTICE '   SELECT * FROM mobile.view_colleagues;';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Pour synchroniser manuellement:';
  RAISE NOTICE '   SELECT * FROM mobile.sync_all_pending_colleagues();';
  RAISE NOTICE '';
END $$;

COMMIT;
