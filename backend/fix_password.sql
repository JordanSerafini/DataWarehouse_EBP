-- Réinitialiser le mot de passe pour jordan@solution-logique.fr
-- Mot de passe: pass123

UPDATE mobile.users
SET
  password_hash = '$2b$10$s7v1qS8diweP2Sf9szGbO.MhkXJHij.AcMMa7.pc7coULO18ZMXKC',
  failed_login_attempts = 0,
  locked_until = NULL,
  updated_at = now()
WHERE email = 'jordan@solution-logique.fr';

-- Vérifier
SELECT email, password_hash, failed_login_attempts, locked_until, ninja_one_technician_id
FROM mobile.users
WHERE email = 'jordan@solution-logique.fr';
