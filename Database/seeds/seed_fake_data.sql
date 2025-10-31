/**
 * ============================================================================
 * SEED COMPLET - FAKE DATA POUR APP MOBILE
 * ============================================================================
 *
 * Génère des données de test réalistes et variées:
 * - 30+ interventions avec différents statuts
 * - Adresses réelles à Paris et Île-de-France
 * - Descriptions détaillées et réalistes
 * - Références JORDN001 à JORDN030+
 *
 * Usage: psql -h localhost -U postgres -d sli_db -f seed_fake_data.sql
 *
 * Auteur: Claude Code
 * Date: 2025-10-31
 * ============================================================================
 */

-- Nettoyer les anciennes données de test
DELETE FROM public."ScheduleEvent"
WHERE "ScheduleEventNumber" LIKE 'JORDN%' OR "ScheduleEventNumber" LIKE 'INT-%';

RAISE NOTICE '';
RAISE NOTICE '╔════════════════════════════════════════════════════════════════╗';
RAISE NOTICE '║          SEED FAKE DATA - INTERVENTIONS JORDAN                 ║';
RAISE NOTICE '╚════════════════════════════════════════════════════════════════╝';
RAISE NOTICE '';

-- Fonction helper pour créer une intervention
CREATE OR REPLACE FUNCTION seed_intervention(
    p_ref VARCHAR,
    p_caption VARCHAR,
    p_notes TEXT,
    p_description TEXT,
    p_report TEXT,
    p_state INTEGER,
    p_start_offset INTERVAL,
    p_duration NUMERIC,
    p_achieved NUMERIC,
    p_address VARCHAR,
    p_city VARCHAR,
    p_postal VARCHAR,
    p_lat NUMERIC,
    p_lon NUMERIC,
    p_urgent BOOLEAN DEFAULT FALSE,
    p_price NUMERIC DEFAULT 0
) RETURNS UUID AS $$
DECLARE
    v_jordan_id VARCHAR := 'JORDAN';
    v_customer_id VARCHAR;
    v_intervention_id UUID;
