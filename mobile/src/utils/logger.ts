/**
 * Service de logging centralisé
 * Enregistre tous les événements de l'application
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SYNC = 'SYNC',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: unknown;
}

const MAX_LOGS = 1000; // Conserver max 1000 logs
const STORAGE_KEY = '@logs';

class Logger {
  private logs: LogEntry[] = [];
  private isInitialized = false;

  /**
   * Initialiser le logger (charger les logs existants)
   */
  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const logsJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (logsJson) {
        this.logs = JSON.parse(logsJson);
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Erreur lors du chargement des logs:', error);
    }
  }

  /**
   * Ajouter un log
   */
  private async addLog(
    level: LogLevel,
    category: string,
    message: string,
    data?: unknown
  ): Promise<void> {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
    };

    this.logs.unshift(entry);

    // Limiter le nombre de logs
    if (this.logs.length > MAX_LOGS) {
      this.logs = this.logs.slice(0, MAX_LOGS);
    }

    // Sauvegarder
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des logs:', error);
    }

    // Afficher dans la console en dev
    if (__DEV__) {
      const prefix = `[${level}] [${category}]`;
      switch (level) {
        case LogLevel.ERROR:
          console.error(prefix, message, data);
          break;
        case LogLevel.WARN:
          console.warn(prefix, message, data);
          break;
        default:
          console.warn(prefix, message, data);
      }
    }
  }

  /**
   * Log de debug
   */
  async debug(category: string, message: string, data?: unknown): Promise<void> {
    await this.addLog(LogLevel.DEBUG, category, message, data);
  }

  /**
   * Log d'information
   */
  async info(category: string, message: string, data?: unknown): Promise<void> {
    await this.addLog(LogLevel.INFO, category, message, data);
  }

  /**
   * Log d'avertissement
   */
  async warn(category: string, message: string, data?: unknown): Promise<void> {
    await this.addLog(LogLevel.WARN, category, message, data);
  }

  /**
   * Log d'erreur
   */
  async error(category: string, message: string, data?: unknown): Promise<void> {
    await this.addLog(LogLevel.ERROR, category, message, data);
  }

  /**
   * Log de synchronisation
   */
  async sync(message: string, data?: unknown): Promise<void> {
    await this.addLog(LogLevel.SYNC, 'SYNC', message, data);
  }

  /**
   * Récupérer tous les logs
   */
  getLogs(): LogEntry[] {
    return this.logs;
  }

  /**
   * Récupérer les logs filtrés
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Récupérer les logs filtrés par catégorie
   */
  getLogsByCategory(category: string): LogEntry[] {
    return this.logs.filter((log) => log.category === category);
  }

  /**
   * Nettoyer tous les logs
   */
  async clearLogs(): Promise<void> {
    this.logs = [];
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erreur lors du nettoyage des logs:', error);
    }
  }

  /**
   * Exporter les logs en JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Export d'une instance unique
export const logger = new Logger();

// Auto-initialisation
logger.init();

export default logger;
