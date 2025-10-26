/**
 * SEED SIMPLIFIÉ POUR JORDAN - INCIDENTS UNIQUEMENT
 *
 * Ce seed crée uniquement les incidents/tickets d'intervention car les tables
 * Colleague et ScheduleEvent ont trop de colonnes NOT NULL complexes.
 *
 * ✅ QUI FONCTIONNE :
 * - 10 tickets d'intervention variés (statuts: Nouveau, En cours, Résolu)
 * - Descriptions détaillées et réalistes
 * - Données financières cohérentes
 *
 * ❌ À FAIRE MANUELLEMENT VIA L'INTERFACE EBP :
 * - Création du Colleague "JORDAN" via l'interface EBP Gestion
 * - Création des événements de planning via le calendrier EBP
 *
 * Auteur: Claude Code
 * Date: 2025-10-26
 */

-- ============================================================================
-- VÉRIFICATION DE L'UTILISATEUR JORDAN
-- ============================================================================

DO $$
DECLARE
    v_user_exists BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM mobile.users WHERE email = 'jordan@solution-logique.fr'
    ) INTO v_user_exists;

    IF v_user_exists THEN
        RAISE NOTICE 'User Jordan existe : jordan@solution-logique.fr';
    ELSE
        RAISE EXCEPTION 'ERREUR: L''utilisateur Jordan n''existe pas dans mobile.users !';
    END IF;
END $$;

-- ============================================================================
-- CRÉATION DES TICKETS D'INTERVENTION (Incident)
-- ============================================================================

DO $$
DECLARE
    v_customer_id VARCHAR(20);
    v_customer_name VARCHAR(150);
    v_base_date TIMESTAMP := CURRENT_DATE;
    v_creator VARCHAR(20) := 'JORDAN';
