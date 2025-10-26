/**
 * SEED COLLEAGUE JORDAN DANS EBP (schema public)
 *
 * Ce script insère Jordan en tant que Colleague dans la base EBP.
 * Il gère les 44 colonnes NOT NULL de la table Colleague.
 *
 * ✅ CE QUE CE SCRIPT FAIT :
 * - Crée le Colleague JORDAN dans public."Colleague"
 * - Configure les horaires de travail (Lundi-Vendredi 8h-18h)
 * - Lie le user mobile.users au colleague_id
 *
 * Auteur: Claude Code
 * Date: 2025-10-26
 */

-- ============================================================================
-- VÉRIFICATION PRÉALABLE
-- ============================================================================

DO $$
DECLARE
    v_user_exists BOOLEAN;
    v_colleague_exists BOOLEAN;
BEGIN
    -- Vérifier que le user mobile existe
    SELECT EXISTS(
        SELECT 1 FROM mobile.users WHERE email = 'jordan@solution-logique.fr'
    ) INTO v_user_exists;

    IF NOT v_user_exists THEN
        RAISE EXCEPTION 'ERREUR: L''utilisateur Jordan n''existe pas dans mobile.users !';
    END IF;

    -- Vérifier si le colleague existe déjà
    SELECT EXISTS(
        SELECT 1 FROM public."Colleague" WHERE "Id" = 'JORDAN'
    ) INTO v_colleague_exists;

    IF v_colleague_exists THEN
        RAISE NOTICE '⚠️  Le Colleague JORDAN existe déjà. Pas de création.';
    ELSE
        RAISE NOTICE '✅ Prêt à créer le Colleague JORDAN';
    END IF;
END $$;

-- ============================================================================
-- CRÉATION DU COLLEAGUE JORDAN
-- ============================================================================

DO $$
DECLARE
    v_jordan_colleague_id VARCHAR(20) := 'JORDAN';
    v_jordan_unique_id UUID := gen_random_uuid();
BEGIN
    -- Vérifier si le colleague existe déjà
    IF EXISTS (SELECT 1 FROM public."Colleague" WHERE "Id" = v_jordan_colleague_id) THEN
        RAISE NOTICE 'Colleague JORDAN existe déjà. Pas de création.';
        RETURN;
    END IF;

    -- Insérer le Colleague Jordan
    INSERT INTO public."Colleague" (
        "Id",
        "Contact_Name",
        "IsSalesperson",
        "ActiveState",
        "UniqueId",
        "IRPFRate",
        "HourlyCostPrice",
        "SalePriceVatExcluded",
        "EventAutomaticAssign",
        "HasAssociatedFiles",
        -- Horaires lundi (0)
        "DaySchedule0_StartTime",
        "DaySchedule0_EndTime",
        "DaySchedule0_Duration",
        "DaySchedule0_Active",
        "DaySchedule0_Customize",
        "DaySchedule0_LunchStartTime",
        "DaySchedule0_LunchEndTime",
        -- Horaires mardi (1)
        "DaySchedule1_StartTime",
        "DaySchedule1_EndTime",
        "DaySchedule1_Duration",
        "DaySchedule1_Active",
        "DaySchedule1_Customize",
        "DaySchedule1_LunchStartTime",
        "DaySchedule1_LunchEndTime",
        -- Horaires mercredi (2)
        "DaySchedule2_StartTime",
        "DaySchedule2_EndTime",
        "DaySchedule2_Duration",
        "DaySchedule2_Active",
        "DaySchedule2_Customize",
        "DaySchedule2_LunchStartTime",
        "DaySchedule2_LunchEndTime",
        -- Horaires jeudi (3)
        "DaySchedule3_StartTime",
        "DaySchedule3_EndTime",
        "DaySchedule3_Duration",
        "DaySchedule3_Active",
        "DaySchedule3_Customize",
        "DaySchedule3_LunchStartTime",
        "DaySchedule3_LunchEndTime",
        -- Horaires vendredi (4)
        "DaySchedule4_StartTime",
        "DaySchedule4_EndTime",
        "DaySchedule4_Duration",
        "DaySchedule4_Active",
        "DaySchedule4_Customize",
        "DaySchedule4_LunchStartTime",
        "DaySchedule4_LunchEndTime",
        -- Horaires samedi (5)
        "DaySchedule5_StartTime",
        "DaySchedule5_EndTime",
        "DaySchedule5_Duration",
        "DaySchedule5_Active",
        "DaySchedule5_Customize",
        -- Horaires dimanche (6)
        "DaySchedule6_StartTime",
        "DaySchedule6_EndTime",
        "DaySchedule6_Duration",
        "DaySchedule6_Active",
        "DaySchedule6_Customize"
    ) VALUES (
        v_jordan_colleague_id,
        'Jordan',
        true, -- Est commercial/technicien
        1, -- Actif
        v_jordan_unique_id,
        0, -- Taux IRPF
        50.00, -- Coût horaire 50€
        75.00, -- Prix de vente horaire 75€
        true, -- Assignation automatique des événements
        false, -- Pas de fichiers associés

        -- ========== LUNDI 8h-18h avec pause déjeuner 12h-13h ==========
        '1900-01-01 08:00:00'::timestamp,
        '1900-01-01 18:00:00'::timestamp,
        9.0, -- 9 heures de travail (10h - 1h pause)
        true,
        false, -- Pas de personnalisation d'horaire
        '1900-01-01 12:00:00'::timestamp,
        '1900-01-01 13:00:00'::timestamp,

        -- ========== MARDI 8h-18h ==========
        '1900-01-01 08:00:00'::timestamp,
        '1900-01-01 18:00:00'::timestamp,
        9.0,
        true,
        false,
        '1900-01-01 12:00:00'::timestamp,
        '1900-01-01 13:00:00'::timestamp,

        -- ========== MERCREDI 8h-18h ==========
        '1900-01-01 08:00:00'::timestamp,
        '1900-01-01 18:00:00'::timestamp,
        9.0,
        true,
        false,
        '1900-01-01 12:00:00'::timestamp,
        '1900-01-01 13:00:00'::timestamp,

        -- ========== JEUDI 8h-18h ==========
        '1900-01-01 08:00:00'::timestamp,
        '1900-01-01 18:00:00'::timestamp,
        9.0,
        true,
        false,
        '1900-01-01 12:00:00'::timestamp,
        '1900-01-01 13:00:00'::timestamp,

        -- ========== VENDREDI 8h-18h ==========
        '1900-01-01 08:00:00'::timestamp,
        '1900-01-01 18:00:00'::timestamp,
        9.0,
        true,
        false,
        '1900-01-01 12:00:00'::timestamp,
        '1900-01-01 13:00:00'::timestamp,

        -- ========== SAMEDI (non travaillé) ==========
        '1900-01-01 00:00:00'::timestamp,
        '1900-01-01 00:00:00'::timestamp,
        0.0,
        false,
        false,

        -- ========== DIMANCHE (non travaillé) ==========
        '1900-01-01 00:00:00'::timestamp,
        '1900-01-01 00:00:00'::timestamp,
        0.0,
        false,
        false
    );

    RAISE NOTICE '✅ Colleague JORDAN créé avec succès';