BEGIN
    SELECT "Id" INTO v_customer_id FROM public."Customer" WHERE "ActiveState" = 1 ORDER BY RANDOM() LIMIT 1;
    v_intervention_id := gen_random_uuid();

    INSERT INTO public."ScheduleEvent" (
        "Id", "ScheduleEventNumber", "Caption", "NotesClear",
        "Maintenance_InterventionDescriptionClear", "Maintenance_InterventionReport",
        "ColleagueId", "CustomerId",
        "StartDateTime", "EndDateTime",
        "EventState", "EventType",
        "ExpectedDuration_DurationInHours", "AchievedDuration_DurationInHours",
        "Address_Address1", "Address_City", "Address_ZipCode",
        "Address_Latitude", "Address_Longitude",
        "sysCreatedDate", "sysModifiedDate",
        "xx_Projet", "LineType", "LineOrder", "ScheduleShowTimeLine",
        "SalePriceVatExcluded", "NetAmountVatExcluded", "HourlyCostPrice", "CostAmount",
        "IncludeInRealizedCost", "ToInvoice", "DocumentType", "Address_Npai",
        "Contact_NaturalPerson", "Contact_OptIn", "ReminderEnabled",
        "Maintenance_InvoiceTravelExpenseOnLastIntervention",
        "Maintenance_SendConfirmationMail", "Maintenance_NextEventToForesee",
        "Maintenance_DecreaseContractCounterForNextEvent",
        "Maintenance_IncludeInIncidentPredictedCost", "Maintenance_IncludeInContractPredictedCost",
        "InvoiceInterveners", "InvoiceEquipments", "PredictedCostAmount",
        "xx_URGENT", "Contact_AllowUsePersonnalDatas", "DisplayType", "ExceptionWorked",
        "PayrollVariableDuration0", "PayrollVariableDuration1", "PayrollVariableDuration2",
        "PayrollVariableDuration3", "PayrollVariableDuration4", "PayrollVariableDuration5",
        "PayrollVariableDuration6", "PayrollVariableDuration7", "PayrollVariableDuration8",
        "PayrollVariableDuration9", "PayrollVariableDuration10", "PayrollVariableDuration11",
        "PayrollVariableDuration12", "PayrollVariableDuration13", "PayrollVariableDuration14",
        "PayrollVariableDuration15", "PayrollVariableDuration16", "PayrollVariableDuration17",
        "PayrollVariableDuration18", "PayrollVariableDuration19", "PayrollVariableDuration20",
        "PayrollVariableDuration21", "PayrollVariableDuration22", "PayrollVariableDuration23",
        "PayrollVariableDuration24", "PayrollVariableDuration25", "PayrollVariableDuration26",
        "PayrollVariableDuration27", "PayrollVariableDuration28", "PayrollVariableDuration29",
        "PayrollVariableDuration30", "PayrollVariableDuration31", "PayrollVariableDuration32",
        "PayrollVariableDuration33", "PayrollVariableDuration34", "PayrollVariableDuration35",
        "PayrollVariableDuration36", "PayrollVariableDuration37", "PayrollVariableDuration38",
        "PayrollVariableDuration39", "PayrollVariableDuration40", "PayrollVariableDuration41",
        "PayrollVariableDuration42", "PayrollVariableDuration43", "PayrollVariableDuration44",
        "PayrollVariableDuration45", "PayrollVariableDuration46", "PayrollVariableDuration47",
        "PayrollVariableDuration48", "PayrollVariableDuration49",
        "ExceptionDaySchedule0_Active", "ExceptionDaySchedule0_Customize", "ExceptionDaySchedule0_Duration",
        "ExceptionDaySchedule0_StartTime", "ExceptionDaySchedule0_EndTime",
        "ExceptionDaySchedule1_Active", "ExceptionDaySchedule1_Customize", "ExceptionDaySchedule1_Duration",
        "ExceptionDaySchedule1_StartTime", "ExceptionDaySchedule1_EndTime",
        "ExceptionDaySchedule2_Active", "ExceptionDaySchedule2_Customize", "ExceptionDaySchedule2_Duration",
        "ExceptionDaySchedule2_StartTime", "ExceptionDaySchedule2_EndTime",
        "ExceptionDaySchedule3_Active", "ExceptionDaySchedule3_Customize", "ExceptionDaySchedule3_Duration",
        "ExceptionDaySchedule3_StartTime", "ExceptionDaySchedule3_EndTime",
        "ExceptionDaySchedule4_Active", "ExceptionDaySchedule4_Customize", "ExceptionDaySchedule4_Duration",
        "ExceptionDaySchedule4_StartTime", "ExceptionDaySchedule4_EndTime",
        "ExceptionDaySchedule5_Active", "ExceptionDaySchedule5_Customize", "ExceptionDaySchedule5_Duration",
        "ExceptionDaySchedule5_StartTime", "ExceptionDaySchedule5_EndTime",
        "ExceptionDaySchedule6_Active", "ExceptionDaySchedule6_Customize", "ExceptionDaySchedule6_Duration",
        "ExceptionDaySchedule6_StartTime", "ExceptionDaySchedule6_EndTime",
        "PlannedHours", "WorkedHours", "HasAssociatedFiles", "ConflictIndicator", "ConflictTypes",
        "IsScheduleException", "MustBeCalculated", "GlobalPercentComplete", "LabourPercentComplete",
        "CreatedByExecutionQuote", "DateChangeRemindEnabled"
    ) VALUES (
        v_intervention_id, p_ref, p_caption, p_notes, p_description, p_report,
        v_jordan_id, v_customer_id,
        NOW() + p_start_offset, NOW() + p_start_offset + (p_duration || ' hours')::INTERVAL,
        p_state, 'bb9d173f-9937-4cde-a665-58a66a24ea15'::uuid,
        p_duration, p_achieved,
        p_address, p_city, p_postal, p_lat, p_lon,
        NOW() - INTERVAL '1 hour', NOW(),
        false, 0, 0, false, p_price, p_price, 75.0, p_achieved * 75.0,
        0, CASE WHEN p_state >= 2 THEN true ELSE false END, 0, false,
        false, false, false, 0, false, false, false, 0, 0,
        p_urgent, false, 0, false, false, 0, false,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        false, false, 0, '1900-01-01'::timestamp, '1900-01-01'::timestamp,
        false, false, 0, '1900-01-01'::timestamp, '1900-01-01'::timestamp,
        false, false, 0, '1900-01-01'::timestamp, '1900-01-01'::timestamp,
        false, false, 0, '1900-01-01'::timestamp, '1900-01-01'::timestamp,
        false, false, 0, '1900-01-01'::timestamp, '1900-01-01'::timestamp,
        false, false, 0, '1900-01-01'::timestamp, '1900-01-01'::timestamp,
        false, false, 0, '1900-01-01'::timestamp, '1900-01-01'::timestamp,
        0, 0, false, 0, 0, false, false,
        CASE WHEN p_state >= 2 THEN 100 ELSE CASE WHEN p_state = 1 THEN 50 ELSE 0 END END,
        CASE WHEN p_state >= 2 THEN 100 ELSE CASE WHEN p_state = 1 THEN 50 ELSE 0 END END,
        false, false
    );

    RETURN v_intervention_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INTERVENTIONS EN COURS (IN_PROGRESS) - 5 interventions
