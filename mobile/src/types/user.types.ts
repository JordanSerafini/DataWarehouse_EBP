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
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  colleagueId?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