END $$;

-- ============================================================================
-- MISE À JOUR DU USER MOBILE AVEC LE COLLEAGUE_ID
-- ============================================================================

UPDATE mobile.users
SET colleague_id = 'JORDAN',
    updated_at = NOW()
WHERE email = 'jordan@solution-logique.fr';

-- ============================================================================
-- VÉRIFICATIONS FINALES
-- ============================================================================

DO $$
DECLARE
    v_colleague_exists BOOLEAN;
    v_user_colleague_id VARCHAR(50);
    v_colleague_name VARCHAR(60);
    v_colleague_hourly_rate NUMERIC(28,8);
BEGIN
    -- Vérifier le colleague
    SELECT EXISTS(
        SELECT 1 FROM public."Colleague" WHERE "Id" = 'JORDAN'
    ) INTO v_colleague_exists;

    IF v_colleague_exists THEN
        SELECT "Contact_Name", "SalePriceVatExcluded"
        INTO v_colleague_name, v_colleague_hourly_rate
        FROM public."Colleague"
        WHERE "Id" = 'JORDAN';
    END IF;

    -- Vérifier le user
    SELECT colleague_id INTO v_user_colleague_id
    FROM mobile.users
    WHERE email = 'jordan@solution-logique.fr';

    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '          SEED JORDAN COLLEAGUE - RÉSULTATS';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '👤 COLLEAGUE EBP:';
    RAISE NOTICE '  • Existe: %', CASE WHEN v_colleague_exists THEN 'OUI ✅' ELSE 'NON ❌' END;
    IF v_colleague_exists THEN
        RAISE NOTICE '  • Nom: %', v_colleague_name;
        RAISE NOTICE '  • Taux horaire: % €/h', v_colleague_hourly_rate;
        RAISE NOTICE '  • Horaires: Lun-Ven 8h-18h (9h/jour avec pause déjeuner)';
    END IF;
    RAISE NOTICE '';
    RAISE NOTICE '📱 USER MOBILE:';
    RAISE NOTICE '  • Email: jordan@solution-logique.fr';
    RAISE NOTICE '  • Colleague_id lié: %', CASE WHEN v_user_colleague_id IS NOT NULL THEN v_user_colleague_id || ' ✅' ELSE 'NON LIÉ ❌' END;
    RAISE NOTICE '';
    RAISE NOTICE '✅ Jordan peut maintenant:';
    RAISE NOTICE '  • Voir ses événements dans l''interface EBP';
    RAISE NOTICE '  • Créer des tickets d''intervention';
    RAISE NOTICE '  • Se voir assigner des tâches';
    RAISE NOTICE '  • Apparaître dans le planning EBP';
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
END $$;
