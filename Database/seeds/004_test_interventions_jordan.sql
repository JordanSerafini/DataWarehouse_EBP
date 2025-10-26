/**
 * SEED INTERVENTIONS DE TEST POUR JORDAN
 *
 * Ce script crée des interventions de test pour Jordan (ScheduleEvent dans EBP)
 * afin de tester le workflow complet de l'application mobile.
 *
 * ✅ CE QUE CE SCRIPT FAIT :
 * - Crée 5 interventions de test avec différents statuts
 * - PENDING (1) : Pour tester le démarrage
 * - IN_PROGRESS (1) : Pour tester le TimeSheet et la clôture
 * - SCHEDULED (2) : Interventions futures
 * - COMPLETED (1) : Intervention terminée
 *
 * 🎯 STATUTS EBP EventState :
 * - 0 = Scheduled/Planifié
 * - 1 = In Progress/Confirmé
 * - 2 = Completed/Terminé
 * - 3 = Cancelled/Annulé
 * - 4 = Pending/En attente
 *
 * Auteur: Claude Code
 * Date: 2025-10-26
 */

-- ============================================================================
-- VÉRIFICATION PRÉALABLE
-- ============================================================================

DO $$
DECLARE
    v_jordan_colleague_exists BOOLEAN;
    v_customer_count INTEGER;
BEGIN
    -- Vérifier que le Colleague Jordan existe
    SELECT EXISTS(
        SELECT 1 FROM public."Colleague" WHERE "Id" = 'JORDAN'
    ) INTO v_jordan_colleague_exists;

    IF NOT v_jordan_colleague_exists THEN
        RAISE EXCEPTION 'ERREUR: Le Colleague JORDAN n''existe pas dans public."Colleague" !';
    END IF;

    -- Vérifier qu'il y a des clients
    SELECT COUNT(*) INTO v_customer_count FROM public."Customer" WHERE "ActiveState" = 1;

    IF v_customer_count = 0 THEN
        RAISE WARNING '⚠️  Aucun client actif trouvé. Les interventions auront un CustomerId NULL';
    ELSE
        RAISE NOTICE '✅ % client(s) actif(s) trouvé(s)', v_customer_count;
    END IF;

    RAISE NOTICE '✅ Prêt à créer les interventions de test pour Jordan';
END $$;

-- ============================================================================
-- FONCTION HELPER POUR TROUVER UN CLIENT
-- ============================================================================

CREATE OR REPLACE FUNCTION get_random_customer_id()
RETURNS VARCHAR(20) AS $$
DECLARE
    v_customer_id VARCHAR(20);
BEGIN
    SELECT "Id" INTO v_customer_id
    FROM public."Customer"
    WHERE "ActiveState" = 1
    ORDER BY RANDOM()
    LIMIT 1;

    RETURN v_customer_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CRÉATION DES INTERVENTIONS DE TEST
-- ============================================================================

DO $$
DECLARE
    v_jordan_id VARCHAR(20) := 'JORDAN';
    v_customer_id VARCHAR(20);
    v_intervention_id UUID;
    v_schedule_number VARCHAR(50);