-- ============================================================================
DO $$
DECLARE v_id UUID; v_count INT := 0;
BEGIN
    RAISE NOTICE '📍 Interventions EN COURS...';

    v_id := seed_intervention('JORDN001', 'URGENT - Serveur Exchange HS',
        'Messagerie down. 50 utilisateurs impactés. Priorité max.',
        'Diagnostic et réparation serveur Exchange 2019. Crash service après mise à jour Windows.',
        NULL, 1, INTERVAL '-45 minutes', 3.0, 0.75,
        '15 Rue de la Paix', 'Paris', '75002', 48.8688, 2.3315, TRUE, 0);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN002', 'Installation firewall nouvelle agence',
        'Nouvelle agence. Installation et configuration Fortinet.',
        'Installation firewall Fortinet 60E + configuration VPN site-to-site + règles de sécurité.',
        NULL, 1, INTERVAL '15 minutes', 4.5, 1.0,
        '88 Avenue Kléber', 'Paris', '75116', 48.8704, 2.2931, FALSE, 0);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN003', 'Migration messagerie vers Office 365',
        'Migration en cours. 120 boîtes aux lettres. Phase 2/3.',
        'Migration Exchange on-premise vers Exchange Online. Synchronisation boîtes aux lettres + configuration DNS.',
        NULL, 1, INTERVAL '-2 hours', 6.0, 2.5,
        '42 Avenue Montaigne', 'Paris', '75008', 48.8673, 2.3059, FALSE, 0);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN004', 'Dépannage imprimante réseau',
        'Imprimante Canon ne répond plus. Service comptabilité bloqué.',
        'Diagnostic imprimante Canon iR-ADV C5535i. Problème driver + file d''attente bloquée.',
        NULL, 1, INTERVAL '30 minutes', 1.5, 0.5,
        '12 Rue du Faubourg Saint-Honoré', 'Paris', '75008', 48.8694, 2.3167, FALSE, 0);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN005', 'Test Upload Photos/Signature',
        'Intervention dédiée aux tests upload depuis mobile.',
        'Test complet fonctionnalités: upload photo avec GPS, capture signature client, timesheet.',
        NULL, 1, INTERVAL '1 hour', 2.0, 0.25,
        '10 Place Vendôme', 'Paris', '75001', 48.8675, 2.3298, FALSE, 0);
    v_count := v_count + 1;

    RAISE NOTICE '   ✅ % interventions IN_PROGRESS créées', v_count;
END $$;