BEGIN
    -- Récupérer un client existant
    SELECT "Id", "Name" INTO v_customer_id, v_customer_name
    FROM public."Customer"
    WHERE "ActiveState" = 0 -- Client actif
    LIMIT 1;

    IF v_customer_id IS NULL THEN
        RAISE EXCEPTION 'Aucun client actif trouvé dans la base de données !';
    END IF;

    RAISE NOTICE 'Client sélectionné: % (%)', v_customer_name, v_customer_id;

    -- ========================================================================
    -- Incident 1: Problème de synchronisation - EN COURS
    -- ========================================================================
    INSERT INTO public."Incident" (
        "Id",
        "Caption",
        "CustomerId",
        "CustomerName",
        "StartDate",
        "Status",
        "PredictedDuration",
        "AccomplishedDuration",
        "PredictedCosts",
        "PredictedSales",
        "PredictedGrossMargin",
        "AccomplishedCosts",
        "AccomplishedSales",
        "AccomplishedGrossMargin",
        "ProfitsOnDuration",
        "ProfitsOnCosts",
        "ProfitsOnSales",
        "ProfitsOnGrossMargin",
        "NeedToUpdateAnalysis",
        "Address_Npai",
        "Contact_NaturalPerson",
        "Contact_OptIn",
        "Contact_AllowUsePersonnalDatas",
        "HasAssociatedFiles",
        "CreatorColleagueId",
        "Description",
        "DescriptionClear",
        "sysCreatedDate",
        "sysCreatedUser"
    ) VALUES (
        'JORDN001',
        '🔄 Problème synchronisation bancaire',
        v_customer_id,
        v_customer_name,
        v_base_date - INTERVAL '2 days',
        1, -- EN COURS
        2.0,
        1.5,
        100.00,
        150.00,
        50.00,
        75.00,
        112.50,
        37.50,
        -0.5,
        -25.00,
        -37.50,
        -12.50,
        false,
        false,
        false,
        false,
        false,
        false,
        v_creator,
        '<p>Le client rencontre des difficultés pour synchroniser ses relevés bancaires avec EBP. Erreur "Connexion refusée" lors de la tentative de synchronisation.</p><p><strong>Actions réalisées:</strong></p><ul><li>Vérification des identifiants bancaires</li><li>Test de connexion au serveur de la banque</li></ul><p><strong>À faire:</strong></p><ul><li>Contacter le support de la banque</li><li>Vérifier les certificats SSL</li></ul>',
        'Le client rencontre des difficultés pour synchroniser ses relevés bancaires avec EBP. Erreur "Connexion refusée" lors de la tentative de synchronisation. Actions réalisées: Vérification des identifiants bancaires, Test de connexion au serveur de la banque. À faire: Contacter le support de la banque, Vérifier les certificats SSL.',
        v_base_date - INTERVAL '2 days',
        'Jordan'
    );

    -- ========================================================================
    -- Incident 2: Installation logiciel - RÉSOLU
    -- ========================================================================
    INSERT INTO public."Incident" (
        "Id",
        "Caption",
        "CustomerId",
        "CustomerName",
        "StartDate",
        "EndDate",
        "Status",
        "PredictedDuration",
        "AccomplishedDuration",
        "PredictedCosts",
        "PredictedSales",
        "PredictedGrossMargin",
        "AccomplishedCosts",
        "AccomplishedSales",
        "AccomplishedGrossMargin",
        "ProfitsOnDuration",
        "ProfitsOnCosts",
        "ProfitsOnSales",
        "ProfitsOnGrossMargin",
        "NeedToUpdateAnalysis",
        "Address_Npai",
        "Contact_NaturalPerson",
        "Contact_OptIn",
        "Contact_AllowUsePersonnalDatas",
        "HasAssociatedFiles",
        "CreatorColleagueId",
        "Description",
        "DescriptionClear",
        "sysCreatedDate",
        "sysCreatedUser"
    ) VALUES (
        'JORDN002',
        '✅ Installation EBP Gestion Commerciale Pro',
        v_customer_id,
        v_customer_name,
        v_base_date - INTERVAL '5 days',
        v_base_date - INTERVAL '4 days',
        2, -- RÉSOLU
        3.0,
        2.5,
        150.00,
        225.00,
        75.00,
        125.00,
        187.50,
        62.50,
        -0.5,
        -25.00,
        -37.50,
        -12.50,
        false,
        false,
        false,
        false,
        false,
        false,
        v_creator,
        '<p>Installation et paramétrage initial du logiciel EBP Gestion Commerciale Pro sur 3 postes.</p><p><strong>Réalisations:</strong></p><ul><li>Installation du serveur SQL</li><li>Configuration des profils utilisateurs (Admin, Comptable, Commercial)</li><li>Import des données clients depuis Excel (250 fiches)</li><li>Création des modèles de documents (devis, factures)</li></ul><p><strong>Formation dispensée:</strong> 1h de formation à l''utilisation basique.</p>',
        'Installation et paramétrage initial du logiciel EBP Gestion Commerciale Pro sur 3 postes. Réalisations: Installation du serveur SQL, Configuration des profils utilisateurs (Admin, Comptable, Commercial), Import des données clients depuis Excel (250 fiches), Création des modèles de documents (devis, factures). Formation dispensée: 1h de formation à l''utilisation basique.',
        v_base_date - INTERVAL '5 days',
        'Jordan'
    );

    -- ========================================================================
    -- Incident 3: Formation utilisateur - NOUVEAU
    -- ========================================================================
    INSERT INTO public."Incident" (
        "Id",
        "Caption",
        "CustomerId",
        "CustomerName",
        "StartDate",
        "Status",
        "PredictedDuration",
        "AccomplishedDuration",
        "PredictedCosts",
        "PredictedSales",
        "PredictedGrossMargin",
        "AccomplishedCosts",
        "AccomplishedSales",
        "AccomplishedGrossMargin",
        "ProfitsOnDuration",
        "ProfitsOnCosts",
        "ProfitsOnSales",
        "ProfitsOnGrossMargin",
        "NeedToUpdateAnalysis",
        "Address_Npai",
        "Contact_NaturalPerson",
        "Contact_OptIn",
        "Contact_AllowUsePersonnalDatas",
        "HasAssociatedFiles",
        "CreatorColleagueId",
        "Description",
        "DescriptionClear",
        "sysCreatedDate",
        "sysCreatedUser"
    ) VALUES (
        'JORDN003',
        '📚 Formation Module Comptabilité',
        v_customer_id,
        v_customer_name,
        v_base_date + INTERVAL '2 days',
        0, -- NOUVEAU
        4.0,
        0.0,
        200.00,
        300.00,
        100.00,
        0.00,
        0.00,
        0.00,
        -4.0,
        -200.00,
        -300.00,
        -100.00,
        false,
        false,
        false,
        false,
        false,
        false,
        v_creator,
        '<p>Formation complète au module Comptabilité pour 2 utilisateurs.</p><p><strong>Programme de formation:</strong></p><ul><li>Saisie des écritures comptables</li><li>Lettrage automatique et manuel</li><li>Rapprochement bancaire</li><li>Édition des bilans et comptes de résultat</li><li>Déclaration de TVA (CA3)</li></ul><p><strong>Durée prévue:</strong> 4 heures sur une demi-journée.</p>',
        'Formation complète au module Comptabilité pour 2 utilisateurs. Programme: Saisie des écritures comptables, Lettrage automatique et manuel, Rapprochement bancaire, Édition des bilans et comptes de résultat, Déclaration de TVA (CA3). Durée prévue: 4 heures sur une demi-journée.',
        v_base_date,
        'Jordan'
    );

    -- ========================================================================
    -- Incident 4: Bug import données - EN COURS
    -- ========================================================================
    INSERT INTO public."Incident" (
        "Id",
        "Caption",
        "CustomerId",
        "CustomerName",
        "StartDate",
        "Status",
        "PredictedDuration",
        "AccomplishedDuration",
        "PredictedCosts",
        "PredictedSales",
        "PredictedGrossMargin",
        "AccomplishedCosts",
        "AccomplishedSales",
        "AccomplishedGrossMargin",
        "ProfitsOnDuration",
        "ProfitsOnCosts",
        "ProfitsOnSales",
        "ProfitsOnGrossMargin",
        "NeedToUpdateAnalysis",
        "Address_Npai",
        "Contact_NaturalPerson",
        "Contact_OptIn",
        "Contact_AllowUsePersonnalDatas",
        "HasAssociatedFiles",
        "CreatorColleagueId",
        "Description",
        "DescriptionClear",
        "sysCreatedDate",
        "sysCreatedUser"
    ) VALUES (
        'JORDN004',
        '🐛 Bug Import fichier clients Excel',
        v_customer_id,
        v_customer_name,
        v_base_date - INTERVAL '1 day',
        1, -- EN COURS
        1.5,
        0.5,
        75.00,
        112.50,
        37.50,
        25.00,
        37.50,
        12.50,
        -1.0,
        -50.00,
        -75.00,
        -25.00,
        false,
        false,
        false,
        false,
        false,
        false,
        v_creator,
        '<p>Erreur lors de l''import du fichier Excel contenant la base clients (500 lignes).</p><p><strong>Problèmes identifiés:</strong></p><ul><li>Colonnes mal mappées (Code postal dans champ Téléphone)</li><li>52 doublons détectés</li><li>Encodage UTF-8 non respecté (caractères accentués corrompus)</li></ul><p><strong>Solution en cours:</strong> Nettoyage du fichier Excel et re-mapping des colonnes.</p>',
        'Erreur lors de l''import du fichier Excel contenant la base clients (500 lignes). Problèmes: Colonnes mal mappées (Code postal dans champ Téléphone), 52 doublons détectés, Encodage UTF-8 non respecté. Solution en cours: Nettoyage du fichier Excel et re-mapping des colonnes.',
        v_base_date - INTERVAL '1 day',
        'Jordan'
    );

    -- ========================================================================
    -- Incident 5: Mise à jour logiciel - PLANIFIÉ
    -- ========================================================================
    INSERT INTO public."Incident" (
        "Id",
        "Caption",
        "CustomerId",
        "CustomerName",
        "StartDate",
        "Status",
        "PredictedDuration",
        "AccomplishedDuration",
        "PredictedCosts",
        "PredictedSales",
        "PredictedGrossMargin",
        "AccomplishedCosts",
        "AccomplishedSales",
        "AccomplishedGrossMargin",
        "ProfitsOnDuration",
        "ProfitsOnCosts",
        "ProfitsOnSales",
        "ProfitsOnGrossMargin",
        "NeedToUpdateAnalysis",
        "Address_Npai",
        "Contact_NaturalPerson",
        "Contact_OptIn",
        "Contact_AllowUsePersonnalDatas",
        "HasAssociatedFiles",
        "CreatorColleagueId",
        "Description",
        "DescriptionClear",
        "sysCreatedDate",
        "sysCreatedUser"
    ) VALUES (
        'JORDN005',
        '⬆️ Mise à jour EBP v2025',
        v_customer_id,
        v_customer_name,
        v_base_date + INTERVAL '3 days',
        0, -- NOUVEAU/PLANIFIÉ
        2.0,
        0.0,
        100.00,
        150.00,
        50.00,
        0.00,
        0.00,
        0.00,
        -2.0,
        -100.00,
        -150.00,
        -50.00,
        false,
        false,
        false,
        false,
        false,
        false,
        v_creator,
        '<p>Mise à jour majeure vers la version 2025 du logiciel EBP Gestion Commerciale Pro.</p><p><strong>Procédure planifiée:</strong></p><ol><li>Sauvegarde complète de la base de données (pg_dump)</li><li>Test de la mise à jour sur un environnement de test</li><li>Installation sur le serveur de production</li><li>Vérification de compatibilité des modèles de documents</li><li>Test des fonctionnalités critiques</li></ol><p><strong>Temps d''immobilisation prévu:</strong> 30 minutes</p>',
        'Mise à jour majeure vers la version 2025 du logiciel EBP. Procédure: Sauvegarde complète, Test sur environnement de test, Installation production, Vérification compatibilité, Test fonctionnalités. Temps d''immobilisation prévu: 30 minutes',
        v_base_date,
        'Jordan'
    );

    -- ========================================================================
    -- Incident 6: Problème de licence - URGENT - EN COURS
    -- ========================================================================
    INSERT INTO public."Incident" (
        "Id",
        "Caption",
        "CustomerId",
        "CustomerName",
        "StartDate",
        "Status",
        "PredictedDuration",
        "AccomplishedDuration",
        "PredictedCosts",
        "PredictedSales",
        "PredictedGrossMargin",
        "AccomplishedCosts",
        "AccomplishedSales",
        "AccomplishedGrossMargin",
        "ProfitsOnDuration",
        "ProfitsOnCosts",
        "ProfitsOnSales",
        "ProfitsOnGrossMargin",
        "NeedToUpdateAnalysis",
        "Address_Npai",
        "Contact_NaturalPerson",
        "Contact_OptIn",
        "Contact_AllowUsePersonnalDatas",
        "HasAssociatedFiles",
        "CreatorColleagueId",
        "Description",
        "DescriptionClear",
        "sysCreatedDate",
        "sysCreatedUser"
    ) VALUES (
        'JORDN006',
        '🚨 URGENT - Licence expirée',
        v_customer_id,
        v_customer_name,
        v_base_date,
        1, -- EN COURS
        0.5,
        0.2,
        25.00,
        37.50,
        12.50,
        10.00,
        15.00,
        5.00,
        -0.3,
        -15.00,
        -22.50,
        -7.50,
        false,
        false,
        false,
        false,
        false,
        false,
        v_creator,
        '<p><strong style="color: red;">URGENT:</strong> La licence EBP du client a expiré ce matin. Le logiciel est bloqué en mode lecture seule, aucune saisie n''est possible.</p><p><strong>Impact:</strong></p><ul><li>Impossibilité d''éditer des factures</li><li>Blocage de la comptabilité</li><li>Perte de productivité estimée: 500€/jour</li></ul><p><strong>Action immédiate:</strong> Renouvellement de la licence en cours auprès du service commercial EBP.</p>',
        'URGENT: Licence EBP expirée. Logiciel bloqué en lecture seule. Impact: Impossibilité d''éditer des factures, Blocage de la comptabilité, Perte de productivité 500€/jour. Action: Renouvellement en cours.',
        v_base_date,
        'Jordan'
    );

    -- ========================================================================
    -- Incident 7: Paramétrage TVA - RÉSOLU
    -- ========================================================================
    INSERT INTO public."Incident" (
        "Id",
        "Caption",
        "CustomerId",
        "CustomerName",
        "StartDate",
        "EndDate",
        "Status",
        "PredictedDuration",
        "AccomplishedDuration",
        "PredictedCosts",
        "PredictedSales",
        "PredictedGrossMargin",
        "AccomplishedCosts",
        "AccomplishedSales",
        "AccomplishedGrossMargin",
        "ProfitsOnDuration",
        "ProfitsOnCosts",
        "ProfitsOnSales",
        "ProfitsOnGrossMargin",
        "NeedToUpdateAnalysis",
        "Address_Npai",
        "Contact_NaturalPerson",
        "Contact_OptIn",
        "Contact_AllowUsePersonnalDatas",
        "HasAssociatedFiles",
        "CreatorColleagueId",
        "Description",
        "DescriptionClear",
        "sysCreatedDate",
        "sysCreatedUser"
    ) VALUES (
        'JORDN007',
        '✅ Paramétrage taux TVA spéciaux',
        v_customer_id,
        v_customer_name,
        v_base_date - INTERVAL '10 days',
        v_base_date - INTERVAL '9 days',
        2, -- RÉSOLU
        1.0,
        1.0,
        50.00,
        75.00,
        25.00,
        50.00,
        75.00,
        25.00,
        0.0,
        0.00,
        0.00,
        0.00,
        false,
        false,
        false,
        false,
        false,
        false,
        v_creator,
        '<p>Configuration des taux de TVA réduits pour les produits spécifiques du client (secteur restauration).</p><p><strong>Taux paramétrés:</strong></p><ul><li>TVA 20% (taux normal)</li><li>TVA 10% (restauration sur place)</li><li>TVA 5.5% (produits alimentaires à emporter)</li></ul><p><strong>Tests effectués:</strong> Simulation de factures avec les 3 taux, vérification des totaux.</p>',
        'Configuration des taux de TVA réduits (5.5%, 10%, 20%) pour le secteur restauration. Tests effectués avec succès sur des factures de simulation.',
        v_base_date - INTERVAL '10 days',
        'Jordan'
    );

    -- ========================================================================
    -- Incident 8: Migration données - EN COURS (PROJET LONG)
    -- ========================================================================
    INSERT INTO public."Incident" (
        "Id",
        "Caption",
        "CustomerId",
        "CustomerName",
        "StartDate",
        "Status",
        "PredictedDuration",
        "AccomplishedDuration",
        "PredictedCosts",
        "PredictedSales",
        "PredictedGrossMargin",
        "AccomplishedCosts",
        "AccomplishedSales",
        "AccomplishedGrossMargin",
        "ProfitsOnDuration",
        "ProfitsOnCosts",
        "ProfitsOnSales",
        "ProfitsOnGrossMargin",
        "NeedToUpdateAnalysis",
        "Address_Npai",
        "Contact_NaturalPerson",
        "Contact_OptIn",
        "Contact_AllowUsePersonnalDatas",
        "HasAssociatedFiles",
        "CreatorColleagueId",
        "Description",
        "DescriptionClear",
        "sysCreatedDate",
        "sysCreatedUser"
    ) VALUES (
        'JORDN008',
        '📦 Migration depuis Ciel Gestion',
        v_customer_id,
        v_customer_name,
        v_base_date - INTERVAL '3 days',
        1, -- EN COURS
        10.0,
        5.0,
        500.00,
        750.00,
        250.00,
        250.00,
        375.00,
        125.00,
        -5.0,
        -250.00,
        -375.00,
        -125.00,
        false,
        false,
        false,
        false,
        false,
        false,
        v_creator,
        '<p>Projet de migration complète depuis Ciel Gestion Commerciale vers EBP.</p><p><strong>Avancement (50%):</strong></p><ul><li>✅ Export de la base clients (1250 fiches) - Terminé</li><li>✅ Import des clients dans EBP - Terminé</li><li>✅ Export de la base articles (850 références) - Terminé</li><li>🔄 Import des articles dans EBP - En cours</li><li>⏳ Migration de l''historique des ventes (3 ans) - À faire</li><li>⏳ Formation utilisateurs - À planifier</li></ul><p><strong>Durée restante estimée:</strong> 5 heures</p>',
        'Migration complète depuis Ciel vers EBP. Avancement 50%: Clients et articles en cours de migration, historique des ventes à faire. Durée restante: 5h',
        v_base_date - INTERVAL '3 days',
        'Jordan'
    );

    -- ========================================================================
    -- Incident 9: Création modèles documents - NOUVEAU
    -- ========================================================================
    INSERT INTO public."Incident" (
        "Id",
        "Caption",
        "CustomerId",
        "CustomerName",
        "StartDate",
        "Status",
        "PredictedDuration",
        "AccomplishedDuration",
        "PredictedCosts",
        "PredictedSales",
        "PredictedGrossMargin",
        "AccomplishedCosts",
        "AccomplishedSales",
        "AccomplishedGrossMargin",
        "ProfitsOnDuration",
        "ProfitsOnCosts",
        "ProfitsOnSales",
        "ProfitsOnGrossMargin",
        "NeedToUpdateAnalysis",
        "Address_Npai",
        "Contact_NaturalPerson",
        "Contact_OptIn",
        "Contact_AllowUsePersonnalDatas",
        "HasAssociatedFiles",
        "CreatorColleagueId",
        "Description",
        "DescriptionClear",
        "sysCreatedDate",
        "sysCreatedUser"
    ) VALUES (
        'JORDN009',
        '🎨 Création modèles documents personnalisés',
        v_customer_id,
        v_customer_name,
        v_base_date + INTERVAL '1 day',
        0, -- NOUVEAU
        2.5,
        0.0,
        125.00,
        187.50,
        62.50,
        0.00,
        0.00,
        0.00,
        -2.5,
        -125.00,
        -187.50,
        -62.50,
        false,
        false,
        false,
        false,
        false,
        false,
        v_creator,
        '<p>Création de modèles personnalisés de documents commerciaux aux couleurs de la charte graphique du client.</p><p><strong>Documents à créer:</strong></p><ul><li>Modèle de devis (avec logo, couleurs bleu/blanc)</li><li>Modèle de facture (avec mentions légales)</li><li>Modèle de bon de livraison</li><li>Modèle d''avoir</li></ul><p><strong>Éléments fournis par le client:</strong> Logo HD, charte graphique PDF, exemple de document existant.</p>',
        'Création de modèles personnalisés (devis, factures, BL, avoirs) avec logo et charte graphique du client (bleu/blanc).',
        v_base_date,
        'Jordan'
    );

    -- ========================================================================
    -- Incident 10: Assistance télédéclaration TVA - PLANIFIÉ
    -- ========================================================================
    INSERT INTO public."Incident" (
        "Id",
        "Caption",
        "CustomerId",
        "CustomerName",
        "StartDate",
        "Status",
        "PredictedDuration",
        "AccomplishedDuration",
        "PredictedCosts",
        "PredictedSales",
        "PredictedGrossMargin",
        "AccomplishedCosts",
        "AccomplishedSales",
        "AccomplishedGrossMargin",
        "ProfitsOnDuration",
        "ProfitsOnCosts",
        "ProfitsOnSales",
        "ProfitsOnGrossMargin",
        "NeedToUpdateAnalysis",
        "Address_Npai",
        "Contact_NaturalPerson",
        "Contact_OptIn",
        "Contact_AllowUsePersonnalDatas",
        "HasAssociatedFiles",
        "CreatorColleagueId",
        "Description",
        "DescriptionClear",
        "sysCreatedDate",
        "sysCreatedUser"
    ) VALUES (
        'JORDN010',
        '📋 Assistance télédéclaration TVA CA3',
        v_customer_id,
        v_customer_name,
        v_base_date + INTERVAL '7 days',
        0, -- NOUVEAU/PLANIFIÉ
        1.5,
        0.0,
        75.00,
        112.50,
        37.50,
        0.00,
        0.00,
        0.00,
        -1.5,
        -75.00,
        -112.50,
        -37.50,
        false,
        false,
        false,
        false,
        false,
        false,
        v_creator,
        '<p>Accompagnement du client pour sa première télédéclaration de TVA (formulaire CA3) depuis EBP.</p><p><strong>Étapes de l''accompagnement:</strong></p><ol><li>Vérification des écritures comptables du mois</li><li>Rapprochement bancaire</li><li>Génération de la déclaration CA3 depuis EBP</li><li>Connexion au portail impots.gouv.fr</li><li>Télétransmission de la déclaration</li></ol><p><strong>Date limite de dépôt:</strong> ' || to_char(v_base_date + INTERVAL '10 days', 'DD/MM/YYYY') || '</p>',
        'Accompagnement première télédéclaration TVA CA3 depuis EBP. Étapes: Vérification écritures, Rapprochement bancaire, Génération CA3, Télétransmission sur impots.gouv.fr',
        v_base_date,
        'Jordan'
    );

    RAISE NOTICE '✅ 10 tickets d''intervention créés avec succès pour Jordan';