BEGIN
    -- Récupérer un client aléatoire
    v_customer_id := get_random_customer_id();

    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '    CRÉATION DES INTERVENTIONS DE TEST POUR JORDAN';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';

    -- ========================================================================
    -- INTERVENTION 1: PENDING (En attente)
    -- ========================================================================
    v_intervention_id := gen_random_uuid();
    v_schedule_number := 'INT-TEST-001';

    IF NOT EXISTS (SELECT 1 FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" = v_schedule_number) THEN
        INSERT INTO public."ScheduleEvent" (
            "Id",
            "ScheduleEventNumber",
            "Caption",
            "NotesClear",
            "Maintenance_InterventionDescriptionClear",
            "ColleagueId",
            "CustomerId",
            "StartDateTime",
            "EndDateTime",
            "EventState",
            "EventType",
            "ExpectedDuration_DurationInHours",
            "AchievedDuration_DurationInHours",
            "Address_Address1",
            "Address_City",
            "Address_ZipCode",
            "Address_Latitude",
            "Address_Longitude",
            "sysCreatedDate",
            "sysModifiedDate",
            "ActiveState"
        ) VALUES (
            v_intervention_id,
            v_schedule_number,
            'Test Intervention PENDING - Maintenance climatisation',
            'Intervention de test en attente de démarrage',
            'Contrôle annuel et nettoyage filtres climatisation bureau',
            v_jordan_id,
            v_customer_id,
            NOW() + INTERVAL '2 hours', -- Dans 2 heures
            NOW() + INTERVAL '5 hours',
            4, -- PENDING
            1, -- Maintenance
            3.0, -- 3 heures estimées
            0.0, -- Pas encore commencé
            '15 Rue de la République',
            'Lyon',
            '69002',
            45.7597, -- Lyon
            4.8422,
            NOW(),
            NOW(),
            1 -- Actif
        );

        RAISE NOTICE '✅ Intervention 1 créée: % (PENDING)', v_schedule_number;
    ELSE
        RAISE NOTICE '⚠️  Intervention 1 existe déjà: %', v_schedule_number;
    END IF;

    -- ========================================================================
    -- INTERVENTION 2: IN_PROGRESS (En cours)
    -- ========================================================================
    v_intervention_id := gen_random_uuid();
    v_schedule_number := 'INT-TEST-002';

    IF NOT EXISTS (SELECT 1 FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" = v_schedule_number) THEN
        INSERT INTO public."ScheduleEvent" (
            "Id",
            "ScheduleEventNumber",
            "Caption",
            "NotesClear",
            "Maintenance_InterventionDescriptionClear",
            "ColleagueId",
            "CustomerId",
            "StartDateTime",
            "EndDateTime",
            "EventState",
            "EventType",
            "ExpectedDuration_DurationInHours",
            "AchievedDuration_DurationInHours",
            "Address_Address1",
            "Address_City",
            "Address_ZipCode",
            "Address_Latitude",
            "Address_Longitude",
            "sysCreatedDate",
            "sysModifiedDate",
            "ActiveState",
            "ActualStartDate"
        ) VALUES (
            v_intervention_id,
            v_schedule_number,
            'Test Intervention IN_PROGRESS - Réparation urgente',
            'Intervention en cours - TimeSheet à tester',
            'Réparation système électrique suite panne',
            v_jordan_id,
            v_customer_id,
            NOW() - INTERVAL '1 hour', -- Commencé il y a 1h
            NOW() + INTERVAL '2 hours',
            1, -- IN_PROGRESS
            3, -- Repair
            2.5, -- 2.5 heures estimées
            1.0, -- 1 heure déjà passée
            '22 Avenue des Champs',
            'Paris',
            '75008',
            48.8698,
            2.3078,
            NOW() - INTERVAL '2 hours',
            NOW(),
            1, -- Actif
            NOW() - INTERVAL '1 hour'
        );

        RAISE NOTICE '✅ Intervention 2 créée: % (IN_PROGRESS)', v_schedule_number;
    ELSE
        RAISE NOTICE '⚠️  Intervention 2 existe déjà: %', v_schedule_number;
    END IF;

    -- ========================================================================
    -- INTERVENTION 3: SCHEDULED (Planifiée demain matin)
    -- ========================================================================
    v_intervention_id := gen_random_uuid();
    v_schedule_number := 'INT-TEST-003';

    IF NOT EXISTS (SELECT 1 FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" = v_schedule_number) THEN
        INSERT INTO public."ScheduleEvent" (
            "Id",
            "ScheduleEventNumber",
            "Caption",
            "NotesClear",
            "Maintenance_InterventionDescriptionClear",
            "ColleagueId",
            "CustomerId",
            "StartDateTime",
            "EndDateTime",
            "EventState",
            "EventType",
            "ExpectedDuration_DurationInHours",
            "AchievedDuration_DurationInHours",
            "Address_Address1",
            "Address_City",
            "Address_ZipCode",
            "Address_Latitude",
            "Address_Longitude",
            "sysCreatedDate",
            "sysModifiedDate",
            "ActiveState"
        ) VALUES (
            v_intervention_id,
            v_schedule_number,
            'Test Intervention SCHEDULED - Installation',
            'Installation planifiée pour demain matin',
            'Installation nouveau système de sécurité',
            v_jordan_id,
            v_customer_id,
            NOW() + INTERVAL '1 day' + INTERVAL '9 hours', -- Demain 9h
            NOW() + INTERVAL '1 day' + INTERVAL '13 hours',
            0, -- SCHEDULED
            1, -- Installation
            4.0, -- 4 heures estimées
            0.0,
            '8 Boulevard Haussmann',
            'Marseille',
            '13001',
            43.2965,
            5.3698,
            NOW(),
            NOW(),
            1 -- Actif
        );

        RAISE NOTICE '✅ Intervention 3 créée: % (SCHEDULED)', v_schedule_number;
    ELSE
        RAISE NOTICE '⚠️  Intervention 3 existe déjà: %', v_schedule_number;
    END IF;

    -- ========================================================================
    -- INTERVENTION 4: SCHEDULED (Planifiée après-demain)
    -- ========================================================================
    v_intervention_id := gen_random_uuid();
    v_schedule_number := 'INT-TEST-004';

    IF NOT EXISTS (SELECT 1 FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" = v_schedule_number) THEN
        INSERT INTO public."ScheduleEvent" (
            "Id",
            "ScheduleEventNumber",
            "Caption",
            "NotesClear",
            "Maintenance_InterventionDescriptionClear",
            "ColleagueId",
            "CustomerId",
            "StartDateTime",
            "EndDateTime",
            "EventState",
            "EventType",
            "ExpectedDuration_DurationInHours",
            "AchievedDuration_DurationInHours",
            "Address_Address1",
            "Address_City",
            "Address_ZipCode",
            "Address_Latitude",
            "Address_Longitude",
            "sysCreatedDate",
            "sysModifiedDate",
            "ActiveState"
        ) VALUES (
            v_intervention_id,
            v_schedule_number,
            'Test Intervention SCHEDULED - Formation',
            'Formation utilisateurs planifiée',
            'Formation équipe sur nouveau système',
            v_jordan_id,
            v_customer_id,
            NOW() + INTERVAL '2 days' + INTERVAL '14 hours', -- Après-demain 14h
            NOW() + INTERVAL '2 days' + INTERVAL '17 hours',
            0, -- SCHEDULED
            5, -- Training
            3.0, -- 3 heures estimées
            0.0,
            '45 Rue du Commerce',
            'Toulouse',
            '31000',
            43.6047,
            1.4442,
            NOW(),
            NOW(),
            1 -- Actif
        );

        RAISE NOTICE '✅ Intervention 4 créée: % (SCHEDULED)', v_schedule_number;
    ELSE
        RAISE NOTICE '⚠️  Intervention 4 existe déjà: %', v_schedule_number;
    END IF;

    -- ========================================================================
    -- INTERVENTION 5: COMPLETED (Terminée hier)
    -- ========================================================================
    v_intervention_id := gen_random_uuid();
    v_schedule_number := 'INT-TEST-005';

    IF NOT EXISTS (SELECT 1 FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" = v_schedule_number) THEN
        INSERT INTO public."ScheduleEvent" (
            "Id",
            "ScheduleEventNumber",
            "Caption",
            "NotesClear",
            "Maintenance_InterventionDescriptionClear",
            "Maintenance_InterventionReport",
            "ColleagueId",
            "CustomerId",
            "StartDateTime",
            "EndDateTime",
            "EventState",
            "EventType",
            "ExpectedDuration_DurationInHours",
            "AchievedDuration_DurationInHours",
            "Address_Address1",
            "Address_City",
            "Address_ZipCode",
            "Address_Latitude",
            "Address_Longitude",
            "sysCreatedDate",
            "sysModifiedDate",
            "ActiveState",
            "ActualStartDate",
            "EndDate"
        ) VALUES (
            v_intervention_id,
            v_schedule_number,
            'Test Intervention COMPLETED - Maintenance routinière',
            'Intervention terminée avec succès',
            'Maintenance préventive mensuelle',
            'Contrôle effectué. Tous les systèmes fonctionnent correctement. Prochaine maintenance dans 1 mois.',
            v_jordan_id,
            v_customer_id,
            NOW() - INTERVAL '1 day' - INTERVAL '5 hours', -- Hier
            NOW() - INTERVAL '1 day' - INTERVAL '2 hours',
            2, -- COMPLETED
            2, -- Maintenance
            3.0, -- 3 heures estimées
            2.75, -- 2h45 réelles (9900 secondes)
            '12 Place Bellecour',
            'Lyon',
            '69002',
            45.7578,
            4.8320,
            NOW() - INTERVAL '2 days',
            NOW() - INTERVAL '1 day',
            1, -- Actif
            NOW() - INTERVAL '1 day' - INTERVAL '5 hours',
            NOW() - INTERVAL '1 day' - INTERVAL '2 hours'
        );

        RAISE NOTICE '✅ Intervention 5 créée: % (COMPLETED)', v_schedule_number;
    ELSE
        RAISE NOTICE '⚠️  Intervention 5 existe déjà: %', v_schedule_number;
    END IF;

    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '                  RÉSUMÉ DES INTERVENTIONS';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '📋 5 interventions de test créées pour Jordan:';
    RAISE NOTICE '';
    RAISE NOTICE '  1️⃣  INT-TEST-001: PENDING (dans 2h) - Climatisation Lyon';
    RAISE NOTICE '  2️⃣  INT-TEST-002: IN_PROGRESS (en cours) - Réparation Paris';
    RAISE NOTICE '  3️⃣  INT-TEST-003: SCHEDULED (demain 9h) - Installation Marseille';
    RAISE NOTICE '  4️⃣  INT-TEST-004: SCHEDULED (après-demain 14h) - Formation Toulouse';
    RAISE NOTICE '  5️⃣  INT-TEST-005: COMPLETED (hier) - Maintenance Lyon';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Tests possibles:';
    RAISE NOTICE '  • Démarrer INT-TEST-001 (PENDING → IN_PROGRESS)';
    RAISE NOTICE '  • TimeSheet sur INT-TEST-002 (déjà 1h passée)';
    RAISE NOTICE '  • Clôturer INT-TEST-002 (IN_PROGRESS → COMPLETED)';
    RAISE NOTICE '  • Voir les photos/signature de INT-TEST-005';
    RAISE NOTICE '  • Carte GPS avec toutes les interventions';
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
END $$;

-- Cleanup de la fonction helper
DROP FUNCTION IF EXISTS get_random_customer_id();