-- ============================================================================
-- INTERVENTIONS PLANIFIÉES (SCHEDULED) - 8 interventions
-- ============================================================================
DO $$
DECLARE v_id UUID; v_count INT := 0;
BEGIN
    RAISE NOTICE '📅 Interventions PLANIFIÉES...';

    v_id := seed_intervention('JORDN006', 'Maintenance mensuelle serveurs',
        'Maintenance préventive mensuelle. Contrat Silver.',
        'Maintenance complète: mise à jour Windows, vérification backups, nettoyage logs, monitoring.',
        NULL, 0, INTERVAL '1 day' + INTERVAL '9 hours', 3.0, 0.0,
        '25 Rue de Courcelles', 'Paris', '75008', 48.8790, 2.3042, FALSE, 225);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN007', 'Installation baie de brassage',
        'Réorganisation salle serveur. Installation rack 42U.',
        'Installation rack 42U Rittal + baie brassage Cat6A + onduleur APC Smart-UPS 3000VA.',
        NULL, 0, INTERVAL '2 days' + INTERVAL '8 hours', 5.0, 0.0,
        '156 Boulevard Haussmann', 'Paris', '75008', 48.8747, 2.3127, FALSE, 0);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN008', 'Audit de sécurité réseau',
        'Audit annuel sécurité. Scan vulnérabilités + rapport.',
        'Audit complet sécurité: scan Nessus, test pénétration, audit config firewall, rapport détaillé.',
        NULL, 0, INTERVAL '2 days' + INTERVAL '14 hours', 4.0, 0.0,
        '8 Rue Royale', 'Paris', '75008', 48.8686, 2.3235, FALSE, 600);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN009', 'Formation utilisateurs Teams',
        'Formation 15 personnes sur Microsoft Teams.',
        'Formation Teams: collaboration, réunions, partage fichiers, bonnes pratiques.',
        NULL, 0, INTERVAL '3 days' + INTERVAL '9 hours', 3.5, 0.0,
        '33 Avenue des Champs-Élysées', 'Paris', '75008', 48.8698, 2.3078, FALSE, 525);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN010', 'Déploiement WiFi 6 étage 3',
        'Installation 8 bornes Cisco Meraki MR46.',
        'Installation bornes WiFi 6 Cisco Meraki + configuration cloud + tests couverture.',
        NULL, 0, INTERVAL '3 days' + INTERVAL '13 hours', 4.5, 0.0,
        '75 Avenue Marceau', 'Paris', '75008', 48.8677, 2.2987, FALSE, 0);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN011', 'RDV diagnostic lenteurs réseau',
        'Plainte utilisateurs sur lenteurs depuis 1 semaine.',
        'Diagnostic complet: analyse bande passante, test switch, vérification broadcast storms.',
        NULL, 0, INTERVAL '4 days' + INTERVAL '10 hours', 2.5, 0.0,
        '92 Avenue Victor Hugo', 'Neuilly-sur-Seine', '92200', 48.8764, 2.2698, FALSE, 0);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN012', 'Installation système visioconférence',
        'Salle de réunion. Installation Logitech Rally Plus.',
        'Installation système visio Logitech Rally Plus + écran 75" + config Teams Room.',
        NULL, 0, INTERVAL '5 days' + INTERVAL '9 hours', 3.0, 0.0,
        '18 Avenue Kléber', 'Paris', '75116', 48.8711, 2.2936, FALSE, 0);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN013', 'Maintenance préventive climatisation',
        'Contrôle annuel obligatoire climatisation salle serveur.',
        'Vérification climatisation: nettoyage filtres, contrôle fluide, test alarmes température.',
        NULL, 0, INTERVAL '6 days' + INTERVAL '9 hours', 2.0, 0.0,
        '5 Place de la Concorde', 'Paris', '75008', 48.8656, 2.3212, FALSE, 180);
    v_count := v_count + 1;

    RAISE NOTICE '   ✅ % interventions SCHEDULED créées', v_count;
END $$;

