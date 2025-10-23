-- ============================================================
-- Migration 009: Table utilisateurs pour authentification mobile
-- ============================================================
-- Description: Création table users avec rôles et permissions
-- ============================================================

-- ============================================================
-- TABLE: mobile.users
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identité
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,

    -- Rôle et permissions
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'super_admin',
        'admin',
        'patron',
        'commercial',
        'chef_chantier',
        'technicien'
    )),

    -- Lien avec EBP (si applicable)
    colleague_id VARCHAR(50), -- Référence public."Colleague"."Id"

    -- Device tracking
    last_device_id VARCHAR(255),
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(45),

    -- Sécurité
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,

    -- Audit
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Index
CREATE INDEX idx_users_email ON mobile.users(email);
CREATE INDEX idx_users_role ON mobile.users(role);
CREATE INDEX idx_users_colleague ON mobile.users(colleague_id);
CREATE INDEX idx_users_active ON mobile.users(is_active) WHERE is_active = true;

COMMENT ON TABLE mobile.users IS 'Utilisateurs app mobile avec authentification';

-- ============================================================
-- TABLE: mobile.user_sessions
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Utilisateur
    user_id UUID NOT NULL REFERENCES mobile.users(id) ON DELETE CASCADE,

    -- Token
    token_jti VARCHAR(255) UNIQUE NOT NULL, -- JWT ID

    -- Device info
    device_id VARCHAR(255),
    device_name VARCHAR(255),
    device_os VARCHAR(50),
    device_app_version VARCHAR(50),

    -- Session info
    ip_address VARCHAR(45),
    user_agent TEXT,

    -- Durée
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,

    -- Audit
    created_at TIMESTAMP DEFAULT NOW(),
    last_activity_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_sessions_user ON mobile.user_sessions(user_id);
CREATE INDEX idx_sessions_token ON mobile.user_sessions(token_jti);
CREATE INDEX idx_sessions_expires ON mobile.user_sessions(expires_at);
CREATE INDEX idx_sessions_active ON mobile.user_sessions(user_id, expires_at)
    WHERE revoked_at IS NULL;

COMMENT ON TABLE mobile.user_sessions IS 'Sessions actives JWT avec tracking device';

-- ============================================================
-- FONCTION: Créer utilisateur avec hash password
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.create_user(
    p_email VARCHAR(255),
    p_password_hash VARCHAR(255),
    p_full_name VARCHAR(255),
    p_role VARCHAR(50),
    p_colleague_id VARCHAR(50) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
BEGIN
    INSERT INTO mobile.users (
        email, password_hash, full_name, role, colleague_id
    )
    VALUES (
        p_email, p_password_hash, p_full_name, p_role, p_colleague_id
    )
    RETURNING id INTO v_user_id;

    RAISE NOTICE '✅ Utilisateur créé: % (%)', p_full_name, p_role;
    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FONCTION: Invalider toutes les sessions d'un utilisateur
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.revoke_user_sessions(
    p_user_id UUID
)
RETURNS INTEGER AS $$
DECLARE
    v_revoked INTEGER;
BEGIN
    UPDATE mobile.user_sessions
    SET revoked_at = NOW()
    WHERE user_id = p_user_id
      AND revoked_at IS NULL
      AND expires_at > NOW();

    GET DIAGNOSTICS v_revoked = ROW_COUNT;

    RAISE NOTICE '✅ % sessions révoquées pour user %', v_revoked, p_user_id;
    RETURN v_revoked;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FONCTION: Nettoyer sessions expirées
-- ============================================================

CREATE OR REPLACE FUNCTION mobile.cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM mobile.user_sessions
    WHERE expires_at < NOW() - INTERVAL '7 days';

    GET DIAGNOSTICS v_deleted = ROW_COUNT;

    RAISE NOTICE '✅ % sessions expirées supprimées', v_deleted;
    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- DONNÉES INITIALES: Utilisateurs de test
-- ============================================================

DO $$
DECLARE
    v_super_admin_id UUID;
    v_admin_id UUID;
    v_patron_id UUID;
BEGIN
    -- Super Admin (password: Admin123!)
    -- Hash généré avec bcrypt rounds=10
    SELECT mobile.create_user(
        'superadmin@ebp.com',
        '$2b$10$rJ8VQZ5yGZ5YH5xH5xH5xeO5yGZ5YH5xH5xH5xH5xH5xH5xH5xH5xe', -- Placeholder - à changer
        'Super Administrateur',
        'super_admin',
        NULL
    ) INTO v_super_admin_id;

    -- Admin (password: Admin123!)
    SELECT mobile.create_user(
        'admin@ebp.com',
        '$2b$10$rJ8VQZ5yGZ5YH5xH5xH5xeO5yGZ5YH5xH5xH5xH5xH5xH5xH5xH5xe', -- Placeholder - à changer
        'Administrateur',
        'admin',
        NULL
    ) INTO v_admin_id;

    -- Patron (password: Patron123!)
    SELECT mobile.create_user(
        'patron@ebp.com',
        '$2b$10$rJ8VQZ5yGZ5YH5xH5xH5xeO5yGZ5YH5xH5xH5xH5xH5xH5xH5xH5xe', -- Placeholder - à changer
        'Patron Bureau',
        'patron',
        NULL
    ) INTO v_patron_id;

    -- Marquer comme vérifiés
    UPDATE mobile.users
    SET is_verified = true
    WHERE id IN (v_super_admin_id, v_admin_id, v_patron_id);

    RAISE NOTICE '';
    RAISE NOTICE '✅ Utilisateurs de test créés:';
    RAISE NOTICE '   - superadmin@ebp.com (Super Admin)';
    RAISE NOTICE '   - admin@ebp.com (Admin)';
    RAISE NOTICE '   - patron@ebp.com (Patron)';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  ATTENTION: Changez les mots de passe par défaut!';
    RAISE NOTICE '';
END $$;

-- ============================================================
-- Vérification finale
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Migration 009 appliquée avec succès';
    RAISE NOTICE '📊 Tables créées:';
    RAISE NOTICE '   - mobile.users';
    RAISE NOTICE '   - mobile.user_sessions';
    RAISE NOTICE '';
    RAISE NOTICE '🔄 Fonctions créées:';
    RAISE NOTICE '   - mobile.create_user()';
    RAISE NOTICE '   - mobile.revoke_user_sessions()';
    RAISE NOTICE '   - mobile.cleanup_expired_sessions()';
    RAISE NOTICE '';
    RAISE NOTICE '👥 Utilisateurs test: 3 créés';
    RAISE NOTICE '';
END $$;
