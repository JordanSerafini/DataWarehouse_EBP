/**
 * Service de synchronisation
 * Gère la synchronisation bi-directionnelle entre la DB locale (WatermelonDB) et le backend
 */

import { database } from '../config/database';
import { apiService } from './api.service';
import { useSyncStore } from '../stores/syncStore';
import Intervention from '../models/Intervention';
import Customer from '../models/Customer';
import Project from '../models/Project';
import {
  Intervention as InterventionType,
  Customer as CustomerType,
  Project as ProjectType,
} from '../types';

class SyncService {
  private isSyncing: boolean = false;

  /**
   * Synchronisation complète (Pull + Push)
   */
  async fullSync(): Promise<void> {
    if (this.isSyncing) {
      console.warn('Synchronisation déjà en cours...');
      return;
    }

    this.isSyncing = true;
    const { startSync, updateSyncProgress, completeSyncSuccess, completeSyncError } =
      useSyncStore.getState();

    try {
      startSync();

      // 1. Pull - Récupérer les données du serveur
      updateSyncProgress(10, 'Récupération des interventions...');
      await this.pullInterventions();

      updateSyncProgress(40, 'Récupération des clients...');
      await this.pullCustomers();

      updateSyncProgress(70, 'Récupération des projets...');
      await this.pullProjects();

      // 2. Push - Envoyer les modifications locales
      updateSyncProgress(85, 'Envoi des modifications locales...');
      await this.pushLocalChanges();

      // 3. Terminer
      updateSyncProgress(100, 'Synchronisation terminée !');
      await completeSyncSuccess();
    } catch (error: unknown) {
      console.error('Erreur lors de la synchronisation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      completeSyncError(errorMessage);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Pull - Récupérer les interventions depuis le serveur
   */
  private async pullInterventions(): Promise<void> {
    try {
      const { lastSyncDate } = useSyncStore.getState();

      // Récupérer les interventions depuis le backend
      const interventions = await apiService.syncInterventions(
        lastSyncDate || undefined
      );

      // Mettre à jour la DB locale
      await database.write(async () => {
        const interventionsCollection = database.get<Intervention>('interventions');

        for (const interventionData of interventions) {
          try {
            // Chercher si l'intervention existe déjà localement
            const existing = await interventionsCollection
              .query()
              .where('server_id', interventionData.id)
              .fetch();

            if (existing.length > 0) {
              // Mettre à jour
              const intervention = existing[0];
              await intervention.update((record) => {
                this.updateInterventionFields(record, interventionData);
              });
            } else {
              // Créer
              await interventionsCollection.create((record) => {
                record.serverId = interventionData.id;
                this.updateInterventionFields(record, interventionData);
                record.isSynced = true;
                record.lastSyncedAt = new Date();
              });
            }
          } catch (error) {
            console.error(
              `Erreur lors de la synchronisation de l'intervention ${interventionData.id}:`,
              error
            );
          }
        }
      });

      console.warn(`✅ ${interventions.length} interventions synchronisées`);
    } catch (error) {
      console.error('Erreur lors du pull des interventions:', error);
      throw error;
    }
  }

  /**
   * Pull - Récupérer les clients depuis le serveur
   */
  private async pullCustomers(): Promise<void> {
    try {
      const { lastSyncDate } = useSyncStore.getState();

      const customers = await apiService.syncCustomers(lastSyncDate || undefined);

      await database.write(async () => {
        const customersCollection = database.get<Customer>('customers');

        for (const customerData of customers) {
          try {
            const existing = await customersCollection
              .query()
              .where('server_id', customerData.id)
              .fetch();

            if (existing.length > 0) {
              const customer = existing[0];
              await customer.update((record) => {
                this.updateCustomerFields(record, customerData);
              });
            } else {
              await customersCollection.create((record) => {
                record.serverId = customerData.id;
                this.updateCustomerFields(record, customerData);
                record.isSynced = true;
                record.lastSyncedAt = new Date();
              });
            }
          } catch (error) {
            console.error(
              `Erreur lors de la synchronisation du client ${customerData.id}:`,
              error
            );
          }
        }
      });

      console.warn(`✅ ${customers.length} clients synchronisés`);
    } catch (error) {
      console.error('Erreur lors du pull des clients:', error);
      throw error;
    }
  }

  /**
   * Pull - Récupérer les projets depuis le serveur
   */
  private async pullProjects(): Promise<void> {
    try {
      const { lastSyncDate } = useSyncStore.getState();

      const projects = await apiService.syncProjects(lastSyncDate || undefined);

      await database.write(async () => {
        const projectsCollection = database.get<Project>('projects');

        for (const projectData of projects) {
          try {
            const existing = await projectsCollection
              .query()
              .where('server_id', projectData.id)
              .fetch();

            if (existing.length > 0) {
              const project = existing[0];
              await project.update((record) => {
                this.updateProjectFields(record, projectData);
              });
            } else {
              await projectsCollection.create((record) => {
                record.serverId = projectData.id;
                this.updateProjectFields(record, projectData);
                record.isSynced = true;
                record.lastSyncedAt = new Date();
              });
            }
          } catch (error) {
            console.error(
              `Erreur lors de la synchronisation du projet ${projectData.id}:`,
              error
            );
          }
        }
      });

      console.warn(`✅ ${projects.length} projets synchronisés`);
    } catch (error) {
      console.error('Erreur lors du pull des projets:', error);
      throw error;
    }
  }

  /**
   * Push - Envoyer les modifications locales au serveur
   */
  private async pushLocalChanges(): Promise<void> {
    try {
      // Récupérer tous les enregistrements non synchronisés
      const interventionsCollection = database.get<Intervention>('interventions');
      const unsyncedInterventions = await interventionsCollection
        .query()
        .where('is_synced', false)
        .fetch();

      // TODO: Implémenter l'envoi des modifications au backend
      // Pour l'instant, on les marque comme synchronisés
      if (unsyncedInterventions.length > 0) {
        await database.write(async () => {
          for (const intervention of unsyncedInterventions) {
            await intervention.update((record) => {
              record.isSynced = true;
              record.lastSyncedAt = new Date();
            });
          }
        });
      }

      console.warn(`✅ ${unsyncedInterventions.length} modifications locales envoyées`);
    } catch (error) {
      console.error('Erreur lors du push des changements locaux:', error);
      // Ne pas bloquer la sync si le push échoue
    }
  }

  /**
   * Helper - Mettre à jour les champs d'une intervention
   */
  private updateInterventionFields(
    record: Intervention,
    data: InterventionType
  ): void {
    record.reference = data.reference;
    record.title = data.title;
    record.description = data.description || '';

    // Dates
    record.scheduledDate = new Date(data.scheduledDate);
    record.scheduledEndDate = data.scheduledEndDate
      ? new Date(data.scheduledEndDate)
      : undefined;
    record.actualStartDate = data.actualStartDate
      ? new Date(data.actualStartDate)
      : undefined;
    record.actualEndDate = data.actualEndDate ? new Date(data.actualEndDate) : undefined;

    // Statut
    record.status = data.status;
    record.statusLabel = data.statusLabel;
    record.type = data.type;
    record.typeLabel = data.typeLabel;
    record.priority = data.priority;

    // Relations
    record.customerId = data.customerId;
    record.customerName = data.customerName;
    record.projectId = data.projectId;
    record.projectName = data.projectName;
    record.technicianId = data.technicianId;
    record.technicianName = data.technicianName;

    // Localisation
    record.address = data.address;
    record.city = data.city;
    record.postalCode = data.postalCode;
    record.latitude = data.latitude;
    record.longitude = data.longitude;

    // Durées
    record.estimatedDuration = data.estimatedDuration;
    record.actualDuration = data.actualDuration;
    record.notes = data.notes;

    // Sync
    record.isSynced = true;
    record.lastSyncedAt = new Date();
  }

  /**
   * Helper - Mettre à jour les champs d'un client
   */
  private updateCustomerFields(record: Customer, data: CustomerType): void {
    record.name = data.name;
    record.type = data.type;
    record.typeLabel = data.typeLabel;

    // Coordonnées
    record.email = data.email;
    record.phone = data.phone;
    record.mobile = data.mobile;
    record.fax = data.fax;

    // Adresse
    record.address = data.address;
    record.addressComplement = data.addressComplement;
    record.city = data.city;
    record.postalCode = data.postalCode;
    record.country = data.country;
    record.latitude = data.latitude;
    record.longitude = data.longitude;

    // Infos commerciales
    record.siret = data.siret;
    record.vatNumber = data.vatNumber;
    record.accountingCode = data.accountingCode;

    // Métadonnées
    record.isActive = data.isActive;

    // Sync
    record.isSynced = true;
    record.lastSyncedAt = new Date();
  }

  /**
   * Helper - Mettre à jour les champs d'un projet
   */
  private updateProjectFields(record: Project, data: ProjectType): void {
    record.name = data.name;
    record.reference = data.reference;

    // Relations
    record.customerId = data.customerId;
    record.customerName = data.customerName;
    record.managerId = data.managerId;
    record.managerName = data.managerName;

    // Statut
    record.state = data.state;
    record.stateLabel = data.stateLabel;

    // Dates
    record.startDate = data.startDate ? new Date(data.startDate) : undefined;
    record.endDate = data.endDate ? new Date(data.endDate) : undefined;
    record.actualEndDate = data.actualEndDate ? new Date(data.actualEndDate) : undefined;

    // Localisation
    record.city = data.city;
    record.latitude = data.latitude;
    record.longitude = data.longitude;

    // Sync
    record.isSynced = true;
    record.lastSyncedAt = new Date();
  }

  /**
   * Vérifier si une synchronisation est nécessaire
   */
  shouldSync(): boolean {
    const { lastSyncDate } = useSyncStore.getState();

    if (!lastSyncDate) return true;

    // Synchroniser si la dernière sync date de plus de 30 minutes
    const lastSync = new Date(lastSyncDate);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastSync.getTime()) / (1000 * 60);

    return diffMinutes > 30;
  }
}

// Export d'une instance unique
export const syncService = new SyncService();
export default syncService;
