-- =====================================================
-- Migration 010: Création des tables de fichiers
-- Description: Tables pour photos et signatures d'interventions
-- Date: 2025-10-24
-- =====================================================

-- 1. Table pour les photos d'interventions
CREATE TABLE IF NOT EXISTS mobile.intervention_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_id UUID NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  url TEXT NOT NULL,

  -- GPS où la photo a été prise
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),

  -- Description/légende
  description TEXT,

  -- Métadonnées
  uploaded_by UUID NOT NULL, -- ID utilisateur
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Contraintes
  CONSTRAINT fk_intervention_photo_user
    FOREIGN KEY (uploaded_by)
    REFERENCES mobile.users(id)
    ON DELETE CASCADE,

  CONSTRAINT chk_photo_size CHECK (size_bytes > 0 AND size_bytes <= 10485760), -- Max 10MB
  CONSTRAINT chk_photo_mimetype CHECK (mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp'))
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_intervention_photos_intervention
  ON mobile.intervention_photos(intervention_id);

CREATE INDEX IF NOT EXISTS idx_intervention_photos_uploaded
  ON mobile.intervention_photos(uploaded_at DESC);

CREATE INDEX IF NOT EXISTS idx_intervention_photos_user
  ON mobile.intervention_photos(uploaded_by);

-- 2. Table pour les signatures clients
CREATE TABLE IF NOT EXISTS mobile.intervention_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_id UUID NOT NULL UNIQUE, -- Une seule signature par intervention
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  url TEXT NOT NULL,

  -- Info signataire
  signer_name VARCHAR(255) NOT NULL, -- Nom du client qui signe
  signer_role VARCHAR(100), -- Fonction du signataire

  -- Métadonnées
  signed_by UUID NOT NULL, -- ID utilisateur (technicien)
  signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Contraintes
  CONSTRAINT fk_intervention_signature_user
    FOREIGN KEY (signed_by)
    REFERENCES mobile.users(id)
    ON DELETE CASCADE,

  CONSTRAINT chk_signature_size CHECK (size_bytes > 0 AND size_bytes <= 5242880), -- Max 5MB
  CONSTRAINT chk_signature_mimetype CHECK (mime_type IN ('image/png', 'image/svg+xml'))
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_intervention_signatures_intervention
  ON mobile.intervention_signatures(intervention_id);

CREATE INDEX IF NOT EXISTS idx_intervention_signatures_signed
  ON mobile.intervention_signatures(signed_at DESC);

-- 3. Vue pour statistiques de fichiers par intervention
CREATE OR REPLACE VIEW mobile.v_intervention_files_stats AS
SELECT
  se."Id" as intervention_id,
  COUNT(DISTINCT ip.id) as photos_count,
  COUNT(DISTINCT iss.id) as has_signature,
  COALESCE(SUM(ip.size_bytes), 0) + COALESCE(SUM(iss.size_bytes), 0) as total_size_bytes,
  MAX(ip.uploaded_at) as last_photo_at,
  MAX(iss.signed_at) as signed_at
FROM public."ScheduleEvent" se
LEFT JOIN mobile.intervention_photos ip ON ip.intervention_id = se."Id"::text::uuid
LEFT JOIN mobile.intervention_signatures iss ON iss.intervention_id = se."Id"::text::uuid
GROUP BY se."Id";

COMMENT ON VIEW mobile.v_intervention_files_stats IS 'Statistiques de fichiers par intervention';

-- 4. Fonction pour nettoyer les fichiers orphelins (interventions supprimées)
CREATE OR REPLACE FUNCTION mobile.cleanup_orphan_files()
RETURNS TABLE(
  deleted_photos INTEGER,
  deleted_signatures INTEGER
) AS $$
DECLARE
  v_deleted_photos INTEGER;
  v_deleted_signatures INTEGER;
BEGIN
  -- Supprimer photos orphelines
  DELETE FROM mobile.intervention_photos
  WHERE intervention_id::text NOT IN (
    SELECT "Id"::text FROM public."ScheduleEvent"
  );

  GET DIAGNOSTICS v_deleted_photos = ROW_COUNT;

  -- Supprimer signatures orphelines
  DELETE FROM mobile.intervention_signatures
  WHERE intervention_id::text NOT IN (
    SELECT "Id"::text FROM public."ScheduleEvent"
  );

  GET DIAGNOSTICS v_deleted_signatures = ROW_COUNT;

  RETURN QUERY SELECT v_deleted_photos, v_deleted_signatures;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mobile.cleanup_orphan_files() IS 'Nettoie les fichiers orphelins (interventions supprimées)';

-- 5. Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON mobile.intervention_photos TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON mobile.intervention_signatures TO postgres;
GRANT SELECT ON mobile.v_intervention_files_stats TO postgres;

-- 6. Log migration
INSERT INTO mobile.migration_history (migration_number, migration_name, executed_at)
VALUES (10, '010_create_files_tables', NOW())
ON CONFLICT (migration_number) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration 010: Tables de fichiers créées avec succès';
  RAISE NOTICE '  - mobile.intervention_photos';
  RAISE NOTICE '  - mobile.intervention_signatures';
  RAISE NOTICE '  - mobile.v_intervention_files_stats (vue)';
  RAISE NOTICE '  - mobile.cleanup_orphan_files() (fonction)';
END $$;
