/**
 * Types relatifs aux utilisateurs
 */

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PATRON = 'PATRON',
  CHEF_CHANTIER = 'CHEF_CHANTIER',
  COMMERCIAL = 'COMMERCIAL',
  TECHNICIEN = 'TECHNICIEN',
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  colleagueId?: string;
  ninjaOneTechnicianId?: number; // ID du technicien dans NinjaOne RMM
  permissions: string[];
  isActive?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  deviceId?: string; // Optionnel, pour tracking
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Mapper pour convertir les rôles du backend (snake_case) vers le frontend (SCREAMING_SNAKE_CASE)
 */
export const mapBackendRole = (backendRole: string): UserRole => {
  const roleMap: Record<string, UserRole> = {
    'super_admin': UserRole.SUPER_ADMIN,
    'admin': UserRole.ADMIN,
    'patron': UserRole.PATRON,
    'chef_chantier': UserRole.CHEF_CHANTIER,
    'commercial': UserRole.COMMERCIAL,
    'technicien': UserRole.TECHNICIEN,
  };

  const mapped = roleMap[backendRole];
  if (!mapped) {
    console.warn(`[UserTypes] Rôle backend inconnu: "${backendRole}", utilisation de TECHNICIEN par défaut`);
    return UserRole.TECHNICIEN;
  }

  return mapped;
};