END $$;

-- ============================================================================
-- VÉRIFICATIONS FINALES
-- ============================================================================

DO $$
DECLARE
    v_incidents_count INT;
    v_incidents_nouveau INT;
    v_incidents_en_cours INT;
    v_incidents_resolu INT;
BEGIN
    -- Compter les incidents par statut
    SELECT
        COUNT(*) FILTER (WHERE "CreatorColleagueId" = 'JORDAN'),
        COUNT(*) FILTER (WHERE "CreatorColleagueId" = 'JORDAN' AND "Status" = 0),
        COUNT(*) FILTER (WHERE "CreatorColleagueId" = 'JORDAN' AND "Status" = 1),
        COUNT(*) FILTER (WHERE "CreatorColleagueId" = 'JORDAN' AND "Status" = 2)
    INTO v_incidents_count, v_incidents_nouveau, v_incidents_en_cours, v_incidents_resolu
    FROM public."Incident";

    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '          SEED JORDAN - RÉSULTATS';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '📊 STATISTIQUES DES TICKETS:';
    RAISE NOTICE '  • Total tickets créés: %', v_incidents_count;
    RAISE NOTICE '  • Nouveaux/Planifiés: % tickets', v_incidents_nouveau;
    RAISE NOTICE '  • En cours: % tickets', v_incidents_en_cours;
    RAISE NOTICE '  • Résolus: % tickets', v_incidents_resolu;
    RAISE NOTICE '';
    RAISE NOTICE '✅ Les tickets sont visibles dans:';
    RAISE NOTICE '  • L''interface EBP (module SAV/Incidents)';
    RAISE NOTICE '  • La table public."Incident"';
    RAISE NOTICE '  • L''app mobile (écran Interventions)';
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
END $$;
