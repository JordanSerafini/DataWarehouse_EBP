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
