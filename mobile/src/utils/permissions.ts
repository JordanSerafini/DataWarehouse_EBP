/**
 * Système de gestion des permissions basé sur les rôles
 */

import { UserRole } from '../types/user.types';

/**
 * Définition des permissions par module
 */
export enum Permission {
  // Interventions
  VIEW_INTERVENTIONS = 'VIEW_INTERVENTIONS',
  VIEW_MY_INTERVENTIONS = 'VIEW_MY_INTERVENTIONS',
  VIEW_ALL_INTERVENTIONS = 'VIEW_ALL_INTERVENTIONS',
  CREATE_INTERVENTION = 'CREATE_INTERVENTION',
  EDIT_INTERVENTION = 'EDIT_INTERVENTION',
  DELETE_INTERVENTION = 'DELETE_INTERVENTION',
  START_INTERVENTION = 'START_INTERVENTION',
  COMPLETE_INTERVENTION = 'COMPLETE_INTERVENTION',
  CANCEL_INTERVENTION = 'CANCEL_INTERVENTION',
  UPLOAD_INTERVENTION_PHOTO = 'UPLOAD_INTERVENTION_PHOTO',
  UPLOAD_INTERVENTION_SIGNATURE = 'UPLOAD_INTERVENTION_SIGNATURE',

  // Clients
  VIEW_CUSTOMERS = 'VIEW_CUSTOMERS',
  CREATE_CUSTOMER = 'CREATE_CUSTOMER',
  EDIT_CUSTOMER = 'EDIT_CUSTOMER',
  DELETE_CUSTOMER = 'DELETE_CUSTOMER',
  VIEW_CUSTOMER_CONTACTS = 'VIEW_CUSTOMER_CONTACTS',

  // Projets
  VIEW_PROJECTS = 'VIEW_PROJECTS',
  VIEW_MY_PROJECTS = 'VIEW_MY_PROJECTS',
  VIEW_ALL_PROJECTS = 'VIEW_ALL_PROJECTS',
  CREATE_PROJECT = 'CREATE_PROJECT',
  EDIT_PROJECT = 'EDIT_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',
  VIEW_PROJECT_STATS = 'VIEW_PROJECT_STATS',

  // Ventes/Devis
  VIEW_SALES_DOCUMENTS = 'VIEW_SALES_DOCUMENTS',
  VIEW_MY_QUOTES = 'VIEW_MY_QUOTES',
  VIEW_ALL_QUOTES = 'VIEW_ALL_QUOTES',
  CREATE_QUOTE = 'CREATE_QUOTE',
  EDIT_QUOTE = 'EDIT_QUOTE',
  DELETE_QUOTE = 'DELETE_QUOTE',

  // Synchronisation
  TRIGGER_SYNC = 'TRIGGER_SYNC',
  VIEW_SYNC_STATUS = 'VIEW_SYNC_STATUS',

  // Tickets RMM NinjaOne
  VIEW_TICKETS = 'VIEW_TICKETS',
  VIEW_MY_TICKETS = 'VIEW_MY_TICKETS',
  VIEW_ALL_TICKETS = 'VIEW_ALL_TICKETS',
  SYNC_TICKETS = 'SYNC_TICKETS',
  VIEW_TICKET_STATS = 'VIEW_TICKET_STATS',

  // Administration
  VIEW_ALL_USERS = 'VIEW_ALL_USERS',
  CREATE_USER = 'CREATE_USER',
  EDIT_USER = 'EDIT_USER',
  DELETE_USER = 'DELETE_USER',
  VIEW_SYSTEM_STATS = 'VIEW_SYSTEM_STATS',
}

