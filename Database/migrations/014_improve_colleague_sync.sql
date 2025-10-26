-- ============================================================
-- Migration 014 : Amélioration du mapping Colleague → mobile.users
-- ============================================================
-- Description: Améliore la synchronisation des collègues EBP
-- - Utilise Prénom + Nom pour full_name et email
-- - Gère les doublons d'email
-- - Mappe IsSalesperson vers le rôle
-- ============================================================

BEGIN;

-- ============================================================
-- FONCTION AMÉLIORÉE: Synchroniser tous les collègues
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
  v_email VARCHAR(255);
  v_full_name VARCHAR(255);
  v_role VARCHAR(50);
  v_base_email VARCHAR(255);
  v_email_suffix INTEGER := 0;
BEGIN
  -- Parcourir tous les collègues actifs
  FOR v_colleague IN
    SELECT
      "Id",
      "Contact_Name",
      "Contact_FirstName",
      "IsSalesperson",
      "ActiveState"
    FROM public."Colleague"
    WHERE "ActiveState" = 1
    ORDER BY "Contact_Name"
  LOOP
    -- Vérifier si déjà synchronisé
    IF EXISTS (SELECT 1 FROM mobile.users WHERE colleague_id = v_colleague."Id") THEN
      v_skipped := v_skipped + 1;
      CONTINUE;
    END IF;

    -- Construire le nom complet : Prénom Nom
    IF v_colleague."Contact_FirstName" IS NOT NULL AND v_colleague."Contact_FirstName" != '' THEN
      v_full_name := TRIM(v_colleague."Contact_FirstName" || ' ' || v_colleague."Contact_Name");
    ELSE
      v_full_name := v_colleague."Contact_Name";
    END IF;

    -- Construire l'email de base : prenom.nom@solution-logique.fr
    -- Utilise unaccent() pour gérer les caractères accentués correctement
    v_base_email := REGEXP_REPLACE(
      LOWER(unaccent(COALESCE(v_colleague."Contact_FirstName", '') || '.' || v_colleague."Contact_Name")),
      '[^a-z0-9.]',
      '',
      'g'
    );

    -- Supprimer les points doubles ou au début/fin
    v_base_email := REGEXP_REPLACE(v_base_email, '\.+', '.', 'g');
    v_base_email := TRIM(BOTH '.' FROM v_base_email);

    v_email := v_base_email || '@solution-logique.fr';

    -- Gérer les doublons d'email en ajoutant un suffixe numérique
    v_email_suffix := 0;
    WHILE EXISTS (SELECT 1 FROM mobile.users WHERE email = v_email) LOOP
      v_email_suffix := v_email_suffix + 1;
      v_email := v_base_email || v_email_suffix || '@solution-logique.fr';
    END LOOP;

    -- Déterminer le rôle selon IsSalesperson
    IF v_colleague."IsSalesperson" = true THEN
      v_role := 'commercial';
    ELSE
      v_role := p_default_role; -- technicien par défaut
    END IF;

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
        v_email,
        p_password_hash,
        v_full_name,
        v_role,
        v_colleague."Id",
        true,
        false,
        NOW(),
        NOW()
      )
      RETURNING id INTO v_user_id;

      v_synced := v_synced + 1;

      RAISE NOTICE '✅ Synchronisé: % (%) → % [%]',
        v_full_name, v_colleague."Id", v_email, v_role;

    EXCEPTION
      WHEN unique_violation THEN
        v_skipped := v_skipped + 1;
        RAISE NOTICE '⚠️  Ignoré (doublon): % (%)', v_full_name, v_colleague."Id";
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
'Synchronise les collègues EBP avec mapping amélioré:
- Email: prenom.nom@solution-logique.fr (avec gestion doublons)
- Nom: Prénom Nom (au lieu de juste Nom)
- Rôle: commercial si IsSalesperson = true, sinon technicien';

-- ============================================================
-- FONCTION: Mettre à jour les utilisateurs existants
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.update_existing_colleagues()
RETURNS TABLE(
  updated_count INTEGER,
  details TEXT
) AS $$
DECLARE
  v_updated INTEGER := 0;
  v_user RECORD;
  v_colleague RECORD;
  v_full_name VARCHAR(255);
  v_new_email VARCHAR(255);
  v_base_new_email VARCHAR(255);
  v_suffix INTEGER;
  v_role VARCHAR(50);