-- ============================================================================
-- INTERVENTIONS TERMINÉES (COMPLETED) - 10 interventions
-- ============================================================================
DO $$
DECLARE v_id UUID; v_count INT := 0;
BEGIN
    RAISE NOTICE '✅ Interventions TERMINÉES...';

    v_id := seed_intervention('JORDN014', 'Déménagement serveurs datacenter',
        'Migration 12 serveurs vers nouveau datacenter.',
        'Déménagement complet: arrêt propre, transport, réinstallation, tests, remise en service.',
        'Migration réussie. 12 serveurs déplacés. Tests OK. Production rétablie en 4h30 au lieu de 6h prévues.',
        2, INTERVAL '-1 day' - INTERVAL '8 hours', 6.0, 4.5,
        '45 Quai de la Râpée', 'Paris', '75012', 48.8445, 2.3736, FALSE, 0);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN015', 'Remplacement disques RAID serveur',
        'Alerte RAID dégradé. Remplacement 2 disques 2To.',
        'Remplacement disques défectueux + rebuild RAID5 + vérification intégrité données.',
        'Disques remplacés. Rebuild RAID terminé. Système stabilisé. Aucune perte de données.',
        2, INTERVAL '-1 day' - INTERVAL '5 hours', 3.5, 3.25,
        '28 Rue de Berri', 'Paris', '75008', 48.8724, 2.3047, FALSE, 262.5);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN016', 'Configuration VPN nomades',
        'Setup VPN pour 25 télétravailleurs.',
        'Configuration VPN SSL Fortinet + distribution certificats + documentation utilisateurs.',
        'VPN configuré et testé. 25 utilisateurs connectés avec succès. Documentation distribuée.',
        2, INTERVAL '-2 days', 4.0, 3.75,
        '14 Rue de la Pompe', 'Paris', '75116', 48.8662, 2.2799, FALSE, 281.25);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN017', 'Nettoyage complet salle serveur',
        'Nettoyage annuel + réorganisation câblage.',
        'Nettoyage complet salle serveur + réorganisation câblage réseau + étiquetage.',
        'Salle serveur nettoyée. Câblage réorganisé et étiqueté. Documentation mise à jour.',
        2, INTERVAL '-3 days', 5.0, 4.75,
        '67 Avenue Marceau', 'Paris', '75016', 48.8677, 2.2987, FALSE, 356.25);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN018', 'Installation poste CEO',
        'Nouveau CEO. Setup complet workstation haute perf.',
        'Installation PC Dell Precision 5820 + 3 écrans 27" + config logiciels + transfert données.',
        'Installation terminée. Formation CEO effectuée (30min). Configuration optimale.',
        2, INTERVAL '-4 days', 3.0, 2.75,
        '102 Avenue des Champs-Élysées', 'Paris', '75008', 48.8721, 2.3013, FALSE, 206.25);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN019', 'Diagnostic et réparation connexion Internet',
        'Internet down. Liaison fibre coupée.',
        'Diagnostic: fibre coupée niveau opérateur. Coordination avec Orange. Rétablissement.',
        'Problème résolu. Fibre réparée par Orange. Connexion rétablie. Tests OK.',
        2, INTERVAL '-5 days', 2.5, 2.0,
        '88 Rue du Faubourg Saint-Denis', 'Paris', '75010', 48.8760, 2.3556, TRUE, 150);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN020', 'Mise à jour antivirus flotte',
        'Déploiement nouvelle version Kaspersky Endpoint.',
        'Déploiement Kaspersky Endpoint Security 12 sur 85 postes via GPO.',
        'Déploiement réussi sur 83/85 postes. 2 postes hors ligne. Suivi prévu.',
        2, INTERVAL '-6 days', 3.5, 3.0,
        '124 Rue La Boétie', 'Paris', '75008', 48.8732, 2.3096, FALSE, 225);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN021', 'Formation SharePoint Online',
        'Formation 12 personnes SharePoint + OneDrive.',
        'Formation complète: gestion documents, sites équipe, OneDrive, partage, versioning.',
        'Formation dispensée. Participants satisfaits (9.2/10). Support PDF + vidéos fournis.',
        2, INTERVAL '-7 days', 4.0, 3.75,
        '15 Boulevard de la Madeleine', 'Paris', '75001', 48.8694, 2.3253, FALSE, 281.25);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN022', 'Dépannage téléphonie IP',
        'Problème qualité audio sur 15 postes VoIP.',
        'Diagnostic QoS réseau + reconfiguration switch + tests qualité audio.',
        'Problème QoS résolu. Configuration VLAN voice optimisée. Audio parfait.',
        2, INTERVAL '-8 days', 2.5, 2.25,
        '9 Rue Scribe', 'Paris', '75009', 48.8717, 2.3308, FALSE, 168.75);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN023', 'Installation NAS Synology',
        'Nouveau NAS pour sauvegarde + partage fichiers.',
        'Installation Synology DS1821+ 8 baies + config RAID6 + partages réseau + backup automatique.',
        'NAS installé et configuré. 32To utilisables. Tests backup OK. Formation admin effectuée.',
        2, INTERVAL '-10 days', 4.5, 4.0,
        '55 Rue Pierre Charron', 'Paris', '75008', 48.8689, 2.3017, FALSE, 300);
    v_count := v_count + 1;

    RAISE NOTICE '   ✅ % interventions COMPLETED créées', v_count;