/**
 * Matrice des permissions par rôle
 */
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // Super Admin - Toutes les permissions
  [UserRole.SUPER_ADMIN]: Object.values(Permission),

  // Admin - Presque toutes les permissions sauf gestion système critique
  [UserRole.ADMIN]: [
    // Interventions
    Permission.VIEW_INTERVENTIONS,
    Permission.VIEW_ALL_INTERVENTIONS,
    Permission.CREATE_INTERVENTION,
    Permission.EDIT_INTERVENTION,
    Permission.DELETE_INTERVENTION,
    Permission.START_INTERVENTION,
    Permission.COMPLETE_INTERVENTION,
    Permission.CANCEL_INTERVENTION,
    Permission.UPLOAD_INTERVENTION_PHOTO,
    Permission.UPLOAD_INTERVENTION_SIGNATURE,

    // Clients
    Permission.VIEW_CUSTOMERS,
    Permission.CREATE_CUSTOMER,
    Permission.EDIT_CUSTOMER,
    Permission.DELETE_CUSTOMER,
    Permission.VIEW_CUSTOMER_CONTACTS,

    // Projets
    Permission.VIEW_PROJECTS,
    Permission.VIEW_ALL_PROJECTS,
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.DELETE_PROJECT,
    Permission.VIEW_PROJECT_STATS,

    // Ventes
    Permission.VIEW_SALES_DOCUMENTS,
    Permission.VIEW_ALL_QUOTES,
    Permission.CREATE_QUOTE,
    Permission.EDIT_QUOTE,
    Permission.DELETE_QUOTE,

    // Sync
    Permission.TRIGGER_SYNC,
    Permission.VIEW_SYNC_STATUS,

    // Tickets RMM (Admin voit tout)
    Permission.VIEW_TICKETS,
    Permission.VIEW_ALL_TICKETS,
    Permission.SYNC_TICKETS,
    Permission.VIEW_TICKET_STATS,

    // Admin
    Permission.VIEW_ALL_USERS,
    Permission.VIEW_SYSTEM_STATS,
  ],

  // Patron - Vue d'ensemble + gestion commerciale
  [UserRole.PATRON]: [
    // Interventions
    Permission.VIEW_INTERVENTIONS,
    Permission.VIEW_ALL_INTERVENTIONS,
    Permission.CREATE_INTERVENTION,
    Permission.EDIT_INTERVENTION,

    // Clients
    Permission.VIEW_CUSTOMERS,
    Permission.CREATE_CUSTOMER,
    Permission.EDIT_CUSTOMER,
    Permission.VIEW_CUSTOMER_CONTACTS,

    // Projets
    Permission.VIEW_PROJECTS,
    Permission.VIEW_ALL_PROJECTS,
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.VIEW_PROJECT_STATS,

    // Ventes
    Permission.VIEW_SALES_DOCUMENTS,
    Permission.VIEW_ALL_QUOTES,
    Permission.CREATE_QUOTE,
    Permission.EDIT_QUOTE,

    // Sync
    Permission.VIEW_SYNC_STATUS,

    // Tickets RMM (Patron voit tout)
    Permission.VIEW_TICKETS,
    Permission.VIEW_ALL_TICKETS,
    Permission.VIEW_TICKET_STATS,

    // Stats
    Permission.VIEW_SYSTEM_STATS,
  ],

  // Chef de Chantier - Gestion des interventions et projets
  [UserRole.CHEF_CHANTIER]: [
    // Interventions
    Permission.VIEW_INTERVENTIONS,
    Permission.VIEW_MY_INTERVENTIONS,
    Permission.CREATE_INTERVENTION,
    Permission.EDIT_INTERVENTION,
    Permission.START_INTERVENTION,
    Permission.COMPLETE_INTERVENTION,
    Permission.CANCEL_INTERVENTION,
    Permission.UPLOAD_INTERVENTION_PHOTO,
    Permission.UPLOAD_INTERVENTION_SIGNATURE,

    // Clients
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_CUSTOMER_CONTACTS,

    // Projets
    Permission.VIEW_PROJECTS,
    Permission.VIEW_MY_PROJECTS,
    Permission.EDIT_PROJECT,
    Permission.VIEW_PROJECT_STATS,

    // Ventes
    Permission.VIEW_SALES_DOCUMENTS,

    // Tickets RMM (Chef de chantier voit ses tickets)
    Permission.VIEW_TICKETS,
    Permission.VIEW_MY_TICKETS,

    // Sync
    Permission.VIEW_SYNC_STATUS,
  ],

  // Commercial - Gestion commerciale
  [UserRole.COMMERCIAL]: [
    // Interventions (lecture seule)
    Permission.VIEW_INTERVENTIONS,
    Permission.VIEW_MY_INTERVENTIONS,

    // Clients
    Permission.VIEW_CUSTOMERS,
    Permission.CREATE_CUSTOMER,
    Permission.EDIT_CUSTOMER,
    Permission.VIEW_CUSTOMER_CONTACTS,

    // Projets
    Permission.VIEW_PROJECTS,
    Permission.VIEW_MY_PROJECTS,
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,

    // Ventes
    Permission.VIEW_SALES_DOCUMENTS,
    Permission.VIEW_MY_QUOTES,
    Permission.CREATE_QUOTE,
    Permission.EDIT_QUOTE,

    // Tickets RMM (Commercial voit ses tickets)
    Permission.VIEW_TICKETS,
    Permission.VIEW_MY_TICKETS,

    // Sync
    Permission.VIEW_SYNC_STATUS,
  ],

  // Technicien - Interventions terrain uniquement
  [UserRole.TECHNICIEN]: [
    // Interventions
    Permission.VIEW_INTERVENTIONS,
    Permission.VIEW_MY_INTERVENTIONS,
    Permission.START_INTERVENTION,
    Permission.COMPLETE_INTERVENTION,
    Permission.UPLOAD_INTERVENTION_PHOTO,
    Permission.UPLOAD_INTERVENTION_SIGNATURE,

    // Clients (lecture seule)
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_CUSTOMER_CONTACTS,

    // Projets (lecture seule)
    Permission.VIEW_PROJECTS,

    // Ventes (lecture seule)
    Permission.VIEW_SALES_DOCUMENTS,

    // Tickets RMM (Technicien voit ses tickets)
    Permission.VIEW_TICKETS,
    Permission.VIEW_MY_TICKETS,

    // Sync
    Permission.VIEW_SYNC_STATUS,
  ],
};