BEGIN
  -- Parcourir tous les utilisateurs liés à un collègue
  FOR v_user IN
    SELECT * FROM mobile.users WHERE colleague_id IS NOT NULL
  LOOP
    -- Récupérer les infos du collègue
    SELECT * INTO v_colleague
    FROM public."Colleague"
    WHERE "Id" = v_user.colleague_id;

    IF NOT FOUND THEN
      CONTINUE;
    END IF;

    -- Construire le nouveau nom complet
    IF v_colleague."Contact_FirstName" IS NOT NULL AND v_colleague."Contact_FirstName" != '' THEN
      v_full_name := TRIM(v_colleague."Contact_FirstName" || ' ' || v_colleague."Contact_Name");
    ELSE
      v_full_name := v_colleague."Contact_Name";
    END IF;

    -- Construire le nouvel email avec unaccent()
    v_new_email := REGEXP_REPLACE(
      LOWER(unaccent(COALESCE(v_colleague."Contact_FirstName", '') || '.' || v_colleague."Contact_Name")),
      '[^a-z0-9.]',
      '',
      'g'
    );
    v_new_email := REGEXP_REPLACE(v_new_email, '\.+', '.', 'g');
    v_new_email := TRIM(BOTH '.' FROM v_new_email);

    -- Gérer les doublons potentiels avec suffixe numérique
    v_suffix := 0;
    v_base_new_email := v_new_email;
    WHILE EXISTS (
      SELECT 1 FROM mobile.users
      WHERE email = v_new_email || '@solution-logique.fr'
        AND id != v_user.id
    ) LOOP
      v_suffix := v_suffix + 1;
      v_new_email := v_base_new_email || v_suffix;
    END LOOP;

    v_new_email := v_new_email || '@solution-logique.fr';

    -- Déterminer le rôle basé sur IsSalesperson
    IF v_colleague."IsSalesperson" = true THEN
      v_role := 'commercial';
    ELSIF v_user.role IN ('technicien', 'commercial') THEN
      -- Si c'était commercial ou technicien, mettre à jour vers technicien
      v_role := 'technicien';
    ELSE
      -- Pour les autres rôles (admin, super_admin, etc.), garder le rôle existant
      v_role := v_user.role;
    END IF;

    -- Mettre à jour si différent
    IF v_user.full_name != v_full_name OR v_user.email != v_new_email OR v_user.role != v_role THEN
      UPDATE mobile.users
      SET
        email = v_new_email,
        full_name = v_full_name,
        role = v_role,
        updated_at = NOW()
      WHERE id = v_user.id;

      v_updated := v_updated + 1;

      RAISE NOTICE '✅ Mis à jour: % → %', v_user.email, v_new_email;
    END IF;
  END LOOP;

  RETURN QUERY SELECT
    v_updated,
    format('✅ %s utilisateurs mis à jour', v_updated)::TEXT;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.update_existing_colleagues IS
'Met à jour les utilisateurs existants avec le nouveau format:
- Corrige les emails vers prenom.nom@solution-logique.fr
- Ajoute le prénom au full_name
- Ajuste le rôle selon IsSalesperson';

-- ============================================================
-- Exécution : Mise à jour des utilisateurs existants
-- ============================================================

DO $$
DECLARE
  v_update_result RECORD;
  v_sync_result RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔄 Migration 014: Amélioration du mapping Colleague → mobile.users';
  RAISE NOTICE '';

  -- 1. Mettre à jour les utilisateurs existants
  RAISE NOTICE '📝 Étape 1: Mise à jour des utilisateurs existants...';
  SELECT * INTO v_update_result FROM mobile.update_existing_colleagues();
  RAISE NOTICE '   %', v_update_result.details;

  -- 2. Synchroniser les collègues manquants
  RAISE NOTICE '';
  RAISE NOTICE '📥 Étape 2: Synchronisation des collègues manquants...';
  SELECT * INTO v_sync_result FROM mobile.sync_all_pending_colleagues();
  RAISE NOTICE '   %', v_sync_result.details;

  RAISE NOTICE '';
  RAISE NOTICE '✅ Migration 014 terminée';
  RAISE NOTICE '';
END $$;

COMMIT;