END $$;

-- ============================================================================
-- INTERVENTIONS FACTURÉES (INVOICED) - 5 interventions
-- ============================================================================
DO $$
DECLARE v_id UUID; v_count INT := 0;
BEGIN
    RAISE NOTICE '💰 Interventions FACTURÉES...';

    v_id := seed_intervention('JORDN024', 'Audit infrastructure complète',
        'Audit annuel infrastructure IT complète.',
        'Audit complet: inventaire matériel/logiciel, sécurité, performances, recommandations.',
        'Audit réalisé. Rapport 45 pages fourni. 23 recommandations dont 8 critiques. Facturé.',
        3, INTERVAL '-15 days', 8.0, 8.0,
        '50 Avenue Montaigne', 'Paris', '75008', 48.8673, 2.3047, FALSE, 1200);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN025', 'Migration infrastructure vers cloud Azure',
        'Migration 8 serveurs vers Azure IaaS.',
        'Migration serveurs physiques vers Azure: 5 VMs, 2 SQL Server, 1 DC. Config réseau VPN.',
        'Migration réussie. Tous services fonctionnels. Économie 35% coûts hébergement. Facturé.',
        3, INTERVAL '-20 days', 16.0, 15.5,
        '18 Rue de Presbourg', 'Paris', '75016', 48.8746, 2.2899, FALSE, 2325);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN026', 'Formation administrateurs Office 365',
        'Formation avancée admin O365 - 3 jours.',
        'Formation complète: Exchange Online, SharePoint, Teams, Intune, sécurité, compliance.',
        'Formation 3 jours dispensée. 4 admins formés. Certification Microsoft incluse. Facturé.',
        3, INTERVAL '-25 days', 21.0, 21.0,
        '32 Avenue George V', 'Paris', '75008', 48.8689, 2.3009, FALSE, 3150);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN027', 'Déploiement MDM Intune 150 devices',
        'Déploiement solution MDM sur parc mobile.',
        'Configuration Intune + policies sécurité + enrollment 150 smartphones/tablettes.',
        'Déploiement terminé. 148/150 devices enrollés. 2 iPhone anciens non compatibles. Facturé.',
        3, INTERVAL '-30 days', 12.0, 11.5,
        '76 Avenue des Ternes', 'Paris', '75017', 48.8794, 2.2923, FALSE, 1725);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN028', 'Mise en place backup Veeam',
        'Solution backup complète Veeam B&R.',
        'Installation Veeam Backup & Replication + config jobs + tests restauration.',
        'Veeam installé et configuré. 12 VMs en backup quotidien. RPO 4h/RTO 2h. Facturé.',
        3, INTERVAL '-35 days', 6.0, 5.75,
        '144 Boulevard Malesherbes', 'Paris', '75017', 48.8846, 2.3057, FALSE, 862.5);
    v_count := v_count + 1;

    RAISE NOTICE '   ✅ % interventions INVOICED créées', v_count;
END $$;