/**
 * Vérifie si un rôle a une permission spécifique
 */
export const hasPermission = (
  userRole: UserRole,
  permission: Permission
): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions.includes(permission);
};

/**
 * Vérifie si un rôle a au moins une des permissions listées
 */
export const hasAnyPermission = (
  userRole: UserRole,
  permissions: Permission[]
): boolean => {
  return permissions.some((permission) => hasPermission(userRole, permission));
};

/**
 * Vérifie si un rôle a toutes les permissions listées
 */
export const hasAllPermissions = (
  userRole: UserRole,
  permissions: Permission[]
): boolean => {
  return permissions.every((permission) => hasPermission(userRole, permission));
};

/**
 * Récupère toutes les permissions d'un rôle
 */
export const getRolePermissions = (userRole: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[userRole];
};

/**
 * Vérifie si un rôle peut accéder à un écran
 */
export const canAccessScreen = (
  userRole: UserRole,
  screen: string
): boolean => {
  // Mapping écran -> permissions requises
  const screenPermissions: Record<string, Permission[]> = {
    // Planning - Tous les rôles
    Planning: [Permission.VIEW_INTERVENTIONS],

    // Tâches du jour - Tous les rôles
    Tasks: [Permission.VIEW_INTERVENTIONS],

    // Interventions
    Interventions: [Permission.VIEW_INTERVENTIONS],
    InterventionDetails: [Permission.VIEW_INTERVENTIONS],
    CreateIntervention: [Permission.CREATE_INTERVENTION],

    // Clients
    Customers: [Permission.VIEW_CUSTOMERS],
    CustomerDetails: [Permission.VIEW_CUSTOMERS],
    CreateCustomer: [Permission.CREATE_CUSTOMER],

    // Projets
    Projects: [Permission.VIEW_PROJECTS],
    ProjectDetails: [Permission.VIEW_PROJECTS],
    CreateProject: [Permission.CREATE_PROJECT],

    // Ventes
    Sales: [Permission.VIEW_SALES_DOCUMENTS],
    Quotes: [Permission.VIEW_MY_QUOTES, Permission.VIEW_ALL_QUOTES],

    // Admin
    Users: [Permission.VIEW_ALL_USERS],
    SystemStats: [Permission.VIEW_SYSTEM_STATS],
  };

  const requiredPermissions = screenPermissions[screen];
  if (!requiredPermissions) return true; // Pas de restriction

  return hasAnyPermission(userRole, requiredPermissions);
};

/**
 * Hook pour vérifier les permissions (à utiliser dans les composants)
 */
export const usePermission = (permission: Permission, userRole?: UserRole) => {
  // TODO: Récupérer le rôle depuis le store utilisateur si non fourni
  if (!userRole) return false;
  return hasPermission(userRole, permission);
};
