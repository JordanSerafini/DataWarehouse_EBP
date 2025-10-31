/**
 * Patch des fonctions d'auto-mapping
 * Correction pour la structure de la base sli_db (Name au lieu de Caption)
 */

-- ============================================================================
-- Fonction: Auto-mapping organisations → clients EBP (corrigée)
-- ============================================================================
CREATE OR REPLACE FUNCTION mobile.auto_map_ninjaone_organizations()
RETURNS TABLE (
  mapped_count INTEGER,
  message TEXT
) AS $$
DECLARE
  v_mapped_count INTEGER := 0;
BEGIN
  -- Mapper les organisations par correspondance exacte du nom
  INSERT INTO mobile.ninjaone_customer_mapping (
    ninjaone_organization_id,
    ninjaone_organization_name,
    ebp_customer_id,
    ebp_customer_name,
    mapping_confidence,
    validated
  )
  SELECT DISTINCT
    o.organization_id,
    o.organization_name,
    c."Id",
    c."Name", -- Corrigé: Name au lieu de Caption
    'auto_exact',
    TRUE
  FROM ninjaone.dim_organizations o
  INNER JOIN public."Customer" c
    ON LOWER(TRIM(o.organization_name)) = LOWER(TRIM(c."Name")) -- Corrigé
  WHERE NOT EXISTS (
    SELECT 1
    FROM mobile.ninjaone_customer_mapping m
    WHERE m.ninjaone_organization_id = o.organization_id
  )
  ON CONFLICT (ninjaone_organization_id) DO NOTHING;

  GET DIAGNOSTICS v_mapped_count = ROW_COUNT;

  RETURN QUERY SELECT v_mapped_count,
    format('%s organisations mappées automatiquement par nom exact', v_mapped_count);

EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT 0, format('Erreur: %s', SQLERRM);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.auto_map_ninjaone_organizations() IS
'Mappe automatiquement les organisations NinjaOne aux clients EBP par correspondance exacte du nom';


-- ============================================================================
-- Fonction: Auto-mapping techniciens → collègues EBP (corrigée)
-- ============================================================================
CREATE OR REPLACE FUNCTION mobile.auto_map_ninjaone_technicians()
RETURNS TABLE (
  mapped_count INTEGER,
  message TEXT
) AS $$
DECLARE
  v_mapped_count INTEGER := 0;
BEGIN
  -- Mapper les techniciens par correspondance exacte de l'email
  INSERT INTO mobile.ninjaone_technician_mapping (
    ninjaone_technician_id,
    ninjaone_technician_name,
    ninjaone_technician_email,
    ebp_colleague_id,
    ebp_colleague_name,
    ebp_colleague_email,
    mapping_confidence,
    validated
  )
  SELECT DISTINCT
    tech.technician_id,
    tech.full_name,
    tech.email,
    col."Id",
    COALESCE(col."Contact_Name" || ' ' || col."Contact_FirstName", col."Contact_Name"), -- Corrigé
    col."Contact_Email",
    'auto_exact',
    TRUE
  FROM ninjaone.dim_technicians tech
  INNER JOIN public."Colleague" col
    ON LOWER(TRIM(tech.email)) = LOWER(TRIM(col."Contact_Email")) -- Corrigé: Contact_Email
  WHERE tech.email IS NOT NULL
    AND col."Contact_Email" IS NOT NULL
    AND NOT EXISTS (
      SELECT 1
      FROM mobile.ninjaone_technician_mapping m
      WHERE m.ninjaone_technician_id = tech.technician_id
    )
  ON CONFLICT (ninjaone_technician_id) DO NOTHING;

  GET DIAGNOSTICS v_mapped_count = ROW_COUNT;

  RETURN QUERY SELECT v_mapped_count,
    format('%s techniciens mappés automatiquement par email exact', v_mapped_count);

EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT 0, format('Erreur: %s', SQLERRM);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.auto_map_ninjaone_technicians() IS
'Mappe automatiquement les techniciens NinjaOne aux collègues EBP par correspondance exacte de l''email';


-- ============================================================================
-- Message de confirmation
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Patch appliqué avec succès';
  RAISE NOTICE '📝 Fonctions corrigées pour sli_db:';
  RAISE NOTICE '   - mobile.auto_map_ninjaone_organizations() (utilise Customer.Name)';
  RAISE NOTICE '   - mobile.auto_map_ninjaone_technicians() (utilise Colleague.Contact_Email)';
END $$;