-- ============================================================================
-- INTERVENTIONS EN ATTENTE (PENDING) - 4 interventions
-- ============================================================================
DO $$
DECLARE v_id UUID; v_count INT := 0;
BEGIN
    RAISE NOTICE '⏳ Interventions EN ATTENTE...';

    v_id := seed_intervention('JORDN029', 'RDV diagnostic Wi-Fi instable',
        'Plainte utilisateurs: Wi-Fi se déconnecte régulièrement.',
        'Diagnostic couverture Wi-Fi + analyse interférences + recommandations.',
        NULL, 4, INTERVAL '4 hours', 2.0, 0.0,
        '22 Rue de Bassano', 'Paris', '75116', 48.8709, 2.2951, FALSE, 0);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN030', 'Commande matériel - Validation client',
        'Devis validé. En attente commande matériel.',
        'Commande switch Cisco Catalyst 9300 48 ports + 8 AP WiFi 6 + câblage Cat6A.',
        NULL, 4, INTERVAL '6 hours', 0.5, 0.0,
        '3 Avenue Hoche', 'Paris', '75008', 48.8751, 2.3002, FALSE, 0);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN031', 'Devis extension garantie serveurs',
        'Client demande devis extension garantie 5 ans.',
        'Devis à préparer: extension garantie Dell ProSupport Plus 5 ans sur 4 serveurs.',
        NULL, 4, INTERVAL '1 day', 1.0, 0.0,
        '89 Rue Taitbout', 'Paris', '75009', 48.8763, 2.3366, FALSE, 0);
    v_count := v_count + 1;

    v_id := seed_intervention('JORDN032', 'À planifier - Déménagement informatique',
        'Déménagement bureau prévu le 15/12. À planifier.',
        'Déménagement complet: déconnexion/reconnexion 45 postes + 3 serveurs + téléphonie IP.',
        NULL, 4, INTERVAL '2 days', 8.0, 0.0,
        '156 Rue de Courcelles', 'Paris', '75017', 48.8822, 2.2998, FALSE, 0);
    v_count := v_count + 1;

    RAISE NOTICE '   ✅ % interventions PENDING créées', v_count;
END $$;

-- Nettoyer fonction helper
DROP FUNCTION seed_intervention;

-- ============================================================================
-- RÉSUMÉ
-- ============================================================================
DO $$
DECLARE
    v_total INT;
    v_in_progress INT;
    v_scheduled INT;
    v_completed INT;
    v_invoiced INT;
    v_pending INT;
BEGIN
    SELECT COUNT(*) INTO v_total FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" LIKE 'JORDN%';
    SELECT COUNT(*) INTO v_in_progress FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" LIKE 'JORDN%' AND "EventState" = 1;
    SELECT COUNT(*) INTO v_scheduled FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" LIKE 'JORDN%' AND "EventState" = 0;
    SELECT COUNT(*) INTO v_completed FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" LIKE 'JORDN%' AND "EventState" = 2;
    SELECT COUNT(*) INTO v_invoiced FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" LIKE 'JORDN%' AND "EventState" = 3;
    SELECT COUNT(*) INTO v_pending FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" LIKE 'JORDN%' AND "EventState" = 4;

    RAISE NOTICE '';
    RAISE NOTICE '╔════════════════════════════════════════════════════════════════╗';
    RAISE NOTICE '║                          RÉSUMÉ                                ║';
    RAISE NOTICE '╠════════════════════════════════════════════════════════════════╣';
    RAISE NOTICE '║  Total interventions créées: %                              ║', LPAD(v_total::text, 2, ' ');
    RAISE NOTICE '║                                                                ║';
    RAISE NOTICE '║  📍 IN_PROGRESS  : % (dont 1 urgent)                        ║', LPAD(v_in_progress::text, 2, ' ');
    RAISE NOTICE '║  📅 SCHEDULED    : %                                         ║', LPAD(v_scheduled::text, 2, ' ');
    RAISE NOTICE '║  ✅ COMPLETED    : %                                        ║', LPAD(v_completed::text, 2, ' ');
    RAISE NOTICE '║  💰 INVOICED     : %                                         ║', LPAD(v_invoiced::text, 2, ' ');
    RAISE NOTICE '║  ⏳ PENDING      : %                                         ║', LPAD(v_pending::text, 2, ' ');
    RAISE NOTICE '╠════════════════════════════════════════════════════════════════╣';
    RAISE NOTICE '║  🚀 Prêt pour tester l''app mobile !                          ║';
    RAISE NOTICE '║  👉 Intervention JORDN005 = test upload                       ║';
    RAISE NOTICE '╚════════════════════════════════════════════════════════════════╝';
    RAISE NOTICE '';
END $$;
