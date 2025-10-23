/**
 * Rôles utilisateurs pour l'application mobile
 */
export enum UserRole {
  /**
   * Super Admin - Accès total à tout (config, logs, users, data)
   */
  SUPER_ADMIN = 'super_admin',

  /**
   * Admin - Accès étendu (gestion users, config app)
   */
  ADMIN = 'admin',

  /**
   * Patron/Bureau - Dashboard, KPIs, vue globale
   */
  PATRON = 'patron',

  /**
   * Commercial - Affaires, devis, clients, documents vente
   */
  COMMERCIAL = 'commercial',

  /**
   * Chef de chantier - Projets, équipe, achats, ventes affaires
   */
  CHEF_CHANTIER = 'chef_chantier',

  /**
   * Technicien/Employé - Interventions terrain, clients, temps passés
   */
  TECHNICIEN = 'technicien',
}

/**
 * Hiérarchie des rôles (du plus élevé au plus bas)
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 100,
  [UserRole.ADMIN]: 80,
  [UserRole.PATRON]: 60,
  [UserRole.COMMERCIAL]: 40,
  [UserRole.CHEF_CHANTIER]: 40,
  [UserRole.TECHNICIEN]: 20,
};

/**
 * Permissions par rôle
 */
export const ROLE_PERMISSIONS = {
  [UserRole.SUPER_ADMIN]: [
    '*', // Accès total
  ],
  [UserRole.ADMIN]: [
    'users.read',
    'users.create',
    'users.update',
    'users.delete',
    'config.read',
    'config.update',
    'logs.read',
    'dashboard.read',
    'interventions.read',
    'sales.read',
    'projects.read',
    'documents.read',
    'sync.read',
    'sync.force',
  ],
  [UserRole.PATRON]: [
    'dashboard.read',
    'kpis.read',
    'interventions.read',
    'sales.read',
    'projects.read',
    'documents.read',
    'team.read',
    'sync.read',
  ],
  [UserRole.COMMERCIAL]: [
    'sales.read',
    'sales.create',
    'sales.update',
    'quotes.read',
    'quotes.create',
    'quotes.update',
    'documents.read',
    'customers.read',
    'contacts.read',
    'products.read',
    'sync.read',
  ],
  [UserRole.CHEF_CHANTIER]: [
    'projects.read',
    'projects.update',
    'deal_documents.read',
    'team.read',
    'stock.read',
    'stock.update',
    'timesheets.read',
    'timesheets.create',
    'sync.read',
  ],
  [UserRole.TECHNICIEN]: [
    'interventions.read',
    'interventions.update',
    'interventions.complete',
    'photos.upload',
    'signature.create',
    'customers.read',
    'timesheets.create',
    'expenses.create',
    'sync.read',
  ],
};
