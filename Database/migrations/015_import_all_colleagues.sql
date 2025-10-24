-- ============================================================
-- Migration 015 : Importer TOUS les collègues (actifs et inactifs)
-- ============================================================
-- Description: Étend l'import pour inclure les collègues inactifs
-- ============================================================

BEGIN;

-- ============================================================
-- FONCTION: Synchroniser TOUS les collègues (actifs + inactifs)
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.sync_all_colleagues_including_inactive(
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
  v_is_active BOOLEAN;
BEGIN
  -- Parcourir TOUS les collègues (actifs ET inactifs)
  FOR v_colleague IN
    SELECT
      "Id",
      "Contact_Name",
      "Contact_FirstName",
      "IsSalesperson",
      "ActiveState"
    FROM public."Colleague"
    ORDER BY "ActiveState" DESC, "Contact_Name"  -- Actifs en premier
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
    v_base_email := LOWER(
      REGEXP_REPLACE(
        unaccent(COALESCE(v_colleague."Contact_FirstName", '') || '.' || v_colleague."Contact_Name"),
        '[^a-z0-9.]',
        '',
        'g'
      )
    );

    -- Supprimer les points doubles ou au début/fin
    v_base_email := REGEXP_REPLACE(v_base_email, '\.+', '.', 'g');
    v_base_email := TRIM(BOTH '.' FROM v_base_email);

    v_email := v_base_email || '@solution-logique.fr';

    -- Gérer les doublons d'email en ajoutant un suffixe numérique
    v_email_suffix := 0;
    WHILE EXISTS (SELECT 1 FROM mobile.users WHERE email = v_email) LOOP
      v_email_suffix := v_email_suffix + 1;
      v_email := v_base_email || '.' || v_email_suffix || '@solution-logique.fr';
    END LOOP;

    -- Déterminer le rôle selon IsSalesperson
    IF v_colleague."IsSalesperson" = true THEN
      v_role := 'commercial';
    ELSE
      v_role := p_default_role; -- technicien par défaut
    END IF;

    -- L'utilisateur est actif si le collègue est actif dans EBP
    v_is_active := (v_colleague."ActiveState" = 1);

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
        v_is_active,  -- Marque comme inactif si ActiveState = 0
        false,
        NOW(),
        NOW()
      )
      RETURNING id INTO v_user_id;

      v_synced := v_synced + 1;

      IF v_is_active THEN
        RAISE NOTICE '✅ Synchronisé (actif): % (%) → % [%]',
          v_full_name, v_colleague."Id", v_email, v_role;
      ELSE
        RAISE NOTICE '⚠️  Synchronisé (inactif): % (%) → % [%]',
          v_full_name, v_colleague."Id", v_email, v_role;
      END IF;

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
      '✅ %s collègues synchronisés (actifs + inactifs), %s ignorés',
      v_synced, v_skipped
    )::TEXT;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.sync_all_colleagues_including_inactive IS
'Synchronise TOUS les collègues EBP (actifs et inactifs):
- Email: prenom.nom@solution-logique.fr (avec gestion doublons)
- Nom: Prénom Nom
- Rôle: commercial si IsSalesperson = true, sinon technicien
- is_active: true si ActiveState = 1, false si ActiveState = 0';

-- ============================================================
-- Exécution : Importer les collègues manquants (inactifs)
-- ============================================================

DO $$
DECLARE
  v_sync_result RECORD;
  v_count_before INTEGER;
  v_count_after INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔄 Migration 015: Import de TOUS les collègues (actifs + inactifs)';
  RAISE NOTICE '';

  -- Compter les utilisateurs avant
  SELECT COUNT(*) INTO v_count_before FROM mobile.users;
  RAISE NOTICE '📊 Utilisateurs avant: %', v_count_before;

  -- Synchroniser tous les collègues manquants
  RAISE NOTICE '';
  RAISE NOTICE '📥 Synchronisation des collègues manquants...';
  SELECT * INTO v_sync_result FROM mobile.sync_all_colleagues_including_inactive();
  RAISE NOTICE '   %', v_sync_result.details;

  -- Compter les utilisateurs après
  SELECT COUNT(*) INTO v_count_after FROM mobile.users;
  RAISE NOTICE '';
  RAISE NOTICE '📊 Utilisateurs après: %', v_count_after;
  RAISE NOTICE '📈 Nouveaux utilisateurs: %', v_count_after - v_count_before;

  RAISE NOTICE '';
  RAISE NOTICE '✅ Migration 015 terminée';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Les collègues inactifs ont is_active = false';
  RAISE NOTICE '   Ils ne pourront pas se connecter tant que is_active = false';
  RAISE NOTICE '';
END $$;

COMMIT;
